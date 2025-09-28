from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Import team messenger components
from integrations.messenger.router import router as messenger_router
from integrations.messenger.service import MessengerService
from integrations.messenger.test_client import test_router as messenger_test_router

# Import AWS S3 components
from integrations.aws.router import router as s3_router
from integrations.aws.service import S3Service
from integrations.aws.test_client import test_router as files_test_router

# Import Email and Dialer components  
from integrations.email.router import router as email_router
from integrations.dialer.router import router as dialer_router


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# AI-powered Lead Scoring Models
class LeadData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_name: str
    contact_email: str
    contact_phone: Optional[str] = None
    industry: str
    company_size: str  # "1-10", "11-50", "51-200", "201-1000", "1000+"
    estimated_budget: float
    location: str
    current_ev_infrastructure: str  # "none", "basic", "advanced"
    timeline: str  # "immediate", "3-6 months", "6-12 months", "1+ years"
    lead_source: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
class LeadScoreResult(BaseModel):
    lead_id: str
    score: int  # 0-100
    priority: str  # "high", "medium", "low"
    reasoning: str
    recommended_actions: List[str]
    estimated_value: float

# Dynamic Pricing Models
class PricingRequest(BaseModel):
    product_id: str
    customer_type: str  # "commercial", "residential", "government"
    quantity: int
    location: str
    installation_complexity: str  # "simple", "moderate", "complex"
    timeline: str
    competitor_pricing: Optional[float] = None

class PricingRecommendation(BaseModel):
    base_price: float
    recommended_price: float
    discount_percentage: float
    pricing_strategy: str
    confidence_level: float
    reasoning: str

# Seasonal Forecasting Models
class ForecastRequest(BaseModel):
    product_category: str
    region: str
    time_horizon: str  # "3_months", "6_months", "12_months"

class DemandForecast(BaseModel):
    period: str
    predicted_demand: int
    confidence_interval: Dict[str, int]  # {"low": 80, "high": 120}
    seasonal_factors: List[str]
    recommended_inventory: int

# Customer Lifetime Value Models
class CustomerData(BaseModel):
    customer_id: str
    acquisition_cost: float
    monthly_revenue: float
    customer_segment: str
    tenure_months: int
    support_tickets: int
    expansion_purchases: int

class CLVPrediction(BaseModel):
    customer_id: str
    predicted_clv: float
    risk_score: float  # 0-1 (churn risk)
    recommended_actions: List[str]
    value_drivers: List[str]

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Initialize AI Chat
def get_ai_chat(session_id: str = "ai_analytics"):
    return LlmChat(
        api_key=os.environ.get("EMERGENT_LLM_KEY"),
        session_id=session_id,
        system_message="You are an AI analytics expert for BODE EV, specializing in lead scoring, pricing optimization, demand forecasting, and customer lifetime value predictions for EV charging station sales."
    ).with_model("openai", "gpt-4o")

# AI Lead Scoring Endpoint
@api_router.post("/ai/lead-scoring", response_model=LeadScoreResult)
async def score_lead(lead_data: LeadData):
    try:
        chat = get_ai_chat("lead_scoring")
        
        prompt = f"""
        Analyze this lead and provide a comprehensive scoring (0-100) for BODE EV charging station sales:
        
        Company: {lead_data.company_name}
        Industry: {lead_data.industry}
        Company Size: {lead_data.company_size}
        Budget: ${lead_data.estimated_budget:,.2f}
        Location: {lead_data.location}
        Current EV Infrastructure: {lead_data.current_ev_infrastructure}
        Timeline: {lead_data.timeline}
        Lead Source: {lead_data.lead_source}
        
        Consider factors like:
        - Budget alignment with our product range ($45,000-$250,000)
        - Industry fit for EV adoption
        - Company size and potential for fleet electrification
        - Geographic location and EV market maturity
        - Urgency of timeline
        - Current infrastructure (upgrade potential)
        
        Respond in JSON format:
        {{
            "score": <0-100 integer>,
            "priority": "<high/medium/low>",
            "reasoning": "<detailed explanation>",
            "recommended_actions": ["<action1>", "<action2>", "<action3>"],
            "estimated_value": <potential deal value in dollars>
        }}
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Debug: Log the raw response
        logger.info(f"AI Lead Scoring Response: {response}")
        
        # Parse AI response - handle potential JSON formatting issues
        try:
            # Try to extract JSON from response if it's wrapped in text
            response_text = str(response).strip()
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            ai_result = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed for response: {response}")
            raise HTTPException(status_code=500, detail=f"Invalid AI response format: {str(e)}")
        
        result = LeadScoreResult(
            lead_id=lead_data.id,
            score=ai_result["score"],
            priority=ai_result["priority"],
            reasoning=ai_result["reasoning"],
            recommended_actions=ai_result["recommended_actions"],
            estimated_value=ai_result["estimated_value"]
        )
        
        # Store lead data and scoring in database
        lead_dict = lead_data.dict()
        await db.leads.insert_one(lead_dict)
        
        score_dict = result.dict()
        await db.lead_scores.insert_one(score_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"Lead scoring error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lead scoring failed: {str(e)}")

# Dynamic Pricing Endpoint
@api_router.post("/ai/dynamic-pricing", response_model=PricingRecommendation)
async def get_pricing_recommendation(pricing_request: PricingRequest):
    try:
        chat = get_ai_chat("pricing_optimization")
        
        prompt = f"""
        Provide dynamic pricing recommendation for BODE EV charging station:
        
        Product ID: {pricing_request.product_id}
        Customer Type: {pricing_request.customer_type}
        Quantity: {pricing_request.quantity}
        Location: {pricing_request.location}
        Installation Complexity: {pricing_request.installation_complexity}
        Timeline: {pricing_request.timeline}
        Competitor Pricing: ${pricing_request.competitor_pricing or 'Unknown'}
        
        Base pricing ranges:
        - FastCharge Pro 150kW: $45,000
        - UltraCharge 250kW: $75,000
        
        Consider:
        - Volume discounts (5+ units: 5%, 10+ units: 10%, 20+ units: 15%)
        - Customer type premiums/discounts
        - Geographic market conditions
        - Installation complexity adjustments
        - Competitive positioning
        - Urgency/timeline factors
        
        Respond in JSON format:
        {{
            "base_price": <base price per unit>,
            "recommended_price": <final recommended price per unit>,
            "discount_percentage": <percentage discount applied>,
            "pricing_strategy": "<strategy description>",
            "confidence_level": <0.0-1.0>,
            "reasoning": "<detailed explanation>"
        }}
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Debug: Log the raw response
        logger.info(f"AI Pricing Response: {response}")
        
        # Parse AI response - handle potential JSON formatting issues
        try:
            # Try to extract JSON from response if it's wrapped in text
            response_text = str(response).strip()
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            ai_result = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed for response: {response}")
            raise HTTPException(status_code=500, detail=f"Invalid AI response format: {str(e)}")
        
        result = PricingRecommendation(**ai_result)
        
        # Store pricing request and recommendation
        request_dict = pricing_request.dict()
        request_dict["id"] = str(uuid.uuid4())
        request_dict["created_at"] = datetime.now(timezone.utc)
        await db.pricing_requests.insert_one(request_dict)
        
        recommendation_dict = result.dict()
        recommendation_dict["request_id"] = request_dict["id"]
        recommendation_dict["created_at"] = datetime.now(timezone.utc)
        await db.pricing_recommendations.insert_one(recommendation_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"Pricing recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Pricing recommendation failed: {str(e)}")

# Seasonal Demand Forecasting Endpoint
@api_router.post("/ai/demand-forecast", response_model=List[DemandForecast])
async def get_demand_forecast(forecast_request: ForecastRequest):
    try:
        chat = get_ai_chat("demand_forecasting")
        
        prompt = f"""
        Generate seasonal demand forecast for BODE EV charging stations:
        
        Product Category: {forecast_request.product_category}
        Region: {forecast_request.region}
        Time Horizon: {forecast_request.time_horizon}
        
        Consider factors:
        - EV adoption trends in the region
        - Government incentives and policies
        - Seasonal business patterns
        - Infrastructure development plans
        - Economic factors
        - Competition landscape
        
        Generate monthly forecasts with confidence intervals.
        
        Respond in JSON format as an array:
        [
            {{
                "period": "2025-10",
                "predicted_demand": <units>,
                "confidence_interval": {{"low": <units>, "high": <units>}},
                "seasonal_factors": ["<factor1>", "<factor2>"],
                "recommended_inventory": <units>
            }},
            ...
        ]
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Debug: Log the raw response
        logger.info(f"AI Forecast Response: {response}")
        
        # Parse AI response - handle potential JSON formatting issues
        try:
            # Try to extract JSON from response if it's wrapped in text
            response_text = str(response).strip()
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            ai_result = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed for response: {response}")
            raise HTTPException(status_code=500, detail=f"Invalid AI response format: {str(e)}")
        
        results = [DemandForecast(**forecast) for forecast in ai_result]
        
        # Store forecast request and results
        request_dict = forecast_request.dict()
        request_dict["id"] = str(uuid.uuid4())
        request_dict["created_at"] = datetime.now(timezone.utc)
        await db.forecast_requests.insert_one(request_dict)
        
        for result in results:
            forecast_dict = result.dict()
            forecast_dict["request_id"] = request_dict["id"]
            forecast_dict["created_at"] = datetime.now(timezone.utc)
            await db.demand_forecasts.insert_one(forecast_dict)
        
        return results
        
    except Exception as e:
        logger.error(f"Demand forecasting error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Demand forecasting failed: {str(e)}")

# Customer Lifetime Value Prediction Endpoint
@api_router.post("/ai/clv-prediction", response_model=CLVPrediction)
async def predict_customer_lifetime_value(customer_data: CustomerData):
    try:
        chat = get_ai_chat("clv_prediction")
        
        prompt = f"""
        Predict Customer Lifetime Value for BODE EV customer:
        
        Customer ID: {customer_data.customer_id}
        Acquisition Cost: ${customer_data.acquisition_cost:,.2f}
        Monthly Revenue: ${customer_data.monthly_revenue:,.2f}
        Customer Segment: {customer_data.customer_segment}
        Tenure (months): {customer_data.tenure_months}
        Support Tickets: {customer_data.support_tickets}
        Expansion Purchases: {customer_data.expansion_purchases}
        
        Consider:
        - Monthly revenue trends
        - Customer segment characteristics
        - Support engagement patterns
        - Expansion purchase behavior
        - Industry retention rates for EV infrastructure
        - Typical customer lifecycle in B2B EV charging
        
        Respond in JSON format:
        {{
            "predicted_clv": <total CLV in dollars>,
            "risk_score": <0.0-1.0 churn risk>,
            "recommended_actions": ["<action1>", "<action2>"],
            "value_drivers": ["<driver1>", "<driver2>"]
        }}
        """
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Debug: Log the raw response
        logger.info(f"AI CLV Response: {response}")
        
        # Parse AI response - handle potential JSON formatting issues
        try:
            # Try to extract JSON from response if it's wrapped in text
            response_text = str(response).strip()
            if response_text.startswith('```json'):
                response_text = response_text.replace('```json', '').replace('```', '').strip()
            elif response_text.startswith('```'):
                response_text = response_text.replace('```', '').strip()
            
            # Handle case where there's extra text after JSON
            # Find the JSON object boundaries
            json_start = response_text.find('{')
            if json_start != -1:
                # Find the matching closing brace
                brace_count = 0
                json_end = json_start
                for i, char in enumerate(response_text[json_start:], json_start):
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            json_end = i + 1
                            break
                
                if json_end > json_start:
                    response_text = response_text[json_start:json_end]
            
            ai_result = json.loads(response_text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing failed for response: {response}")
            raise HTTPException(status_code=500, detail=f"Invalid AI response format: {str(e)}")
        
        result = CLVPrediction(
            customer_id=customer_data.customer_id,
            predicted_clv=ai_result["predicted_clv"],
            risk_score=ai_result["risk_score"],
            recommended_actions=ai_result["recommended_actions"],
            value_drivers=ai_result["value_drivers"]
        )
        
        # Store customer data and CLV prediction
        customer_dict = customer_data.dict()
        customer_dict["created_at"] = datetime.now(timezone.utc)
        await db.customers.insert_one(customer_dict)
        
        prediction_dict = result.dict()
        prediction_dict["created_at"] = datetime.now(timezone.utc)
        await db.clv_predictions.insert_one(prediction_dict)
        
        return result
        
    except Exception as e:
        logger.error(f"CLV prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"CLV prediction failed: {str(e)}")

# Get Lead Scores Endpoint
@api_router.get("/ai/lead-scores", response_model=List[LeadScoreResult])
async def get_lead_scores(limit: int = 50):
    scores = await db.lead_scores.find().sort("score", -1).limit(limit).to_list(limit)
    return [LeadScoreResult(**score) for score in scores]

# Get Leads Endpoint
@api_router.get("/leads", response_model=List[LeadData])
async def get_leads(limit: int = 100):
    leads = await db.leads.find().sort("created_at", -1).limit(limit).to_list(limit)
    return [LeadData(**lead) for lead in leads]

# Initialize messenger service
messenger_service_instance = MessengerService(db)

# Update the global messenger_service import
import integrations.messenger.router
integrations.messenger.router.messenger_service = messenger_service_instance

# Initialize S3 service
s3_service_instance = S3Service(db)

# Update the global s3_service import
import integrations.aws.service
integrations.aws.service.s3_service = s3_service_instance

# Initialize email services (after .env is loaded)
from integrations.email.service import EmailService
from integrations.email.ai_service import AIEmailService
email_service_instance = EmailService()
ai_email_service_instance = AIEmailService()

# Update the global email_service imports
import integrations.email.router
integrations.email.router.email_service = email_service_instance
integrations.email.router.ai_email_service = ai_email_service_instance

# Initialize dialer service (after .env is loaded)
from integrations.dialer.service import DialerService
dialer_service_instance = DialerService()

# Update the global dialer_service import
import integrations.dialer.router
integrations.dialer.router.dialer_service = dialer_service_instance

# Include sub-routers in API router FIRST
api_router.include_router(messenger_router)
api_router.include_router(messenger_test_router)
api_router.include_router(s3_router)
api_router.include_router(files_test_router)
api_router.include_router(email_router)
api_router.include_router(dialer_router)

# Then include the main API router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
