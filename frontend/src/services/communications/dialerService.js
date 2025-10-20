/**
 * Dialer Service for MATIKAI Frontend
 * Handles all dialer/calling API calls
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;

class DialerService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/dialer`;
  }

  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Make a single call
  async makeCall(callData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/call`,
        callData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to make call:', error);
      throw error;
    }
  }

  // Get call status
  async getCallStatus(callId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/call/${callId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get call status:', error);
      throw error;
    }
  }

  // Make bulk calls
  async makeBulkCalls(bulkData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/bulk-call`,
        bulkData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to make bulk calls:', error);
      throw error;
    }
  }

  // Get call analytics
  async getCallAnalytics(startDate, endDate, userId = null) {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate
      };
      if (userId) params.user_id = userId;

      const response = await axios.get(
        `${this.baseURL}/analytics`,
        { 
          headers: this.getAuthHeaders(),
          params
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get call analytics:', error);
      throw error;
    }
  }

  // Get dialer service status
  async getStatus() {
    try {
      const response = await axios.get(`${this.baseURL}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get dialer service status:', error);
      throw error;
    }
  }

  // Format phone number to E.164 format
  formatPhoneNumber(phone, countryCode = '+1') {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // If it already starts with country code, return as is
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      return `+${cleanPhone}`;
    }
    
    // If it's a 10-digit US number, add +1
    if (cleanPhone.length === 10) {
      return `${countryCode}${cleanPhone}`;
    }
    
    // Return as is if it doesn't match expected patterns
    return phone;
  }

  // Validate phone number
  isValidPhoneNumber(phone) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  // Get call purposes/reasons
  getCallPurposes() {
    return [
      { value: 'lead_follow_up', label: 'Lead Follow-up', description: 'Following up with potential customers' },
      { value: 'customer_service', label: 'Customer Service', description: 'Handling customer inquiries and support' },
      { value: 'sales_call', label: 'Sales Call', description: 'Proactive sales outreach' },
      { value: 'technical_support', label: 'Technical Support', description: 'Providing technical assistance' },
      { value: 'appointment_reminder', label: 'Appointment Reminder', description: 'Reminding customers of upcoming appointments' },
      { value: 'quote_follow_up', label: 'Quote Follow-up', description: 'Following up on provided quotes' }
    ];
  }

  // Get call status options
  getCallStatuses() {
    return [
      { value: 'initiated', label: 'Initiated', color: 'blue' },
      { value: 'ringing', label: 'Ringing', color: 'yellow' },
      { value: 'answered', label: 'Answered', color: 'green' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'failed', label: 'Failed', color: 'red' },
      { value: 'busy', label: 'Busy', color: 'orange' },
      { value: 'no-answer', label: 'No Answer', color: 'gray' },
      { value: 'canceled', label: 'Canceled', color: 'red' }
    ];
  }

  // Quick dial functions for common scenarios
  async quickDialLead(leadData) {
    const callData = {
      to_number: this.formatPhoneNumber(leadData.phone),
      purpose: 'lead_follow_up',
      lead_id: leadData.id,
      notes: `Lead follow-up call - ${leadData.company || leadData.name}`
    };
    return this.makeCall(callData);
  }

  async quickDialCustomer(customerData, purpose = 'customer_service') {
    const callData = {
      to_number: this.formatPhoneNumber(customerData.phone),
      purpose: purpose,
      customer_id: customerData.id,
      notes: `Customer ${purpose.replace('_', ' ')} call - ${customerData.company || customerData.name}`
    };
    return this.makeCall(callData);
  }

  // Calculate estimated call cost (mock implementation)
  estimateCallCost(duration = 120, ratePerMinute = 0.02) {
    const minutes = Math.ceil(duration / 60);
    return (minutes * ratePerMinute).toFixed(2);
  }

  // Mock call history for development (replace with real API call)
  getMockCallHistory() {
    return [
      {
        id: '1',
        to_number: '+15551234567',
        purpose: 'lead_follow_up',
        status: 'completed',
        duration: 185,
        start_time: new Date(Date.now() - 3600000),
        customer_name: 'Tesla Fleet Operations',
        cost: '$6.17'
      },
      {
        id: '2', 
        to_number: '+15559876543',
        purpose: 'quote_follow_up',
        status: 'no-answer',
        duration: 0,
        start_time: new Date(Date.now() - 7200000),
        customer_name: 'Green Energy Solutions',
        cost: '$0.00'
      },
      {
        id: '3',
        to_number: '+15555551234',
        purpose: 'customer_service',
        status: 'completed', 
        duration: 325,
        start_time: new Date(Date.now() - 10800000),
        customer_name: 'EcoCharge Networks',
        cost: '$10.83'
      }
    ];
  }

  // Mock analytics data
  getMockAnalytics() {
    return {
      total_calls: 45,
      successful_calls: 38,
      failed_calls: 7,
      average_duration: 142.5,
      total_cost: '$15.75',
      calls_by_purpose: {
        lead_follow_up: 20,
        customer_service: 15,
        sales_call: 8,
        technical_support: 2
      },
      calls_by_status: {
        completed: 38,
        failed: 4,
        no_answer: 3
      },
      peak_call_hours: [10, 11, 14, 15, 16]
    };
  }
}

export default new DialerService();