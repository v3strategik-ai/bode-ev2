"""
Email Models for MATIKAI CRM System
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class EmailPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class EmailTemplate(BaseModel):
    template_id: str
    name: str
    subject: str
    html_content: str
    plain_content: Optional[str] = None
    category: str  # lead_follow_up, service_request, quote_follow_up, etc.
    variables: List[str] = []  # List of variables used in template
    created_at: datetime
    updated_at: datetime

class EmailRequest(BaseModel):
    to_email: EmailStr
    subject: str
    content: str
    content_type: str = "html"
    from_email: Optional[str] = None
    priority: EmailPriority = EmailPriority.MEDIUM

class EmailResponse(BaseModel):
    success: bool
    message_id: str
    status_code: int
    message: str

class LeadFollowUpRequest(BaseModel):
    lead_email: EmailStr
    lead_name: str
    lead_score: int
    estimated_value: str
    sales_rep: str = "MATIKAI Team"

class ServiceRequestConfirmation(BaseModel):
    customer_email: EmailStr
    customer_name: str
    service_type: str
    appointment_date: str
    technician_name: str = "TBD"

class QuoteFollowUpRequest(BaseModel):
    customer_email: EmailStr
    customer_name: str
    quote_amount: str
    quote_id: str
    valid_until: str
    sales_rep: str = "MATIKAI Sales Team"

class BulkEmailRequest(BaseModel):
    recipients: List[EmailStr]
    subject: str
    content: str
    content_type: str = "html"
    
class EmailCampaign(BaseModel):
    campaign_id: str
    name: str
    description: Optional[str] = None
    template_id: str
    recipients: List[EmailStr]
    scheduled_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    status: str  # draft, scheduled, sent, failed
    results: Optional[List[EmailResponse]] = []
    created_at: datetime
    updated_at: datetime

class AIEmailGenerationRequest(BaseModel):
    recipient_name: str
    recipient_email: EmailStr
    context: str  # What type of email (lead follow-up, service, quote, etc.)
    customer_data: Optional[Dict[str, Any]] = {}  # Customer-specific data
    tone: str = "professional"  # professional, friendly, urgent, etc.
    call_to_action: Optional[str] = None  # What action we want them to take