import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calculator, 
  TrendingUp, 
  Brain, 
  DollarSign, 
  Plus, 
  Send, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Settings,
  Phone,
  Mail
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import dialerService from '../../services/communications/dialerService';
import emailService from '../../services/communications/emailService';

const QuoteManagementSystem = () => {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingResult, setPricingResult] = useState(null);
  
  // Get notification functions
  const { addNotification, businessNotifications } = useNotifications();

  // Pricing request form state
  const [pricingRequest, setPricingRequest] = useState({
    product_id: 'EV150',
    customer_type: 'commercial',
    quantity: 1,
    location: '',
    installation_complexity: 'moderate',
    timeline: 'immediate',
    competitor_pricing: null
  });

  // Mock quotes data - in real app this would come from backend
  const [quotes] = useState([
    {
      id: 'Q-2025-001',
      project: 'Tesla Supercharger - Phase 2',
      client: 'Tesla Inc.',
      contact_name: 'Sarah Johnson',
      contact_email: 's.johnson@tesla.com',
      contact_phone: '+15551234567',
      value: '$2.4M',
      stations: 48,
      deadline: '2025-09-28',
      status: 'In Review',
      progress: 75
    },
    {
      id: 'Q-2025-002', 
      project: 'Walmart Fleet Charging',
      client: 'Walmart',
      contact_name: 'Mike Chen',
      contact_email: 'm.chen@walmart.com', 
      contact_phone: '+15559876543',
      value: '$890K',
      stations: 24,
      deadline: '2025-10-15',
      status: 'Sent',
      progress: 100
    },
    {
      id: 'Q-2025-003',
      project: 'City Transit Hub',
      client: 'Metro Transit Authority',
      contact_name: 'Lisa Rodriguez',
      contact_email: 'l.rodriguez@metrotransit.gov',
      contact_phone: '+15555551234',
      value: '$1.2M', 
      stations: 32,
      deadline: '2025-11-01',
      status: 'Draft',
      progress: 45
    }
  ]);

  const handleGetPricingRecommendation = async () => {
    if (!pricingRequest.location) {
      alert('Please enter a location');
      return;
    }

    setPricingLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ai/dynamic-pricing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingRequest),
      });

      if (response.ok) {
        const result = await response.json();
        setPricingResult(result);
        
        // Add notification for AI pricing completion
        addNotification(businessNotifications.aiPricingComplete(result));
      } else {
        throw new Error('Failed to get pricing recommendation');
      }
    } catch (error) {
      console.error('Error getting pricing recommendation:', error);
      alert('Error getting pricing recommendation. Please try again.');
    } finally {
      setPricingLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'In Review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Draft': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Approved': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const products = [
    { id: 'EV150', name: 'BODE EV FastCharge Pro 150kW', basePrice: 45000 },
    { id: 'EV250', name: 'BODE EV UltraCharge 250kW', basePrice: 75000 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-green-600" />
            Quote Management System
          </h1>
          <p className="text-gray-600 mt-2">AI-powered pricing and quote generation</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowPricingModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Brain size={18} />
            AI Pricing
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} />
            New Quote
          </button>
        </div>
      </div>

      {/* AI Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Smart Calculator</p>
              <p className="text-2xl font-bold text-green-600">AI-Powered</p>
              <p className="text-xs text-gray-500 mt-1">Real-time pricing</p>
            </div>
            <Calculator className="text-green-600" size={32} />
          </div>
          <button 
            onClick={() => setShowPricingModal(true)}
            className="w-full mt-4 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 text-sm font-medium"
          >
            Launch Calculator
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Quote Templates</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-xs text-gray-500 mt-1">Pre-built scenarios</p>
            </div>
            <FileText className="text-blue-600" size={32} />
          </div>
          <button className="w-full mt-4 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 text-sm font-medium">
            Manage Templates
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Price Optimization</p>
              <p className="text-2xl font-bold text-purple-600">94.2%</p>
              <p className="text-xs text-gray-500 mt-1">Win rate improvement</p>
            </div>
            <TrendingUp className="text-purple-600" size={32} />
          </div>
          <button className="w-full mt-4 bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 text-sm font-medium">
            View Analytics
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approval Workflow</p>
              <p className="text-2xl font-bold text-orange-600">Auto</p>
              <p className="text-xs text-gray-500 mt-1">Large projects</p>
            </div>
            <Settings className="text-orange-600" size={32} />
          </div>
          <button className="w-full mt-4 bg-orange-50 text-orange-700 py-2 rounded-lg hover:bg-orange-100 text-sm font-medium">
            Configure Flow
          </button>
        </div>
      </div>

      {/* Pending Quotes Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Pending Quotes</h2>
          <p className="text-gray-600 text-sm mt-1">Track and manage all project quotes</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{quote.project}</p>
                      <p className="text-sm text-gray-600">{quote.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{quote.client}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-green-600 font-semibold">{quote.value}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Zap className="text-yellow-500" size={16} />
                      <span>{quote.stations}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Clock className="text-gray-400" size={16} />
                      <span className="text-sm">{quote.deadline}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:bg-green-50 p-2 rounded">
                        <Send size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Brain className="text-green-600" />
                AI Dynamic Pricing
              </h2>
              <p className="text-gray-600 text-sm">Get optimized pricing recommendations</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product
                  </label>
                  <select
                    value={pricingRequest.product_id}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, product_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Type
                  </label>
                  <select
                    value={pricingRequest.customer_type}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, customer_type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                    <option value="government">Government</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pricingRequest.quantity}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={pricingRequest.location}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installation Complexity
                  </label>
                  <select
                    value={pricingRequest.installation_complexity}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, installation_complexity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="simple">Simple</option>
                    <option value="moderate">Moderate</option>
                    <option value="complex">Complex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={pricingRequest.timeline}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, timeline: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="immediate">Immediate (0-3 months)</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="1+ years">1+ years</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competitor Pricing (Optional)
                  </label>
                  <input
                    type="number"
                    value={pricingRequest.competitor_pricing || ''}
                    onChange={(e) => setPricingRequest({ ...pricingRequest, competitor_pricing: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter competitor price if known"
                  />
                </div>
              </div>

              {/* Pricing Result */}
              {pricingResult && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={20} />
                    AI Pricing Recommendation
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Base Price</p>
                      <p className="text-xl font-bold text-gray-900">${pricingResult.base_price?.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">Recommended Price</p>
                      <p className="text-xl font-bold text-green-600">${pricingResult.recommended_price?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Discount</p>
                      <p className="text-lg font-semibold text-blue-600">{pricingResult.discount_percentage?.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-lg font-semibold text-purple-600">{(pricingResult.confidence_level * 100)?.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Strategy:</p>
                    <p className="text-sm text-gray-900">{pricingResult.pricing_strategy}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">AI Reasoning:</p>
                    <p className="text-sm text-gray-900">{pricingResult.reasoning}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowPricingModal(false);
                  setPricingResult(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={pricingLoading}
              >
                {pricingResult ? 'Close' : 'Cancel'}
              </button>
              {!pricingResult && (
                <button
                  onClick={handleGetPricingRecommendation}
                  disabled={pricingLoading || !pricingRequest.location}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {pricingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain size={16} />
                      Get AI Pricing
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteManagementSystem;