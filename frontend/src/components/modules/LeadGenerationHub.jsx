import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Brain, 
  Target, 
  DollarSign, 
  Plus, 
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  Building2,
  Star,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  Eye
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import dialerService from '../../services/communications/dialerService';
import emailService from '../../services/communications/emailService';

const LeadGenerationHub = () => {
  const [leads, setLeads] = useState([]);
  const [leadScores, setLeadScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  
  // Get notification functions
  const { addNotification, businessNotifications } = useNotifications();

  // Form state for new lead
  const [newLead, setNewLead] = useState({
    company_name: '',
    contact_email: '',
    contact_phone: '',
    industry: '',
    company_size: '1-10',
    estimated_budget: 0,
    location: '',
    current_ev_infrastructure: 'none',
    timeline: 'immediate',
    lead_source: ''
  });

  // Fetch leads and scores on component mount
  useEffect(() => {
    fetchLeads();
    fetchLeadScores();
  }, []);

  const fetchLeads = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/leads`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchLeadScores = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ai/lead-scores`);
      if (response.ok) {
        const data = await response.json();
        setLeadScores(data);
      }
    } catch (error) {
      console.error('Error fetching lead scores:', error);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.company_name || !newLead.contact_email || !newLead.estimated_budget) {
      alert('Please fill in all required fields');
      return;
    }

    setScoreLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/ai/lead-scoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLead),
      });

      if (response.ok) {
        const scoreResult = await response.json();
        console.log('Lead scored successfully:', scoreResult);
        
        // Add notification for new lead
        addNotification(businessNotifications.newLeadCaptured(newLead));
        
        // Add high-priority notification if score is high
        if (scoreResult.score >= 80) {
          addNotification(businessNotifications.highPriorityLead({
            company_name: newLead.company_name,
            score: scoreResult.score,
            estimated_value: scoreResult.estimated_value
          }));
        }
        
        // Refresh both leads and scores
        await fetchLeads();
        await fetchLeadScores();
        
        // Reset form and close modal
        setNewLead({
          company_name: '',
          contact_email: '',
          contact_phone: '',
          industry: '',
          company_size: '1-10',
          estimated_budget: 0,
          location: '',
          current_ev_infrastructure: 'none',
          timeline: 'immediate',
          lead_source: ''
        });
        setShowAddLead(false);
      } else {
        throw new Error('Failed to score lead');
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Error adding lead. Please try again.');
    } finally {
      setScoreLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handler for calling leads
  const handleCallLead = async (lead) => {
    if (!lead?.contact_phone) {
      addNotification({
        id: `no-phone-${Date.now()}`,
        type: 'error',
        title: 'No Phone Number',
        message: `Phone number not available for ${lead?.company_name || 'this lead'}`
      });
      return;
    }

    try {
      const result = await dialerService.makeCall({
        to_number: dialerService.formatPhoneNumber(lead.contact_phone),
        purpose: 'lead_follow_up',
        lead_id: lead.id,
        notes: `Lead follow-up call - ${lead.company_name} (Score: ${leadScores.find(s => s.lead_id === lead.id)?.score || 'Unknown'})`
      });

      if (result.success) {
        addNotification({
          id: `call-initiated-${Date.now()}`,
          type: 'success',
          title: 'Call Initiated',
          message: `Calling ${lead.company_name} at ${lead.contact_phone}`
        });
      }
    } catch (error) {
      console.error('Failed to call lead:', error);
      addNotification({
        id: `call-failed-${Date.now()}`,
        type: 'error',
        title: 'Call Failed',
        message: 'Failed to initiate call. Please try again.'
      });
    }
  };

  // Handler for emailing leads
  const handleEmailLead = async (lead) => {
    if (!lead?.contact_email) {
      addNotification({
        id: `no-email-${Date.now()}`,
        type: 'error',
        title: 'No Email Address',
        message: `Email address not available for ${lead?.company_name || 'this lead'}`
      });
      return;
    }

    try {
      const leadScore = leadScores.find(s => s.lead_id === lead.id);
      
      const result = await emailService.sendLeadFollowUp({
        lead_email: lead.contact_email,
        lead_name: lead.company_name,
        lead_score: leadScore?.score || 75,
        estimated_value: `$${leadScore?.estimated_value?.toLocaleString() || '50,000'}`,
        sales_rep: 'MATIKAI AI Team'
      });

      if (result.success) {
        addNotification({
          id: `email-sent-${Date.now()}`,
          type: 'success',
          title: 'Email Sent',
          message: `Lead follow-up email sent to ${lead.company_name}`
        });
      }
    } catch (error) {
      console.error('Failed to email lead:', error);
      addNotification({
        id: `email-failed-${Date.now()}`,
        type: 'error',
        title: 'Email Failed',
        message: 'Failed to send email. Please try again.'
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-blue-600" />
            Lead Generation Hub
          </h1>
          <p className="text-gray-600 mt-2">AI-powered lead management and scoring system</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddLead(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Lead
          </button>
          <button 
            onClick={() => window.open('/communications', '_blank')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            title="Open Sales Communications Hub"
          >
            <Phone size={18} />
            Communications Hub
          </button>
          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download size={18} />
            Export Leads
          </button>
        </div>
      </div>

      {/* AI Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <Target className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-2xl font-bold text-red-600">
                {leadScores.filter(score => score.priority === 'high').length}
              </p>
            </div>
            <AlertCircle className="text-red-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Avg Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {leadScores.length ? Math.round(leadScores.reduce((sum, score) => sum + score.score, 0) / leadScores.length) : 0}
              </p>
            </div>
            <Brain className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Est. Pipeline Value</p>
              <p className="text-2xl font-bold text-green-600">
                ${leadScores.reduce((sum, score) => sum + (score.estimated_value || 0), 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>
      </div>

      {/* AI Lead Scoring Results */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="text-purple-600" />
            AI Lead Scoring Results
          </h2>
          <p className="text-gray-600 text-sm mt-1">Prioritized leads based on AI analysis</p>
        </div>

        {leadScores.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No scored leads yet. Add a lead to see AI scoring in action!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Est. Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leadScores.slice(0, 10).map((score) => {
                  const lead = leads.find(l => l.id === score.lead_id);
                  return (
                    <tr key={score.lead_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead?.company_name || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{lead?.industry}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getScoreColor(score.score)}`}>
                            {score.score}
                          </span>
                          <Star className={`${score.score >= 80 ? 'text-yellow-500' : 'text-gray-300'}`} size={16} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(score.priority)}`}>
                          {score.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">
                          ${score.estimated_value?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleCallLead(lead)}
                            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm flex items-center gap-1"
                            title={`Call ${lead?.company_name}`}
                          >
                            <Phone size={14} />
                            Call
                          </button>
                          <button 
                            onClick={() => handleEmailLead(lead)}
                            className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm flex items-center gap-1"
                            title={`Email ${lead?.company_name}`}
                          >
                            <Mail size={14} />
                            Email
                          </button>
                          <button className="text-gray-600 hover:bg-gray-50 px-3 py-1 rounded text-sm flex items-center gap-1">
                            <Eye size={14} />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
              <p className="text-gray-600 text-sm">AI will automatically score this lead</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={newLead.company_name}
                    onChange={(e) => setNewLead({ ...newLead, company_name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={newLead.contact_email}
                    onChange={(e) => setNewLead({ ...newLead, contact_email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter contact email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newLead.contact_phone}
                    onChange={(e) => setNewLead({ ...newLead, contact_phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <input
                    type="text"
                    value={newLead.industry}
                    onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Retail, Manufacturing, Logistics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <select
                    value={newLead.company_size}
                    onChange={(e) => setNewLead({ ...newLead, company_size: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Budget *
                  </label>
                  <input
                    type="number"
                    value={newLead.estimated_budget}
                    onChange={(e) => setNewLead({ ...newLead, estimated_budget: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter budget in USD"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State/Region"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current EV Infrastructure
                  </label>
                  <select
                    value={newLead.current_ev_infrastructure}
                    onChange={(e) => setNewLead({ ...newLead, current_ev_infrastructure: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="basic">Basic (Level 1/2 charging)</option>
                    <option value="advanced">Advanced (DC Fast charging)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={newLead.timeline}
                    onChange={(e) => setNewLead({ ...newLead, timeline: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="immediate">Immediate (0-3 months)</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6-12 months">6-12 months</option>
                    <option value="1+ years">1+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Source
                  </label>
                  <input
                    type="text"
                    value={newLead.lead_source}
                    onChange={(e) => setNewLead({ ...newLead, lead_source: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Website, Trade Show, Referral"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowAddLead(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={scoreLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                disabled={scoreLoading || !newLead.company_name || !newLead.contact_email || !newLead.estimated_budget}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {scoreLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    AI Scoring...
                  </>
                ) : (
                  <>
                    <Brain size={16} />
                    Add & Score Lead
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadGenerationHub;