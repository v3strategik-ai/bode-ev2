"""
AI Email Generation Service for MATIKAI CRM
Uses OpenAI to generate personalized emails
"""

import os
import json
import logging
from typing import Optional, Dict, Any
import openai
from datetime import datetime
from ..models.email import AIEmailGenerationRequest

logger = logging.getLogger(__name__)

class AIEmailError(Exception):
    """Exception raised when AI email generation fails"""
    pass

class AIEmailService:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        
        if not self.api_key:
            logger.warning("OpenAI API key not found. AI email service will operate in mock mode.")
            self.mock_mode = True
        else:
            openai.api_key = self.api_key
            self.client = openai.OpenAI(api_key=self.api_key)
            self.mock_mode = False
            
    async def generate_email(self, request: AIEmailGenerationRequest) -> Dict[str, str]:
        """
        Generate a personalized email using AI
        
        Args:
            request: AIEmailGenerationRequest with all necessary context
            
        Returns:
            Dict with 'subject' and 'html_content' keys
        """
        try:
            if self.mock_mode:
                return self._generate_mock_email(request)
            
            # Create AI prompt based on context
            system_prompt = self._build_system_prompt()
            user_prompt = self._build_user_prompt(request)
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the AI response
            ai_response = response.choices[0].message.content
            return self._parse_ai_response(ai_response)
            
        except Exception as e:
            logger.error(f"Failed to generate AI email: {str(e)}")
            raise AIEmailError(f"AI email generation failed: {str(e)}")
    
    def _build_system_prompt(self) -> str:
        """Build the system prompt for AI email generation"""
        return """
        You are an expert email copywriter for MATIKAI, a leading provider of electric vehicle AI solutions.
        
        Your role is to create professional, engaging, and personalized emails that:
        1. Reflect MATIKAI's brand voice (professional, innovative, environmentally conscious)
        2. Are tailored to the electric vehicle charging industry
        3. Include relevant technical details about AI automation when appropriate
        4. Drive specific actions (calls, consultations, quote acceptance)
        5. Use modern, responsive HTML formatting
        
        MATIKAI Brand Guidelines:
        - Professional but approachable tone
        - Focus on sustainability and innovation
        - Emphasize reliability and expertise
        - Include specific EV industry knowledge
        - Always provide clear next steps
        
        Your response must be in JSON format with two keys:
        - "subject": A compelling email subject line (50-60 characters)
        - "html_content": Professional HTML email content with proper styling
        
        Include MATIKAI branding elements:
        - Company colors: #2c5530 (primary green), #f8f9fa (light background)
        - Professional styling with proper margins and padding
        - Clear call-to-action buttons
        - Contact information and company signature
        """
    
    def _build_user_prompt(self, request: AIEmailGenerationRequest) -> str:
        """Build the user prompt based on the request"""
        prompt = f"""
        Generate a personalized email for MATIKAI with the following details:

        RECIPIENT INFORMATION:
        - Name: {request.recipient_name}
        - Email: {request.recipient_email}
        
        EMAIL CONTEXT: {request.context}
        
        TONE: {request.tone}
        
        CUSTOMER DATA: {json.dumps(request.customer_data, indent=2)}
        """
        
        if request.call_to_action:
            prompt += f"\n\nCALL TO ACTION: {request.call_to_action}"
        
        # Add context-specific guidelines
        if "lead" in request.context.lower():
            prompt += """
            
            ADDITIONAL GUIDELINES FOR LEAD EMAILS:
            - Thank them for their interest in AI-powered business solutions
            - Mention specific benefits relevant to their industry/business
            - Include next steps (consultation, site assessment, quote)
            - Highlight MATIKAI's expertise and experience
            - Mention financing options and incentives if relevant
            """
        elif "service" in request.context.lower():
            prompt += """
            
            ADDITIONAL GUIDELINES FOR SERVICE EMAILS:
            - Confirm service details clearly
            - Set expectations for the service visit
            - Include technician information if available
            - Mention warranty and support information
            - Provide contact information for questions
            """
        elif "quote" in request.context.lower():
            prompt += """
            
            ADDITIONAL GUIDELINES FOR QUOTE EMAILS:
            - Clearly present the quote amount and what's included
            - Highlight value proposition and ROI
            - Mention financing options and incentives
            - Create urgency with expiration date
            - Make it easy to accept or request consultation
            """
        
        prompt += """
        
        IMPORTANT: Return ONLY a valid JSON object with 'subject' and 'html_content' keys.
        The HTML should be production-ready with proper styling, responsive design, and MATIKAI branding.
        """
        
        return prompt
    
    def _parse_ai_response(self, response: str) -> Dict[str, str]:
        """Parse the AI response and extract subject and content"""
        try:
            # Try to parse as JSON first
            if response.strip().startswith('{'):
                parsed = json.loads(response)
                if 'subject' in parsed and 'html_content' in parsed:
                    return parsed
            
            # If not JSON, try to extract subject and content manually
            lines = response.split('\n')
            subject = ""
            html_content = ""
            
            for i, line in enumerate(lines):
                if 'subject' in line.lower() and ':' in line:
                    subject = line.split(':', 1)[1].strip().strip('"')
                elif subject and not html_content:
                    # Everything after subject is content
                    html_content = '\n'.join(lines[i:]).strip()
                    break
            
            if subject and html_content:
                return {
                    "subject": subject,
                    "html_content": html_content
                }
            
            # Fallback: use entire response as content
            return {
                "subject": f"Message from MATIKAI - {datetime.now().strftime('%B %d')}",
                "html_content": self._wrap_in_html(response)
            }
            
        except Exception as e:
            logger.error(f"Failed to parse AI response: {str(e)}")
            # Return a safe fallback
            return {
                "subject": "Important Update from MATIKAI",
                "html_content": self._wrap_in_html(response)
            }
    
    def _wrap_in_html(self, content: str) -> str:
        """Wrap plain text content in HTML formatting"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2c5530;">MATIKAI</h2>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                    {content.replace(chr(10), '<br>')}
                </div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    MATIKAI - Leading provider of electric vehicle AI solutions
                </p>
            </div>
        </body>
        </html>
        """
    
    def _generate_mock_email(self, request: AIEmailGenerationRequest) -> Dict[str, str]:
        """Generate a mock email when API key is not available"""
        context_lower = request.context.lower()
        
        if "lead" in context_lower:
            subject = f"Thank you for your interest in AI automation, {request.recipient_name}!"
            content = self._get_mock_lead_email(request)
        elif "service" in context_lower:
            subject = f"Service Request Confirmed - {request.recipient_name}"
            content = self._get_mock_service_email(request)
        elif "quote" in context_lower:
            subject = f"Your MATIKAI Quote is Ready - {request.customer_data.get('quote_amount', 'Custom Quote')}"
            content = self._get_mock_quote_email(request)
        else:
            subject = f"Important Update from MATIKAI - {request.recipient_name}"
            content = self._get_mock_generic_email(request)
        
        return {
            "subject": subject,
            "html_content": content
        }
    
    def _get_mock_lead_email(self, request: AIEmailGenerationRequest) -> str:
        """Generate mock lead follow-up email"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #2c5530;">MATIKAI Solutions</h2>
                </div>
                
                <h2 style="color: #2c5530;">Thank you for your interest in AI-powered business solutions!</h2>
                
                <p>Dear {request.recipient_name},</p>
                
                <p>Thank you for reaching out to MATIKAI! We're excited to help you transform your business operations with advanced AI automation solutions.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c5530;">Why Choose MATIKAI?</h3>
                    <ul>
                        <li><strong>Industry Leaders:</strong> Over 10 years in business automation & AI solutions</li>
                        <li><strong>Expert Implementation:</strong> Professional, seamless integration processes</li>
                        <li><strong>Comprehensive Support:</strong> 24/7 AI monitoring and optimization</li>
                        <li><strong>ROI Focused:</strong> Solutions that deliver measurable business value</li>
                    </ul>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Schedule a free consultation to assess your automation needs</li>
                    <li>Receive a customized AI solution proposal within 48 hours</li>
                    <li>Explore available implementation packages and pricing</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://matikaiev.com/schedule" style="background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                        Schedule Your Free Consultation
                    </a>
                </div>
                
                <p>Best regards,<br>
                MATIKAI Team<br>
                Phone: (555) 123-4567<br>
                Email: info@matikaiev.com</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">
                    MATIKAI - Powering the future of transportation<br>
                    [AI Generated Email - Mock Mode]
                </p>
            </div>
        </body>
        </html>
        """
    
    def _get_mock_service_email(self, request: AIEmailGenerationRequest) -> str:
        """Generate mock service email"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5530;">Service Request Confirmed</h2>
                <p>Dear {request.recipient_name},</p>
                <p>Your service request has been confirmed. Our technical team will contact you within 24 hours to schedule your appointment.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Service Details:</strong> {request.customer_data.get('service_type', 'EV Charger Maintenance')}</p>
                    <p><strong>Priority:</strong> {request.customer_data.get('priority', 'Standard')}</p>
                </div>
                
                <p>Best regards,<br>MATIKAI Service Team</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">[AI Generated Email - Mock Mode]</p>
            </div>
        </body>
        </html>
        """
    
    def _get_mock_quote_email(self, request: AIEmailGenerationRequest) -> str:
        """Generate mock quote email"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5530;">Your Custom EV Charging Quote is Ready!</h2>
                <p>Dear {request.recipient_name},</p>
                <p>We've prepared a custom quote for your AI automation solutions needs.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h3 style="color: #2c5530;">Quote: {request.customer_data.get('quote_amount', '$15,750')}</h3>
                    <p>Quote ID: {request.customer_data.get('quote_id', 'BODE-' + str(int(datetime.now().timestamp())))}</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background: #2c5530; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Accept Quote</a>
                </div>
                
                <p>Best regards,<br>MATIKAI Sales Team</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">[AI Generated Email - Mock Mode]</p>
            </div>
        </body>
        </html>
        """
    
    def _get_mock_generic_email(self, request: AIEmailGenerationRequest) -> str:
        """Generate mock generic email"""
        return f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c5530;">Update from MATIKAI</h2>
                <p>Dear {request.recipient_name},</p>
                <p>We have an important update regarding your AI-powered business solutions.</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Context:</strong> {request.context}</p>
                    {f"<p><strong>Action Required:</strong> {request.call_to_action}</p>" if request.call_to_action else ""}
                </div>
                
                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>MATIKAI Team</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666; text-align: center;">[AI Generated Email - Mock Mode]</p>
            </div>
        </body>
        </html>
        """