import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Zap, Clock, Target, BarChart3, PieChart, Activity, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import RevenueChart from './charts/RevenueChart';
import ConversionFunnelChart from './charts/ConversionFunnelChart';
import ForecastChart from './charts/ForecastChart';

const ExecutiveDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedTerritory, setSelectedTerritory] = useState('all');

  const executiveKPIs = [
    {
      title: 'Revenue Pipeline',
      value: '$18.7M',
      change: '+34.2%',
      trend: 'up',
      icon: DollarSign,
      subtitle: 'Total pipeline value',
      forecast: '$22.1M projected Q4'
    },
    {
      title: 'Conversion Rate',
      value: '68.3%',
      change: '+12.1%',
      trend: 'up',
      icon: Target,
      subtitle: 'Lead to customer',
      forecast: '72% target by Q4'
    },
    {
      title: 'Avg Deal Size',
      value: '$847K',
      change: '+18.7%',
      trend: 'up',
      icon: TrendingUp,
      subtitle: 'Per implementation project',
      forecast: '$920K projected'
    },
    {
      title: 'Sales Velocity',
      value: '32 days',
      change: '-8.2%',
      trend: 'up',
      icon: Clock,
      subtitle: 'Lead to close time',
      forecast: '28 days target'
    }
  ];

  const territoryPerformance = [
    { region: 'West Coast', revenue: '$6.2M', growth: '+28%', deals: 23, winRate: '72%', topRep: 'Sarah Johnson' },
    { region: 'Southwest', revenue: '$4.8M', growth: '+31%', deals: 18, winRate: '68%', topRep: 'Mike Chen' },
    { region: 'Northeast', revenue: '$3.9M', growth: '+22%', deals: 15, winRate: '65%', topRep: 'Emily Rodriguez' },
    { region: 'Southeast', revenue: '$2.4M', growth: '+19%', deals: 12, winRate: '61%', topRep: 'David Park' },
    { region: 'Midwest', revenue: '$1.4M', growth: '+15%', deals: 8, winRate: '58%', topRep: 'Lisa Wong' }
  ];

  const marketSegmentAnalysis = [
    { segment: 'Commercial Fleet', revenue: '$8.2M', share: '44%', growth: '+42%', avgDeal: '$1.2M' },
    { segment: 'Retail Locations', revenue: '$4.6M', share: '25%', growth: '+28%', avgDeal: '$680K' },
    { segment: 'Residential Complex', revenue: '$3.1M', share: '17%', growth: '+22%', avgDeal: '$340K' },
    { segment: 'Public Infrastructure', revenue: '$2.8M', share: '14%', growth: '+35%', avgDeal: '$950K' }
  ];

  const competitorAnalysis = [
    { competitor: 'ChargePoint', winRate: '67%', avgDeal: '$720K', strength: 'Network Size', weakness: 'Pricing' },
    { competitor: 'EVgo', winRate: '72%', avgDeal: '$580K', strength: 'Fast Charging', weakness: 'Coverage' },
    { competitor: 'Electrify America', winRate: '63%', avgDeal: '$890K', strength: 'Brand Recognition', weakness: 'Service Speed' }
  ];

  const forecastData = {
    q4Revenue: '$22.1M',
    q4Confidence: '87%',
    riskFactors: ['Supply chain delays', 'Permit processing', 'Weather conditions'],
    opportunities: ['Government incentives', 'EV adoption surge', 'Corporate sustainability goals']
  };

  return (
    <div className="space-y-8">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-2">Strategic insights and performance analytics</p>
        </div>
        <div className="flex space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Territories</SelectItem>
              <SelectItem value="west">West Coast</SelectItem>
              <SelectItem value="southwest">Southwest</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Executive KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {executiveKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${
                isPositive ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
              }`}></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    {kpi.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900">{kpi.value}</span>
                    <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-semibold ml-1">{kpi.change}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{kpi.subtitle}</p>
                  <div className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                    📈 {kpi.forecast}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Forecast */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Revenue Forecast & Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ForecastChart />
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-green-600" />
              Sales Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversionFunnelChart />
          </CardContent>
        </Card>
      </div>

      {/* Territory & Market Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Territory Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-600" />
              Territory Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {territoryPerformance.map((territory, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{territory.region}</div>
                    <div className="text-sm text-gray-500">{territory.deals} deals • {territory.winRate} win rate</div>
                    <div className="text-xs text-blue-600">Top: {territory.topRep}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{territory.revenue}</div>
                    <div className="text-sm text-green-600 font-semibold">{territory.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Segment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
              Market Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketSegmentAnalysis.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{segment.segment}</div>
                    <div className="text-sm text-gray-500">{segment.share} market share</div>
                    <div className="text-xs text-gray-400">Avg: {segment.avgDeal}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{segment.revenue}</div>
                    <div className="text-sm text-green-600 font-semibold">{segment.growth}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitive Intelligence & Forecast */}
      <div className="grid grid-cols-3 gap-6">
        {/* Competitor Analysis */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-600" />
              Competitive Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-semibold">Competitor</th>
                    <th className="text-left py-2 font-semibold">Win Rate vs.</th>
                    <th className="text-left py-2 font-semibold">Avg Deal Size</th>
                    <th className="text-left py-2 font-semibold">Key Strength</th>
                    <th className="text-left py-2 font-semibold">Weakness</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorAnalysis.map((comp, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium text-gray-900">{comp.competitor}</td>
                      <td className="py-3">
                        <Badge className={`${
                          parseInt(comp.winRate) > 65 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {comp.winRate}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-600">{comp.avgDeal}</td>
                      <td className="py-3 text-sm text-gray-600">{comp.strength}</td>
                      <td className="py-3 text-sm text-red-600">{comp.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Q4 Forecast Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Q4 Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{forecastData.q4Revenue}</div>
                <div className="text-sm text-gray-500">Projected Q4 Revenue</div>
                <Badge className="bg-green-100 text-green-800 mt-2">
                  {forecastData.q4Confidence} confidence
                </Badge>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-600 text-sm mb-2">Risk Factors:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {forecastData.riskFactors.map((risk, i) => (
                    <li key={i}>• {risk}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-600 text-sm mb-2">Opportunities:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {forecastData.opportunities.map((opp, i) => (
                    <li key={i}>• {opp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;