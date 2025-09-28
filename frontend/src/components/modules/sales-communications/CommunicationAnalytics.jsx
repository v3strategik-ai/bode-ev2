/**
 * Communication Analytics Component
 * Displays analytics and insights for dialer and email performance
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { 
  TrendingUp, 
  Phone, 
  Mail, 
  DollarSign, 
  Clock, 
  Users,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';

import dialerService from '../../../services/communications/dialerService';

const CommunicationAnalytics = () => {
  const [timeframe, setTimeframe] = useState('last_7_days');
  const [analytics, setAnalytics] = useState({
    calls: {},
    emails: {},
    revenue: {}
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    try {
      // Get call analytics (mock data for now)
      const callAnalytics = dialerService.getMockAnalytics();
      
      // Mock email analytics
      const emailAnalytics = {
        total_sent: 234,
        delivered: 228,
        opened: 156,
        clicked: 89,
        bounced: 6,
        open_rate: 68.4,
        click_rate: 39.0,
        delivery_rate: 97.4
      };

      // Mock revenue analytics
      const revenueAnalytics = {
        total_revenue: 125750,
        calls_revenue: 45750,
        emails_revenue: 80000,
        conversion_rate: 12.5,
        avg_deal_size: 15500
      };

      setAnalytics({
        calls: callAnalytics,
        emails: emailAnalytics,
        revenue: revenueAnalytics
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color = "blue", subtitle }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {change && (
              <p className={`text-xs ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {change} from last period
              </p>
            )}
          </div>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </CardContent>
    </Card>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Communication Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="this_quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Calls Made"
          value={analytics.calls.total_calls || 0}
          change="+23%"
          icon={Phone}
          color="blue"
          subtitle={`${analytics.calls.successful_calls || 0} successful`}
        />
        <StatCard
          title="Emails Sent"
          value={analytics.emails.total_sent || 0}
          change="+12%"
          icon={Mail}
          color="green"
          subtitle={`${formatPercentage(analytics.emails.open_rate || 0)} open rate`}
        />
        <StatCard
          title="Revenue Generated"
          value={formatCurrency(analytics.revenue.total_revenue || 0)}
          change="+31%"
          icon={DollarSign}
          color="emerald"
          subtitle={`${formatPercentage(analytics.revenue.conversion_rate || 0)} conversion`}
        />
        <StatCard
          title="Avg. Deal Size"
          value={formatCurrency(analytics.revenue.avg_deal_size || 0)}
          change="+8%"
          icon={TrendingUp}
          color="purple"
          subtitle="Per closed deal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Call Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analytics.calls.successful_calls || 0}</p>
                <p className="text-sm text-muted-foreground">Successful Calls</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{analytics.calls.failed_calls || 0}</p>
                <p className="text-sm text-muted-foreground">Failed Calls</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Average Duration</span>
                <span className="font-medium">{Math.floor((analytics.calls.average_duration || 0) / 60)}:{((analytics.calls.average_duration || 0) % 60).toFixed(0).padStart(2, '0')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Cost</span>
                <span className="font-medium">{analytics.calls.total_cost || '$0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">
                  {analytics.calls.total_calls ? 
                    formatPercentage((analytics.calls.successful_calls / analytics.calls.total_calls) * 100) : 
                    '0%'
                  }
                </span>
              </div>
            </div>

            {/* Call Purpose Breakdown */}
            <div>
              <h4 className="font-semibold mb-2">Calls by Purpose</h4>
              <div className="space-y-1">
                {Object.entries(analytics.calls.calls_by_purpose || {}).map(([purpose, count]) => (
                  <div key={purpose} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{purpose.replace('_', ' ')}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(count / (analytics.calls.total_calls || 1)) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Email Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analytics.emails.delivered || 0}</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{analytics.emails.opened || 0}</p>
                <p className="text-sm text-muted-foreground">Opened</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Delivery Rate</span>
                <span className="font-medium">{formatPercentage(analytics.emails.delivery_rate || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Open Rate</span>
                <span className="font-medium">{formatPercentage(analytics.emails.open_rate || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Click Rate</span>
                <span className="font-medium">{formatPercentage(analytics.emails.click_rate || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bounce Rate</span>
                <span className="font-medium text-red-600">
                  {formatPercentage((analytics.emails.bounced / (analytics.emails.total_sent || 1)) * 100)}
                </span>
              </div>
            </div>

            {/* Email Performance Chart */}
            <div>
              <h4 className="font-semibold mb-2">Email Funnel</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sent</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-600 h-2 rounded-full w-full" />
                    </div>
                    <span className="text-sm font-medium">{analytics.emails.total_sent}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Delivered</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(analytics.emails.delivered / (analytics.emails.total_sent || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analytics.emails.delivered}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Opened</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(analytics.emails.opened / (analytics.emails.total_sent || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analytics.emails.opened}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Clicked</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(analytics.emails.clicked / (analytics.emails.total_sent || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">{analytics.emails.clicked}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Revenue Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(analytics.revenue.calls_revenue || 0)}</p>
              <p className="text-sm text-muted-foreground">Revenue from Calls</p>
              <Badge variant="outline" className="mt-2">
                {formatPercentage((analytics.revenue.calls_revenue / analytics.revenue.total_revenue) * 100)} of total
              </Badge>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{formatCurrency(analytics.revenue.emails_revenue || 0)}</p>
              <p className="text-sm text-muted-foreground">Revenue from Emails</p>
              <Badge variant="outline" className="mt-2">
                {formatPercentage((analytics.revenue.emails_revenue / analytics.revenue.total_revenue) * 100)} of total
              </Badge>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{formatPercentage(analytics.revenue.conversion_rate || 0)}</p>
              <p className="text-sm text-muted-foreground">Overall Conversion Rate</p>
              <Badge variant="outline" className="mt-2">
                Industry benchmark: 8.2%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Peak Activity Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Peak Activity Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const isPeak = analytics.calls.peak_call_hours?.includes(hour);
              return (
                <div key={hour} className="text-center">
                  <div 
                    className={`h-16 rounded mb-1 ${
                      isPeak ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                    style={{
                      height: isPeak ? '64px' : '24px'
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {hour.toString().padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Optimal calling hours: 10AM-12PM and 2PM-4PM
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunicationAnalytics;