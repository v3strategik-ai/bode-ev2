"""
Email Service for MATIKAI AI CRM System
Handles SendGrid integration for email automation and campaigns
"""

import os
from typing import Optional, List, Dict, Any
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, To, Subject, Content, HtmlContent, PlainTextContent
import logging
from datetime import datetime
from ..models.email import EmailTemplate, EmailCampaign, EmailResponse
import json

logger = logging.getLogger(__name__)

class EmailDeliveryError(Exception):
    """Exception raised when email delivery fails"""
    pass

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.sender_email = os.getenv('SENDER_EMAIL', 'noreply@matikaiev.com')
        
        if not self.api_key:
            logger.warning("SendGrid API key not found. Email service will operate in mock mode.")
            self.mock_mode = True
        else:
            self.sg = SendGridAPIClient(self.api_key)
            self.mock_mode = False
            
    async def send_email(self, 
                        to_email: str, 
                        subject: str, 
                        content: str, 
                        content_type: str = "html",
                        from_email: Optional[str] = None) -> EmailResponse:
        """
        Send a single email via SendGrid
        
        Args:
            to_email: Recipient email address
            subject: Email subject line
            content: Email content (HTML or plain text)
            content_type: "html" or "plain"
            from_email: Optional sender email (defaults to configured sender)
            
        Returns:
            EmailResponse object with delivery status
        """
        try:
            sender = from_email or self.sender_email
            
            if self.mock_mode:
                logger.info(f"MOCK MODE: Email would be sent to {to_email} with subject '{subject}'")
                return EmailResponse(
                    success=True,
                    message_id="mock-message-id-" + str(int(datetime.now().timestamp())),
                    status_code=202,
                    message="Email queued successfully (mock mode)"
                )
            
            # Create SendGrid mail object
            mail = Mail(
                from_email=From(sender, "MATIKAI Team"),
                to_emails=To(to_email),
                subject=Subject(subject)
            )
            
            if content_type == "html":
                mail.content = HtmlContent(content)
            else:
                mail.content = PlainTextContent(content)
            
            # Send email
            response = self.sg.send(mail)
            
            return EmailResponse(
                success=response.status_code == 202,
                message_id=response.headers.get('X-Message-Id', 'unknown'),
                status_code=response.status_code,
                message="Email sent successfully" if response.status_code == 202 else "Email delivery failed"
            )
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            raise EmailDeliveryError(f"Failed to send email: {str(e)}")
    
    async def send_lead_follow_up_email(self, 
                                      lead_email: str, 
                                      lead_name: str, 
                                      lead_score: int,
                                      estimated_value: str,
                                      sales_rep: str = "MATIKAI Team") -> EmailResponse:
        """
        Send automated lead follow-up email
        """
        subject = f"Thank you for your interest in MATIKAI AI Solutions, {lead_name}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://matikaiev.com/logo.png" alt="MATIKAI" style="height: 60px;">
                </div>
                
                <h2 style="color: #2563eb;">Thank you for your interest in MATIKAI AI Solutions!</h2>
                
                <p>Dear {lead_name},</p>
                
                <p>Thank you for reaching out to MATIKAI! We're excited to help you with our advanced AI-powered business solutions and automation.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c5530;">Your Inquiry Details:</h3>
                    <ul>
                        <li><strong>Priority Score:</strong> {lead_score}/100 (High Priority)</li>
                        <li><strong>Estimated Project Value:</strong> {estimated_value}</li>
                        <li><strong>Assigned Representative:</strong> {sales_rep}</li>
                    </ul>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Our team will contact you within 24 hours</li>
                    <li>We'll schedule a consultation to understand your specific needs</li>
                    <li>You'll receive a customized quote within 48 hours</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://matikaiev.com/schedule-consultation" style="background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Schedule Your Consultation
                    </a>
                </div>
                
                <p>In the meantime, feel free to explore our <a href="https://matikaiev.com/products">product catalog</a> or check out our <a href="https://matikaiev.com/case-studies">customer success stories</a>.</p>
                
                <p>Best regards,<br>
                {sales_rep}<br>
                MATIKAI Solutions<br>
                Email: {self.sender_email}<br>
                Phone: (555) 123-4567</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    MATIKAI - Leading provider of electric vehicle charging solutions<br>
                    This email was sent because you expressed interest in our EV charging solutions.
                </p>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(lead_email, subject, html_content, "html")
    
    async def send_service_request_confirmation(self,
                                             customer_email: str,
                                             customer_name: str,
                                             service_type: str,
                                             appointment_date: str,
                                             technician_name: str = "TBD") -> EmailResponse:
        """
        Send service request confirmation email
        """
        subject = f"Service Request Confirmed - {service_type}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://matikaiev.com/logo.png" alt="MATIKAI" style="height: 60px;">
                </div>
                
                <h2 style="color: #2c5530;">Service Request Confirmed</h2>
                
                <p>Dear {customer_name},</p>
                
                <p>Your service request has been received and confirmed. Our technical team will be in touch soon to assist you.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c5530;">Service Details:</h3>
                    <ul>
                        <li><strong>Service Type:</strong> {service_type}</li>
                        <li><strong>Scheduled Date:</strong> {appointment_date}</li>
                        <li><strong>Assigned Technician:</strong> {technician_name}</li>
                    </ul>
                </div>
                
                <p><strong>What to Expect:</strong></p>
                <ul>
                    <li>Technician will arrive within the scheduled time window</li>
                    <li>All necessary equipment will be provided</li>
                    <li>Service completion report will be emailed to you</li>
                    <li>30-day warranty on all service work</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://matikaiev.com/service-portal" style="background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Track Service Request
                    </a>
                </div>
                
                <p>If you need to reschedule or have questions, please contact our service team at service@matikaiev.com or call (555) 123-4567.</p>
                
                <p>Best regards,<br>
                MATIKAI Service Team</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    MATIKAI Service Excellence - Your trusted EV charging partner<br>
                    Service hours: Monday-Friday 8AM-6PM, Saturday 9AM-3PM
                </p>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(customer_email, subject, html_content, "html")
    
    async def send_quote_follow_up(self,
                                 customer_email: str,
                                 customer_name: str,
                                 quote_amount: str,
                                 quote_id: str,
                                 valid_until: str,
                                 sales_rep: str = "MATIKAI Sales Team") -> EmailResponse:
        """
        Send quote follow-up email
        """
        subject = f"Your MATIKAI Quote #{quote_id} - {quote_amount}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://matikaiev.com/logo.png" alt="MATIKAI" style="height: 60px;">
                </div>
                
                <h2 style="color: #2c5530;">Your Custom EV Charging Quote is Ready!</h2>
                
                <p>Dear {customer_name},</p>
                
                <p>Thank you for choosing MATIKAI for your electric vehicle charging needs. We've prepared a custom quote based on your requirements.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h3 style="margin-top: 0; color: #2c5530;">Quote Summary</h3>
                    <p style="font-size: 24px; font-weight: bold; color: #2c5530; margin: 10px 0;">{quote_amount}</p>
                    <p><strong>Quote ID:</strong> {quote_id}</p>
                    <p><strong>Valid Until:</strong> {valid_until}</p>
                </div>
                
                <p><strong>What's Included:</strong></p>
                <ul>
                    <li>Professional installation by certified technicians</li>
                    <li>All necessary electrical work and permits</li>
                    <li>2-year comprehensive warranty</li>
                    <li>24/7 customer support</li>
                    <li>Mobile app for monitoring and management</li>
                </ul>
                
                <p><strong>Available Financing Options:</strong></p>
                <ul>
                    <li>0% APR for qualified customers (first 12 months)</li>
                    <li>Federal and state tax incentives available</li>
                    <li>Flexible payment plans</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://matikaiev.com/accept-quote/{quote_id}" style="background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 0 10px;">
                        Accept Quote
                    </a>
                    <a href="https://matikaiev.com/schedule-call/{quote_id}" style="background: #fff; color: #2c5530; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; border: 2px solid #2c5530; margin: 0 10px;">
                        Schedule Call
                    </a>
                </div>
                
                <p>Questions about your quote? Feel free to reach out to {sales_rep} or call us at (555) 123-4567.</p>
                
                <p>Best regards,<br>
                {sales_rep}<br>
                MATIKAI Solutions</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    MATIKAI - Powering the future of transportation<br>
                    Quote expires on {valid_until}. Contact us to extend if needed.
                </p>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(customer_email, subject, html_content, "html")

    async def send_bulk_campaign(self, 
                               recipients: List[str], 
                               subject: str, 
                               content: str,
                               content_type: str = "html") -> List[EmailResponse]:
        """
        Send bulk email campaign to multiple recipients
        """
        results = []
        for recipient in recipients:
            try:
                result = await self.send_email(recipient, subject, content, content_type)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to send email to {recipient}: {str(e)}")
                results.append(EmailResponse(
                    success=False,
                    message_id="",
                    status_code=500,
                    message=f"Failed to send: {str(e)}"
                ))
        
        return results