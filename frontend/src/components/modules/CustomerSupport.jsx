import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Clock, AlertCircle, CheckCircle, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNotifications } from '../../contexts/NotificationContext';
import dialerService from '../../services/communications/dialerService';
import emailService from '../../services/communications/emailService';

const CustomerSupport = () => {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/20 min-h-screen">
      <div className="flex items-center mb-8">
        <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
          <p className="text-gray-600">24/7 customer service and support management</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Active Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">34</p>
            <p className="text-sm text-gray-600">Open support requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">2.3hrs</p>
            <p className="text-sm text-gray-600">First response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Satisfaction Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">96.8%</p>
            <p className="text-sm text-gray-600">Customer satisfaction</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSupport;