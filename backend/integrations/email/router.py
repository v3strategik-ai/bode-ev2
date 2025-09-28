"""
Email Router for BODE EV CRM System
FastAPI endpoints for email automation and AI generation
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List
import logging
from datetime import datetime
from auth.auth_bearer import JWTBearer
from .service import EmailService, EmailDeliveryError
from .ai_service import AIEmailService, AIEmailError
from ..models.email import (
    EmailRequest, EmailResponse, LeadFollowUpRequest, 
    ServiceRequestConfirmation, QuoteFollowUpRequest,
    BulkEmailRequest, AIEmailGenerationRequest
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/email", tags=["email"])
jwt_bearer = JWTBearer()

# Initialize services
email_service = EmailService()
ai_email_service = AIEmailService()

@router.post("/send", response_model=EmailResponse)
async def send_email(
    request: EmailRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Send a single email
    """
    try:
        # Add email sending to background tasks for better performance
        background_tasks.add_task(
            email_service.send_email,
            request.to_email,
            request.subject,
            request.content,
            request.content_type,
            request.from_email
        )
        
        return EmailResponse(
            success=True,
            message_id="background-task-" + str(int(datetime.now().timestamp())),
            status_code=202,
            message="Email queued for delivery"
        )
    except EmailDeliveryError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/lead-follow-up", response_model=EmailResponse)
async def send_lead_follow_up(
    request: LeadFollowUpRequest,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Send automated lead follow-up email
    """
    try:
        result = await email_service.send_lead_follow_up_email(
            request.lead_email,
            request.lead_name,
            request.lead_score,
            request.estimated_value,
            request.sales_rep
        )
        return result
    except EmailDeliveryError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to send lead follow-up: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send lead follow-up email")

@router.post("/service-confirmation", response_model=EmailResponse)
async def send_service_confirmation(
    request: ServiceRequestConfirmation,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Send service request confirmation email
    """
    try:
        result = await email_service.send_service_request_confirmation(
            request.customer_email,
            request.customer_name,
            request.service_type,
            request.appointment_date,
            request.technician_name
        )
        return result
    except EmailDeliveryError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to send service confirmation: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send service confirmation email")

@router.post("/quote-follow-up", response_model=EmailResponse)
async def send_quote_follow_up(
    request: QuoteFollowUpRequest,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Send quote follow-up email
    """
    try:
        result = await email_service.send_quote_follow_up(
            request.customer_email,
            request.customer_name,
            request.quote_amount,
            request.quote_id,
            request.valid_until,
            request.sales_rep
        )
        return result
    except EmailDeliveryError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to send quote follow-up: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send quote follow-up email")

@router.post("/bulk-send", response_model=List[EmailResponse])
async def send_bulk_email(
    request: BulkEmailRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Send bulk emails to multiple recipients
    """
    try:
        # Process bulk emails in background
        background_tasks.add_task(
            email_service.send_bulk_campaign,
            request.recipients,
            request.subject,
            request.content,
            request.content_type
        )
        
        # Return immediate response for each recipient
        responses = []
        for i, recipient in enumerate(request.recipients):
            responses.append(EmailResponse(
                success=True,
                message_id=f"bulk-{i}-" + str(int(datetime.now().timestamp())),
                status_code=202,
                message=f"Email queued for {recipient}"
            ))
        
        return responses
    except Exception as e:
        logger.error(f"Failed to process bulk emails: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process bulk email request")

@router.post("/ai-generate")
async def generate_ai_email(
    request: AIEmailGenerationRequest,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Generate personalized email using AI
    """
    try:
        result = await ai_email_service.generate_email(request)
        return {
            "success": True,
            "subject": result["subject"],
            "html_content": result["html_content"],
            "message": "Email generated successfully"
        }
    except AIEmailError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to generate AI email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate AI email")

@router.post("/ai-send")
async def generate_and_send_ai_email(
    request: AIEmailGenerationRequest,
    current_user: dict = Depends(jwt_bearer)
):
    """
    Generate and send personalized email using AI
    """
    try:
        # Generate email using AI
        ai_result = await ai_email_service.generate_email(request)
        
        # Send the generated email
        email_result = await email_service.send_email(
            request.recipient_email,
            ai_result["subject"],
            ai_result["html_content"],
            "html"
        )
        
        return {
            "success": email_result.success,
            "message_id": email_result.message_id,
            "subject": ai_result["subject"],
            "status_code": email_result.status_code,
            "message": f"AI-generated email sent successfully to {request.recipient_name}"
        }
    except (AIEmailError, EmailDeliveryError) as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to generate and send AI email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate and send AI email")

@router.get("/status")
async def get_email_service_status():
    """
    Get email service status and configuration
    """
    return {
        "service_name": "BODE EV Email Service",
        "sendgrid_configured": not email_service.mock_mode,
        "ai_configured": not ai_email_service.mock_mode,
        "mock_mode": email_service.mock_mode,
        "sender_email": email_service.sender_email,
        "available_templates": [
            "lead_follow_up",
            "service_confirmation", 
            "quote_follow_up",
            "custom_ai_generated"
        ]
    }