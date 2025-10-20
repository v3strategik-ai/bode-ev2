/**
 * AI Analytics Service for MATIKAI Frontend
 * Handles all AI-powered business intelligence API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

class AIAnalyticsService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/ai-analytics`;
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get dashboard analytics with AI insights
  async getDashboardAnalytics() {
    try {
      const response = await axios.get(
        `${this.baseURL}/dashboard`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get dashboard analytics:', error);
      throw error;
    }
  }

  // Get revenue forecasting
  async getRevenueForecast(days = 90) {
    try {
      const response = await axios.get(
        `${this.baseURL}/revenue-forecast?days=${days}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get revenue forecast:', error);
      throw error;
    }
  }

  // Get lead intelligence analysis
  async getLeadIntelligence() {
    try {
      const response = await axios.get(
        `${this.baseURL}/lead-intelligence`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get lead intelligence:', error);
      throw error;
    }
  }

  // Get customer behavior analysis
  async getCustomerBehaviorAnalysis() {
    try {
      const response = await axios.get(
        `${this.baseURL}/customer-behavior`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get customer behavior analysis:', error);
      throw error;
    }
  }

  // Get pipeline predictions
  async getPipelinePredictions() {
    try {
      const response = await axios.get(
        `${this.baseURL}/predictions/pipeline`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get pipeline predictions:', error);
      throw error;
    }
  }

  // Generate custom insights
  async generateCustomInsights(focusArea = null, timePeriod = 30) {
    try {
      const params = new URLSearchParams();
      if (focusArea) params.append('focus_area', focusArea);
      params.append('time_period', timePeriod.toString());

      const response = await axios.get(
        `${this.baseURL}/insights/generate?${params}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to generate custom insights:', error);
      throw error;
    }
  }

  // Get AI Analytics service status
  async getStatus() {
    try {
      const response = await axios.get(`${this.baseURL}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get AI Analytics service status:', error);
      throw error;
    }
  }

  // Helper method to format large numbers
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Helper method to format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Helper method to format percentage
  formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
  }

  // Helper method to get trend arrow and color
  getTrendIndicator(change) {
    const isPositive = change > 0;
    return {
      arrow: isPositive ? '↗' : '↘',
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50'
    };
  }

  // Helper method to get confidence level styling
  getConfidenceStyle(confidence) {
    if (confidence >= 90) return { color: 'text-green-600', bg: 'bg-green-50', label: 'Very High' };
    if (confidence >= 80) return { color: 'text-blue-600', bg: 'bg-blue-50', label: 'High' };
    if (confidence >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Medium' };
    return { color: 'text-red-600', bg: 'bg-red-50', label: 'Low' };
  }

  // Helper method to get impact level styling
  getImpactStyle(impact) {
    const styles = {
      'High': { color: 'text-red-600', bg: 'bg-red-50', icon: '🔥' },
      'Medium': { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⚡' },
      'Low': { color: 'text-blue-600', bg: 'bg-blue-50', icon: 'ℹ️' }
    };
    return styles[impact] || styles['Low'];
  }

  // Mock data for development/fallback
  getMockDashboardData() {
    return {
      success: true,
      data: {
        metrics: [
          {
            name: "Monthly Revenue",
            value: 847500.00,
            change: 23.5,
            trend: "increasing",
            prediction: 1050000.00,
            confidence: 87.3
          },
          {
            name: "Lead Conversion Rate",
            value: 68.3,
            change: 12.1,
            trend: "increasing", 
            prediction: 75.2,
            confidence: 82.1
          },
          {
            name: "Customer Acquisition Cost",
            value: 285.00,
            change: -15.7,
            trend: "decreasing",
            prediction: 240.00,
            confidence: 91.4
          }
        ],
        insights: [
          {
            title: "Revenue Growth Acceleration Detected",
            description: "Monthly revenue increased by 23.5% compared to last month, significantly outpacing industry average of 8.2%.",
            impact: "High",
            recommendation: "Capitalize on momentum by increasing marketing spend in highest-performing channels.",
            confidence: 92.3,
            category: "performance"
          }
        ],
        last_updated: new Date().toISOString(),
        ai_confidence: 87.8
      }
    };
  }
}

export default new AIAnalyticsService();