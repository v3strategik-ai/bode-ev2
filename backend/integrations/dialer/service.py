"""
Dialer Service for BODE EV CRM System
Handles Twilio Voice API integration for making calls
"""

import os
import logging
from typing import Optional, List, Dict, Any
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from datetime import datetime, timezone
import uuid
from ..models.dialer import (
    CallRequest, CallResponse, CallRecord, CallStatus, 
    CallType, CallPurpose, BulkCallRequest, CallAnalytics
)

logger = logging.getLogger(__name__)

class DialerError(Exception):
    """Exception raised when dialer operations fail"""
    pass

class DialerService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if not all([self.account_sid, self.auth_token, self.phone_number]):
            logger.warning("Twilio credentials not found. Dialer service will operate in mock mode.")
            self.mock_mode = True
            self.client = None
        else:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                self.mock_mode = False
                logger.info("Twilio client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {str(e)}")
                self.mock_mode = True
                self.client = None
    
    async def make_call(self, request: CallRequest, user_id: str) -> CallResponse:
        """
        Initiate an outbound call
        
        Args:
            request: CallRequest with call details
            user_id: ID of the user making the call
            
        Returns:
            CallResponse with call status and details
        """
        try:
            call_id = str(uuid.uuid4())
            
            if self.mock_mode:
                return self._make_mock_call(request, call_id)
            
            # Validate phone number format
            if not self._is_valid_phone_number(request.to_number):
                raise DialerError(f"Invalid phone number format: {request.to_number}")
            
            # Use provided from_number or default Twilio number
            from_number = request.from_number or self.phone_number
            
            # Create call through Twilio
            call = self.client.calls.create(
                to=request.to_number,
                from_=from_number,
                url=self._generate_twiml_url(request.purpose),
                status_callback=request.callback_url,
                status_callback_event=['initiated', 'ringing', 'answered', 'completed'],
                record=True  # Record calls for quality assurance
            )
            
            # Save call record to database (would be implemented)
            call_record = CallRecord(
                call_id=call.sid,
                to_number=request.to_number,
                from_number=from_number,
                call_type=CallType.OUTBOUND,
                purpose=request.purpose,
                status=CallStatus.INITIATED,
                start_time=datetime.now(timezone.utc),
                customer_id=request.customer_id,
                lead_id=request.lead_id,
                notes=request.notes,
                created_by=user_id,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            
            # Here you would save to database
            # await self._save_call_record(call_record)
            
            return CallResponse(
                success=True,
                call_id=call.sid,
                status=CallStatus.INITIATED,
                message="Call initiated successfully",
                estimated_duration=120,  # 2 minutes average
                cost_estimate="$0.02/min"
            )
            
        except TwilioException as e:
            logger.error(f"Twilio error making call: {str(e)}")
            raise DialerError(f"Failed to make call: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error making call: {str(e)}")
            raise DialerError(f"Call failed: {str(e)}")
    
    async def get_call_status(self, call_id: str) -> CallRecord:
        """
        Get the current status of a call
        """
        try:
            if self.mock_mode:
                return self._get_mock_call_status(call_id)
            
            call = self.client.calls(call_id).fetch()
            
            # Convert Twilio status to our CallStatus enum
            status_mapping = {
                'queued': CallStatus.INITIATED,
                'ringing': CallStatus.RINGING,
                'in-progress': CallStatus.ANSWERED,
                'completed': CallStatus.COMPLETED,
                'failed': CallStatus.FAILED,
                'busy': CallStatus.BUSY,
                'no-answer': CallStatus.NO_ANSWER,
                'canceled': CallStatus.CANCELED
            }
            
            status = status_mapping.get(call.status, CallStatus.FAILED)
            
            # Calculate duration if call is completed
            duration = None
            if call.duration:
                duration = int(call.duration)
            
            return CallRecord(
                call_id=call.sid,
                to_number=call.to,
                from_number=call.from_,
                call_type=CallType.OUTBOUND,
                purpose=CallPurpose.SALES_CALL,  # Would be retrieved from database
                status=status,
                start_time=call.date_created,
                end_time=call.end_time,
                duration=duration,
                recording_url=f"https://api.twilio.com/2010-04-01/Accounts/{self.account_sid}/Recordings/{call.sid}.mp3",
                cost=str(call.price) if call.price else None,
                created_by="system",  # Would be retrieved from database
                created_at=call.date_created,
                updated_at=call.date_updated or call.date_created
            )
            
        except TwilioException as e:
            logger.error(f"Twilio error fetching call status: {str(e)}")
            raise DialerError(f"Failed to fetch call status: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error fetching call status: {str(e)}")
            raise DialerError(f"Call status fetch failed: {str(e)}")
    
    async def bulk_call(self, request: BulkCallRequest, user_id: str) -> List[CallResponse]:
        """
        Make multiple calls in bulk
        """
        results = []
        
        for phone_number in request.phone_numbers:
            try:
                call_request = CallRequest(
                    to_number=phone_number,
                    purpose=request.purpose,
                    notes=f"Bulk call - {request.message_template}" if request.message_template else None
                )
                
                result = await self.make_call(call_request, user_id)
                results.append(result)
                
                # Add small delay between calls to avoid rate limiting
                await self._add_delay(1)  # 1 second delay
                
            except Exception as e:
                logger.error(f"Failed to call {phone_number}: {str(e)}")
                results.append(CallResponse(
                    success=False,
                    call_id="",
                    status=CallStatus.FAILED,
                    message=f"Failed to call {phone_number}: {str(e)}"
                ))
        
        return results
    
    async def get_call_analytics(self, 
                               start_date: datetime, 
                               end_date: datetime,
                               user_id: Optional[str] = None) -> CallAnalytics:
        """
        Get call analytics for a date range
        """
        # In a real implementation, this would query the database
        # For now, return mock analytics
        
        if self.mock_mode:
            return CallAnalytics(
                total_calls=45,
                successful_calls=38,
                failed_calls=7,
                average_duration=142.5,
                total_cost="$15.75",
                calls_by_purpose={
                    "lead_follow_up": 20,
                    "customer_service": 15,
                    "sales_call": 8,
                    "technical_support": 2
                },
                calls_by_status={
                    "completed": 38,
                    "failed": 4,
                    "no_answer": 3
                },
                peak_call_hours=[10, 11, 14, 15, 16]
            )
        
        # Real implementation would query database and calculate analytics
        return CallAnalytics(
            total_calls=0,
            successful_calls=0,
            failed_calls=0,
            average_duration=0.0,
            total_cost="$0.00",
            calls_by_purpose={},
            calls_by_status={},
            peak_call_hours=[]
        )
    
    def _make_mock_call(self, request: CallRequest, call_id: str) -> CallResponse:
        """Generate a mock call response"""
        logger.info(f"MOCK MODE: Would call {request.to_number} for {request.purpose}")
        
        return CallResponse(
            success=True,
            call_id=call_id,
            status=CallStatus.INITIATED,
            message="Call initiated successfully (mock mode)",
            estimated_duration=120,
            cost_estimate="$0.02/min (mock)"
        )
    
    def _get_mock_call_status(self, call_id: str) -> CallRecord:
        """Generate a mock call status"""
        return CallRecord(
            call_id=call_id,
            to_number="+15551234567",
            from_number="+15559876543",
            call_type=CallType.OUTBOUND,
            purpose=CallPurpose.LEAD_FOLLOW_UP,
            status=CallStatus.COMPLETED,
            start_time=datetime.now(timezone.utc),
            end_time=datetime.now(timezone.utc),
            duration=125,
            cost="$4.17",
            created_by="mock_user",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
    
    def _is_valid_phone_number(self, phone: str) -> bool:
        """
        Validate phone number format (E.164)
        """
        # Basic E.164 validation
        if not phone.startswith('+'):
            return False
        
        # Remove + and check if remaining characters are digits
        digits = phone[1:]
        if not digits.isdigit():
            return False
        
        # Check length (E.164 allows 7-15 digits)
        if len(digits) < 7 or len(digits) > 15:
            return False
        
        return True
    
    def _generate_twiml_url(self, purpose: CallPurpose) -> str:
        """
        Generate TwiML URL for different call purposes
        In a real implementation, these would be actual webhook URLs
        """
        base_url = "https://your-domain.com/api/dialer/twiml"
        
        purpose_mapping = {
            CallPurpose.LEAD_FOLLOW_UP: f"{base_url}/lead-follow-up",
            CallPurpose.CUSTOMER_SERVICE: f"{base_url}/customer-service",
            CallPurpose.SALES_CALL: f"{base_url}/sales-call",
            CallPurpose.TECHNICAL_SUPPORT: f"{base_url}/technical-support",
            CallPurpose.APPOINTMENT_REMINDER: f"{base_url}/appointment-reminder",
            CallPurpose.QUOTE_FOLLOW_UP: f"{base_url}/quote-follow-up"
        }
        
        return purpose_mapping.get(purpose, f"{base_url}/default")
    
    async def _add_delay(self, seconds: int):
        """Add delay between operations"""
        import asyncio
        await asyncio.sleep(seconds)