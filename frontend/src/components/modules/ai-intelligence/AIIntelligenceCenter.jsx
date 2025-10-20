/**
 * AI Intelligence Center - Advanced AI-powered business intelligence dashboard
 * Comprehensive analytics, predictions, and insights for MATIKAI platform
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Users,
  DollarSign,
  BarChart3,
  Zap,
  Eye,
  Lightbulb,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Sparkles,
  Robot,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

import aiAnalyticsService from '../../../services/ai-analytics/aiAnalyticsService';

const AIIntelligenceCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [leadData, setLeadData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    loadInitialData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadInitialData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDashboardData(),
        loadRevenueData(),
        loadLeadData(),
        loadCustomerData()
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load AI analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await aiAnalyticsService.getDashboardAnalytics();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setDashboardData(aiAnalyticsService.getMockDashboardData().data);
    }
  };

  const loadRevenueData = async () => {
    try {
      const response = await aiAnalyticsService.getRevenueForecast(90);
      setRevenueData(response.data);
    } catch (error) {
      console.error('Failed to load revenue data:', error);
    }
  };

  const loadLeadData = async () => {
    try {
      const response = await aiAnalyticsService.getLeadIntelligence();
      setLeadData(response.data);
    } catch (error) {
      console.error('Failed to load lead data:', error);
    }
  };

  const loadCustomerData = async () => {
    try {
      const response = await aiAnalyticsService.getCustomerBehaviorAnalysis();
      setCustomerData(response.data);
    } catch (error) {
      console.error('Failed to load customer data:', error);
    }
  };

  const MetricCard = ({ metric, showPrediction = false }) => {
    const trend = aiAnalyticsService.getTrendIndicator(metric.change);
    const confidence = aiAnalyticsService.getConfidenceStyle(metric.confidence);

    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{metric.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${confidence.bg} ${confidence.color}`}>
              {confidence.label} Confidence
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {metric.name.includes('Rate') || metric.name.includes('Cost') ? 
                  (metric.name.includes('Rate') ? 
                    aiAnalyticsService.formatPercentage(metric.value) :
                    aiAnalyticsService.formatCurrency(metric.value)
                  ) :
                  aiAnalyticsService.formatCurrency(metric.value)
                }
              </p>
              <div className={`flex items-center mt-1 ${trend.color}`}>
                <span className="text-lg">{trend.arrow}</span>
                <span className="ml-1 text-sm font-medium">
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
              </div>
            </div>
            
            {showPrediction && (
              <div className="text-right">
                <p className="text-sm text-gray-600">AI Prediction</p>
                <p className="text-xl font-semibold text-blue-600">
                  {metric.name.includes('Rate') ? 
                    aiAnalyticsService.formatPercentage(metric.prediction) :
                    aiAnalyticsService.formatCurrency(metric.prediction)
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const InsightCard = ({ insight }) => {
    const impact = aiAnalyticsService.getImpactStyle(insight.impact);
    const confidence = aiAnalyticsService.getConfidenceStyle(insight.confidence);

    return (
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{impact.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={`${impact.bg} ${impact.color} text-xs`}>
                    {insight.impact} Impact
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {insight.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${confidence.bg} ${confidence.color}`}>
              {confidence.confidence}%
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {insight.description}
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="font-medium text-blue-900 mb-1">💡 AI Recommendation</p>
            <p className="text-blue-800 text-sm">{insight.recommendation}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading AI Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Intelligence Center</h1>
            <p className="text-gray-600">
              Advanced business intelligence powered by AI • Real-time insights and predictions
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right text-sm">
            <p className="text-gray-600">Last Updated</p>
            <p className="font-medium">{lastUpdated.toLocaleTimeString()}</p>
          </div>
          <Button 
            onClick={loadInitialData} 
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Confidence Indicator */}
      {dashboardData && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">AI Confidence Level</p>
                  <p className="text-sm text-blue-700">
                    Overall analysis confidence based on data quality and model accuracy
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.ai_confidence?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-blue-600">High Confidence</p>
                </div>
                <div className="w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="#dbeafe" strokeWidth="4" fill="none"
                    />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="#2563eb" strokeWidth="4" fill="none"
                      strokeDasharray={`${(dashboardData.ai_confidence * 176) / 100} 176`}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Revenue AI
          </TabsTrigger>
          <TabsTrigger value="leads" className="flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Lead Intelligence
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Customer AI
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center">
            <Robot className="h-4 w-4 mr-2" />
            Predictions
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {dashboardData && (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.metrics?.map((metric, index) => (
                  <MetricCard key={index} metric={metric} showPrediction={true} />
                ))}
              </div>

              {/* AI Insights Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
                  AI-Generated Insights
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboardData.insights?.map((insight, index) => (
                    <InsightCard key={index} insight={insight} />
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Revenue Forecasting Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-6 w-6 mr-2" />
                AI Revenue Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">
                        {aiAnalyticsService.formatCurrency(revenueData.forecast_data?.predicted_revenue)}
                      </p>
                      <p className="text-sm text-green-700">90-Day Forecast</p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">
                        {revenueData.forecast_data?.confidence}%
                      </p>
                      <p className="text-sm text-blue-700">Confidence Level</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">
                        +{revenueData.forecast_data?.growth_rate}%
                      </p>
                      <p className="text-sm text-purple-700">Growth Rate</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">Loading revenue forecasting data...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Intelligence Tab */}
        <TabsContent value="leads">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 mr-2" />
                  Lead Intelligence & Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leadData ? (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">Lead Intelligence Ready</p>
                    <p className="text-gray-600">AI-powered lead scoring and recommendations available</p>
                  </div>
                ) : (
                  <p className="text-center text-gray-600 py-8">Loading lead intelligence data...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Intelligence Tab */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Customer Behavior Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customerData ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Customer Analytics Ready</p>
                  <p className="text-gray-600">AI-powered behavior analysis and LTV predictions available</p>
                </div>
              ) : (
                <p className="text-center text-gray-600 py-8">Loading customer analysis data...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Robot className="h-6 w-6 mr-2" />
                AI Predictions & Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Robot className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Advanced Predictions Engine</p>
                <p className="text-gray-600">Machine learning models for business forecasting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIIntelligenceCenter;