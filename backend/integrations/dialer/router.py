"""
Dialer Router for MATIKAI CRM System
FastAPI endpoints for Twilio Voice API integration
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Optional
import logging
from datetime import datetime, timezone
from auth.auth_bearer import JWTBearer
from .service import DialerService, DialerError
from ..models.dialer import (
    CallRequest, CallResponse, CallRecord, BulkCallRequest, CallAnalytics
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dialer", tags=["dialer"])
jwt_bearer = JWTBearer()

# Service will be initialized in server.py and injected here
dialer_service = None

@router.post("/call", response_model=CallResponse)
async def make_call(
    request: CallRequest,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Initiate an outbound call
    """
    try:
        user_id = current_user if isinstance(current_user, str) else current_user.get("user_id", "unknown")
        result = await dialer_service.make_call(request, user_id)
        return result
    except DialerError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error making call: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to make call")

@router.get("/call/{call_id}", response_model=CallRecord)
async def get_call_status(
    call_id: str,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get the status and details of a specific call
    """
    try:
        result = await dialer_service.get_call_status(call_id)
        return result
    except DialerError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error fetching call status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch call status")

@router.post("/bulk-call", response_model=List[CallResponse])
async def make_bulk_calls(
    request: BulkCallRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Make multiple calls in bulk (processed in background)
    """
    try:
        user_id = current_user if isinstance(current_user, str) else current_user.get("user_id", "unknown")
        
        if request.schedule_time and request.schedule_time > datetime.now(timezone.utc):
            # Schedule for later (would be implemented with a task queue)
            background_tasks.add_task(
                dialer_service.bulk_call,
                request,
                user_id
            )
            
            # Return immediate response for scheduled calls
            responses = []
            for i, phone_number in enumerate(request.phone_numbers):
                responses.append(CallResponse(
                    success=True,
                    call_id=f"scheduled-{i}-{int(datetime.now().timestamp())}",
                    status="scheduled",
                    message=f"Call to {phone_number} scheduled for {request.schedule_time}"
                ))
            
            return responses
        else:
            # Make calls immediately
            result = await dialer_service.bulk_call(request, user_id)
            return result
            
    except DialerError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error making bulk calls: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to make bulk calls")

@router.get("/analytics", response_model=CallAnalytics)
async def get_call_analytics(
    start_date: datetime,
    end_date: datetime,
    user_id: Optional[str] = None,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get call analytics for a date range
    """
    try:
        # If no specific user_id provided, use current user's analytics
        if not user_id:
            user_id = current_user if isinstance(current_user, str) else current_user.get("user_id")
        
        result = await dialer_service.get_call_analytics(start_date, end_date, user_id)
        return result
    except Exception as e:
        logger.error(f"Failed to fetch call analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch call analytics")

@router.post("/twiml/lead-follow-up")
async def twiml_lead_follow_up():
    """
    TwiML webhook for lead follow-up calls
    """
    from twilio.twiml import VoiceResponse
    
    response = VoiceResponse()
    response.say(
        "Hello! This is a follow-up call from MATIKAI regarding your interest in our electric vehicle AI solutions. "
        "We'd love to discuss your specific needs and answer any questions you may have. "
        "Please hold while we connect you to one of our EV charging specialists, or press 1 to leave a voicemail.",
        voice='alice'
    )
    
    gather = response.gather(num_digits=1, timeout=10)
    gather.say("Press 1 to leave a message, or stay on the line to speak with a specialist.")
    
    return str(response)

@router.post("/twiml/customer-service")
async def twiml_customer_service():
    """
    TwiML webhook for customer service calls
    """
    from twilio.twiml import VoiceResponse
    
    response = VoiceResponse()
    response.say(
        "Thank you for calling MATIKAI customer service. "
        "We're here to help with any questions about your EV charging equipment or service needs. "
        "Please hold while we connect you to a customer service representative.",
        voice='alice'
    )
    
    # In a real implementation, this would connect to a queue or agent
    response.dial("+15551234567")  # Would be replaced with actual service number
    
    return str(response)

@router.post("/twiml/sales-call")
async def twiml_sales_call():
    """
    TwiML webhook for sales calls
    """
    from twilio.twiml import VoiceResponse
    
    response = VoiceResponse()
    response.say(
        "Hello! This is a call from MATIKAI's sales team. "
        "We have some exciting updates about our latest AI-powered business solutions that could benefit your business. "
        "Please hold while we connect you to one of our sales specialists.",
        voice='alice'
    )
    
    return str(response)

@router.post("/twiml/quote-follow-up")
async def twiml_quote_follow_up():
    """
    TwiML webhook for quote follow-up calls
    """
    from twilio.twiml import VoiceResponse
    
    response = VoiceResponse()
    response.say(
        "Hello! This is a follow-up call from MATIKAI regarding the quote we recently sent you. "
        "We wanted to answer any questions you might have and discuss next steps. "
        "Please hold while we connect you to your dedicated sales representative.",
        voice='alice'
    )
    
    return str(response)

@router.get("/status")
async def get_dialer_service_status():
    """
    Get dialer service status and configuration
    """
    return {
        "service_name": "MATIKAI Dialer Service",
        "twilio_configured": not dialer_service.mock_mode,
        "mock_mode": dialer_service.mock_mode,
        "phone_number": dialer_service.phone_number if not dialer_service.mock_mode else "Mock: +15551234567",
        "available_purposes": [
            "lead_follow_up",
            "customer_service",
            "sales_call",
            "technical_support",
            "appointment_reminder",
            "quote_follow_up"
        ],
        "features": [
            "Click-to-call from CRM",
            "Bulk calling campaigns",
            "Call recording and analytics",
            "Automated TwiML responses",
            "Integration with lead management"
        ]
    }