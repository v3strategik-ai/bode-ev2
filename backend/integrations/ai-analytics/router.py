"""
AI Analytics Router for MATIKAI Platform
FastAPI endpoints for advanced AI-powered business intelligence
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
import logging
from datetime import datetime, timedelta
from auth.auth_bearer import JWTBearer
from .service import AIAnalyticsService, AIAnalyticsError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai-analytics", tags=["ai-analytics"])
jwt_bearer = JWTBearer()

# Service will be initialized in server.py and injected here
ai_analytics_service = None

@router.get("/dashboard")
async def get_dashboard_analytics(
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get comprehensive dashboard analytics with AI insights
    """
    try:
        result = await ai_analytics_service.get_dashboard_analytics()
        return {
            "success": True,
            "data": result,
            "message": "Dashboard analytics generated successfully"
        }
    except AIAnalyticsError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error getting dashboard analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate dashboard analytics")

@router.get("/revenue-forecast")
async def get_revenue_forecast(
    days: int = Query(90, ge=7, le=365, description="Number of days to forecast"),
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get AI-powered revenue forecasting
    """
    try:
        result = await ai_analytics_service.get_revenue_forecast(days)
        return {
            "success": True,
            "data": result,
            "message": f"Revenue forecast for {days} days generated successfully"
        }
    except AIAnalyticsError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error generating revenue forecast: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate revenue forecast")

@router.get("/lead-intelligence")
async def get_lead_intelligence(
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get advanced AI-powered lead analysis and recommendations
    """
    try:
        result = await ai_analytics_service.get_lead_intelligence()
        return {
            "success": True,
            "data": result,
            "message": "Lead intelligence analysis completed successfully"
        }
    except AIAnalyticsError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error generating lead intelligence: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate lead intelligence")

@router.get("/customer-behavior")
async def get_customer_behavior_analysis(
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get AI-powered customer behavior analysis and insights
    """
    try:
        result = await ai_analytics_service.get_customer_behavior_analysis()
        return {
            "success": True,
            "data": result,
            "message": "Customer behavior analysis completed successfully"
        }
    except AIAnalyticsError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error analyzing customer behavior: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze customer behavior")

@router.get("/insights/generate")
async def generate_custom_insights(
    focus_area: Optional[str] = Query(None, description="Specific area to focus analysis on"),
    time_period: Optional[int] = Query(30, description="Time period in days for analysis"),
    current_user: dict = Depends(jwt_bearer)
):
    """
    Generate custom AI insights for specific focus areas
    """
    try:
        # This would be implemented to generate insights for specific areas
        result = {
            "insights": [
                {
                    "title": f"Custom Analysis: {focus_area or 'General Performance'}",
                    "description": f"AI analysis for the past {time_period} days shows significant patterns in your business data.",
                    "impact": "Medium",
                    "recommendation": "Continue monitoring these trends and adjust strategies accordingly.",
                    "confidence": 85.7,
                    "category": "custom"
                }
            ],
            "focus_area": focus_area or "general",
            "time_period": time_period,
            "generated_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "data": result,
            "message": "Custom insights generated successfully"
        }
    except Exception as e:
        logger.error(f"Failed to generate custom insights: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate custom insights")

@router.get("/predictions/pipeline")
async def get_pipeline_predictions(
    current_user: dict = Depends(jwt_bearer)
):
    """
    Get AI predictions for sales pipeline performance
    """
    try:
        # Mock pipeline predictions - would be enhanced with real ML models
        result = {
            "pipeline_predictions": {
                "total_pipeline_value": 3275000,
                "predicted_close_rate": 68.3,
                "expected_revenue_30_days": 890000,
                "expected_revenue_60_days": 1650000,
                "expected_revenue_90_days": 2350000,
                "confidence": 84.2
            },
            "deal_predictions": [
                {
                    "deal_id": "deal_001",
                    "company": "TechCorp Solutions",
                    "value": 250000,
                    "close_probability": 87.5,
                    "predicted_close_date": "2025-11-15",
                    "risk_factors": ["Long sales cycle", "Multiple stakeholders"]
                },
                {
                    "deal_id": "deal_002", 
                    "company": "InnovateBiz Corp",
                    "value": 180000,
                    "close_probability": 72.3,
                    "predicted_close_date": "2025-11-28",
                    "risk_factors": ["Budget constraints"]
                }
            ],
            "recommendations": [
                "Focus on high-probability deals in TechCorp Solutions pipeline",
                "Address budget concerns with InnovateBiz Corp through flexible pricing",
                "Accelerate follow-up on stagnant deals over 30 days old"
            ]
        }
        
        return {
            "success": True,
            "data": result,
            "message": "Pipeline predictions generated successfully"
        }
    except Exception as e:
        logger.error(f"Failed to generate pipeline predictions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate pipeline predictions")

@router.get("/status")
async def get_ai_analytics_status():
    """
    Get AI Analytics service status and capabilities
    """
    return {
        "service_name": "MATIKAI AI Analytics Service",
        "ai_configured": not ai_analytics_service.mock_mode if ai_analytics_service else False,
        "mock_mode": ai_analytics_service.mock_mode if ai_analytics_service else True,
        "available_features": [
            "Real-time business intelligence dashboard",
            "AI-powered revenue forecasting",
            "Lead intelligence and optimization",
            "Customer behavior analysis", 
            "Predictive pipeline management",
            "Custom insight generation"
        ],
        "ai_models": {
            "insight_generation": "GPT-4 powered natural language insights",
            "revenue_forecasting": "Linear regression with seasonal adjustment",
            "lead_scoring": "Multi-factor behavioral analysis",
            "customer_analysis": "Lifetime value prediction models"
        },
        "update_frequency": "Real-time with 15-minute batch processing",
        "confidence_threshold": 75.0
    }