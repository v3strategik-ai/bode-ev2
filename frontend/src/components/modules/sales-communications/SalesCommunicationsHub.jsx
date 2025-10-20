/**
 * Sales Communications Hub - Main component for dialer and email automation
 * Integrates all communication tools for MATIKAI AI sales team
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { 
  Phone, 
  Mail, 
  PhoneCall, 
  Send, 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  DollarSign,
  Activity,
  MessageSquare,
  Bot,
  Zap
} from 'lucide-react';

// Import sub-components
import DialerInterface from './DialerInterface';
import EmailAutomation from './EmailAutomation';
import CommunicationAnalytics from './CommunicationAnalytics';
import QuickActions from './QuickActions';

// Import services
import dialerService from '../../../services/communications/dialerService';
import emailService from '../../../services/communications/emailService';

const SalesCommunicationsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [serviceStatus, setServiceStatus] = useState({
    dialer: { configured: false, mock_mode: true },
    email: { configured: false, mock_mode: true }
  });
  const [stats, setStats] = useState({
    todayCalls: 12,
    todayEmails: 28,
    callsAnswered: 9,
    emailsOpened: 21,
    totalRevenue: '$45,750'
  });

  useEffect(() => {
    loadServiceStatus();
    loadDashboardStats();
  }, []);

  const loadServiceStatus = async () => {
    try {
      const [dialerStatus, emailStatus] = await Promise.all([
        dialerService.getStatus(),
        emailService.getStatus()
      ]);
      
      setServiceStatus({
        dialer: {
          configured: dialerStatus.twilio_configured,
          mock_mode: dialerStatus.mock_mode,
          phone_number: dialerStatus.phone_number
        },
        email: {
          configured: emailStatus.sendgrid_configured,
          mock_mode: emailStatus.mock_mode,
          sender_email: emailStatus.sender_email
        }
      });
    } catch (error) {
      console.error('Failed to load service status:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // In a real implementation, this would fetch actual data from APIs
      const mockAnalytics = dialerService.getMockAnalytics();
      setStats({
        todayCalls: mockAnalytics.total_calls,
        todayEmails: 28,
        callsAnswered: mockAnalytics.successful_calls,
        emailsOpened: 21,
        totalRevenue: '$45,750'
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {change} from yesterday
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  );

  const ServiceStatusBadge = ({ service, status }) => (
    <Badge 
      variant={status.configured ? "default" : "secondary"}
      className={`${status.configured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
    >
      {service}: {status.configured ? 'Connected' : (status.mock_mode ? 'Mock Mode' : 'Not Configured')}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Communications Hub</h1>
          <p className="text-muted-foreground">
            Unified dialer and email automation for BODE EV sales team
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ServiceStatusBadge service="Dialer" status={serviceStatus.dialer} />
          <ServiceStatusBadge service="Email" status={serviceStatus.email} />
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Today's Calls"
          value={stats.todayCalls}
          change="+23%"
          icon={PhoneCall}
          color="blue"
        />
        <StatCard
          title="Emails Sent"
          value={stats.todayEmails}
          change="+12%"
          icon={Send}
          color="green"
        />
        <StatCard
          title="Calls Answered"
          value={stats.callsAnswered}
          change="+8%"
          icon={Phone}
          color="purple"
        />
        <StatCard
          title="Emails Opened"
          value={stats.emailsOpened}
          change="+15%"
          icon={Mail}
          color="orange"
        />
        <StatCard
          title="Revenue Impact"
          value={stats.totalRevenue}
          change="+31%"
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="dialer">
            <Phone className="h-4 w-4 mr-2" />
            Dialer
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email Automation
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="quick-actions">
            <Zap className="h-4 w-4 mr-2" />
            Quick Actions
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      <div>
                        <p className="font-medium">Called Tesla Fleet Operations</p>
                        <p className="text-sm text-muted-foreground">3 minutes ago</p>
                      </div>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <p className="font-medium">Sent quote follow-up to EcoCharge</p>
                        <p className="text-sm text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Delivered</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-purple-600" />
                      <div>
                        <p className="font-medium">AI generated email for Green Energy</p>
                        <p className="text-sm text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                    <Badge variant="outline">AI Generated</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => setActiveTab('dialer')} 
                    className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
                  >
                    <PhoneCall className="h-6 w-6" />
                    <span>Make Call</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('email')}
                    variant="outline"
                    className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
                  >
                    <Send className="h-6 w-6" />
                    <span>Send Email</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('email')}
                    variant="outline"
                    className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
                  >
                    <Bot className="h-6 w-6" />
                    <span>AI Email</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveTab('analytics')}
                    variant="outline"
                    className="flex items-center justify-center p-4 h-auto flex-col space-y-2"
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Status Details */}
          <Card>
            <CardHeader>
              <CardTitle>Service Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Dialer Service
                    </h3>
                    <Badge variant={serviceStatus.dialer.configured ? "default" : "secondary"}>
                      {serviceStatus.dialer.configured ? 'Active' : 'Mock Mode'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Phone: {serviceStatus.dialer.phone_number}
                  </p>
                  <p className="text-xs">
                    {serviceStatus.dialer.configured 
                      ? 'Twilio integration active - ready for live calls'
                      : 'Running in mock mode - provide Twilio credentials to activate'
                    }
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Service
                    </h3>
                    <Badge variant={serviceStatus.email.configured ? "default" : "secondary"}>
                      {serviceStatus.email.configured ? 'Active' : 'Mock Mode'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sender: {serviceStatus.email.sender_email}
                  </p>
                  <p className="text-xs">
                    {serviceStatus.email.configured 
                      ? 'SendGrid integration active - emails will be delivered'
                      : 'Running in mock mode - emails will be simulated'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other Tab Contents */}
        <TabsContent value="dialer">
          <DialerInterface />
        </TabsContent>

        <TabsContent value="email">
          <EmailAutomation />
        </TabsContent>

        <TabsContent value="analytics">
          <CommunicationAnalytics />
        </TabsContent>

        <TabsContent value="quick-actions">
          <QuickActions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesCommunicationsHub;