/**
 * Quick Actions Component
 * Provides quick access to common communication tasks
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { 
  Phone, 
  Mail, 
  Bot, 
  Users, 
  Calendar,
  Zap,
  Clock,
  Target,
  TrendingUp,
  FileText,
  Send,
  PhoneCall,
  MessageSquare
} from 'lucide-react';

import dialerService from '../../../services/communications/dialerService';
import emailService from '../../../services/communications/emailService';

const QuickActions = () => {
  const [quickCallForm, setQuickCallForm] = useState({
    phone: '',
    name: ''
  });
  const [quickEmailForm, setQuickEmailForm] = useState({
    email: '',
    template: ''
  });

  const handleQuickCall = async () => {
    if (!quickCallForm.phone) {
      alert('Please enter a phone number');
      return;
    }

    try {
      const result = await dialerService.makeCall({
        to_number: dialerService.formatPhoneNumber(quickCallForm.phone),
        purpose: 'sales_call',
        notes: `Quick call to ${quickCallForm.name || quickCallForm.phone}`
      });
      
      if (result.success) {
        alert('Call initiated successfully!');
        setQuickCallForm({ phone: '', name: '' });
      }
    } catch (error) {
      console.error('Quick call failed:', error);
      alert('Failed to make call. Please try again.');
    }
  };

  const handleQuickEmail = async () => {
    if (!quickEmailForm.email || !quickEmailForm.template) {
      alert('Please fill in email and select template');
      return;
    }

    try {
      // Generate AI email based on template
      const result = await emailService.generateAndSendAIEmail({
        recipient_name: 'Customer',
        recipient_email: quickEmailForm.email,
        context: quickEmailForm.template,
        tone: 'professional'
      });
      
      if (result.success) {
        alert('Email sent successfully!');
        setQuickEmailForm({ email: '', template: '' });
      }
    } catch (error) {
      console.error('Quick email failed:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  const quickActionCards = [
    {
      title: 'Lead Follow-up Call',
      description: 'Call high-priority leads from today',
      icon: Phone,
      color: 'blue',
      count: 8,
      action: 'Call Now'
    },
    {
      title: 'Quote Follow-ups',
      description: 'Follow up on pending quotes',
      icon: Mail,
      color: 'green',
      count: 12,
      action: 'Send Emails'
    },
    {
      title: 'Service Reminders',
      description: 'Appointment reminders due today',
      icon: Calendar,
      color: 'purple',
      count: 5,
      action: 'Send Reminders'
    },
    {
      title: 'AI Email Campaign',
      description: 'Generate personalized campaign',
      icon: Bot,
      color: 'orange',
      count: 45,
      action: 'Generate'
    }
  ];

  const recentContacts = [
    {
      name: 'Tesla Fleet Operations',
      email: 'fleet@tesla.com',
      phone: '+15551234567',
      lastContact: '2 hours ago',
      status: 'hot'
    },
    {
      name: 'EcoCharge Networks',
      email: 'contact@ecocharge.com',
      phone: '+15559876543',
      lastContact: '1 day ago',
      status: 'warm'
    },
    {
      name: 'Green Energy Solutions',
      email: 'info@greenenergy.com',
      phone: '+15555551234',
      lastContact: '3 days ago',
      status: 'cold'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'hot': return 'text-red-600 bg-red-100';
      case 'warm': return 'text-orange-600 bg-orange-100';
      case 'cold': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActionCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <card.icon className={`h-8 w-8 text-${card.color}-600`} />
                <Badge variant="outline">{card.count}</Badge>
              </div>
              <h3 className="font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
              <Button size="sm" className="w-full">
                <Zap className="h-4 w-4 mr-1" />
                {card.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Call */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhoneCall className="h-5 w-5 mr-2" />
              Quick Call
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quick-phone">Phone Number</Label>
              <Input
                id="quick-phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={quickCallForm.phone}
                onChange={(e) => setQuickCallForm({ ...quickCallForm, phone: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="quick-name">Contact Name (Optional)</Label>
              <Input
                id="quick-name"
                placeholder="John Smith"
                value={quickCallForm.name}
                onChange={(e) => setQuickCallForm({ ...quickCallForm, name: e.target.value })}
              />
            </div>
            
            <Button 
              onClick={handleQuickCall}
              disabled={!quickCallForm.phone}
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
          </CardContent>
        </Card>

        {/* Quick Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Quick Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quick-email">Email Address</Label>
              <Input
                id="quick-email"
                type="email"
                placeholder="customer@example.com"
                value={quickEmailForm.email}
                onChange={(e) => setQuickEmailForm({ ...quickEmailForm, email: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="quick-template">Email Template</Label>
              <Select 
                value={quickEmailForm.template} 
                onValueChange={(value) => setQuickEmailForm({ ...quickEmailForm, template: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_follow_up">Lead Follow-up</SelectItem>
                  <SelectItem value="quote_follow_up">Quote Follow-up</SelectItem>
                  <SelectItem value="service_appointment">Service Appointment</SelectItem>
                  <SelectItem value="product_update">Product Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleQuickEmail}
              disabled={!quickEmailForm.email || !quickEmailForm.template}
              className="w-full"
            >
              <Bot className="h-4 w-4 mr-2" />
              Generate & Send AI Email
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Recent Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{contact.email}</span>
                    <span>•</span>
                    <span>{contact.phone}</span>
                    <span>•</span>
                    <span>Last contact: {contact.lastContact}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setQuickCallForm({ phone: contact.phone, name: contact.name })}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setQuickEmailForm({ email: contact.email, template: 'lead_follow_up' })}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Today's Communication Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="75, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">75%</span>
                </div>
              </div>
              <p className="font-medium">Calls</p>
              <p className="text-sm text-muted-foreground">15 of 20</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="90, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">90%</span>
                </div>
              </div>
              <p className="font-medium">Emails</p>
              <p className="text-sm text-muted-foreground">45 of 50</p>
            </div>
            
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray="60, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">60%</span>
                </div>
              </div>
              <p className="font-medium">Follow-ups</p>
              <p className="text-sm text-muted-foreground">6 of 10</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                <h3 className="font-semibold">Best Calling Time</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your highest success rate is between 10AM-12PM. You have 2 hours left in this window.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                <h3 className="font-semibold">Email Optimization</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Emails with "EV charging" in the subject line have 23% higher open rates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;