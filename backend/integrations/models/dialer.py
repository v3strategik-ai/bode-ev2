"""
Dialer Models for MATIKAI CRM System
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class CallStatus(str, Enum):
    INITIATED = "initiated"
    RINGING = "ringing"
    ANSWERED = "answered"
    COMPLETED = "completed"
    FAILED = "failed"
    BUSY = "busy"
    NO_ANSWER = "no-answer"
    CANCELED = "canceled"

class CallType(str, Enum):
    OUTBOUND = "outbound"
    INBOUND = "inbound"

class CallPurpose(str, Enum):
    LEAD_FOLLOW_UP = "lead_follow_up"
    CUSTOMER_SERVICE = "customer_service"
    SALES_CALL = "sales_call"
    TECHNICAL_SUPPORT = "technical_support"
    APPOINTMENT_REMINDER = "appointment_reminder"
    QUOTE_FOLLOW_UP = "quote_follow_up"

class CallRequest(BaseModel):
    to_number: str = Field(..., description="Phone number to call (E.164 format)")
    from_number: Optional[str] = Field(None, description="Caller ID number")
    purpose: CallPurpose
    customer_id: Optional[str] = None
    lead_id: Optional[str] = None
    notes: Optional[str] = None
    callback_url: Optional[str] = None

class CallResponse(BaseModel):
    success: bool
    call_id: str
    status: CallStatus
    message: str
    estimated_duration: Optional[int] = None  # seconds
    cost_estimate: Optional[str] = None

class CallRecord(BaseModel):
    call_id: str
    to_number: str
    from_number: str
    call_type: CallType
    purpose: CallPurpose
    status: CallStatus
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # seconds
    recording_url: Optional[str] = None
    cost: Optional[str] = None
    customer_id: Optional[str] = None
    lead_id: Optional[str] = None
    notes: Optional[str] = None
    follow_up_required: bool = False
    created_by: str  # user_id who initiated the call
    created_at: datetime
    updated_at: datetime

class BulkCallRequest(BaseModel):
    phone_numbers: List[str]
    purpose: CallPurpose
    message_template: Optional[str] = None
    schedule_time: Optional[datetime] = None  # For scheduled calls
    
class CallAnalytics(BaseModel):
    total_calls: int
    successful_calls: int
    failed_calls: int
    average_duration: float
    total_cost: str
    calls_by_purpose: Dict[str, int]
    calls_by_status: Dict[str, int]
    peak_call_hours: List[int]