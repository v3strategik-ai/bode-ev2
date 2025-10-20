import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Clock, AlertCircle, CheckCircle, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useNotifications } from '../../contexts/NotificationContext';
import dialerService from '../../services/communications/dialerService';
import emailService from '../../services/communications/emailService';

const CustomerSupport = () => {
  const { addNotification } = useNotifications();

  // Mock support tickets data
  const [tickets] = useState([
    {
      id: 'T-2025-001',
      title: 'System Integration Issue',
      customer: 'TechCorp Solutions',
      contact_name: 'Sarah Johnson',
      contact_email: 's.johnson@tesla.com',
      contact_phone: '+15551234567',
      priority: 'high',
      status: 'open',
      created: '2025-09-28 09:15',
      category: 'technical'
    },
    {
      id: 'T-2025-002',
      title: 'Installation Scheduling',
      customer: 'InnovateBiz Corp', 
      contact_name: 'Mike Chen',
      contact_email: 'm.chen@ecocharge.com',
      contact_phone: '+15559876543',
      priority: 'medium',
      status: 'in-progress',
      created: '2025-09-28 08:30',
      category: 'installation'
    },
    {
      id: 'T-2025-003',
      title: 'Billing Question',
      customer: 'GlobalTech Enterprises',
      contact_name: 'Lisa Rodriguez',
      contact_email: 'l.rodriguez@greenenergy.com', 
      contact_phone: '+15555551234',
      priority: 'low',
      status: 'pending',
      created: '2025-09-27 16:45',
      category: 'billing'
    }
  ]);

  // Handler for calling customers
  const handleCallCustomer = async (ticket) => {
    if (!ticket?.contact_phone) {
      addNotification({
        id: `no-phone-${Date.now()}`,
        type: 'error',
        title: 'No Phone Number',
        message: `Phone number not available for ${ticket?.customer || 'this customer'}`
      });
      return;
    }

    try {
      const result = await dialerService.makeCall({
        to_number: dialerService.formatPhoneNumber(ticket.contact_phone),
        purpose: 'customer_service',
        notes: `Customer support call - Ticket ${ticket.id}: ${ticket.title} - ${ticket.customer}`
      });

      if (result.success) {
        addNotification({
          id: `call-initiated-${Date.now()}`,
          type: 'success',
          title: 'Call Initiated',
          message: `Calling ${ticket.contact_name} at ${ticket.customer} about ticket ${ticket.id}`
        });
      }
    } catch (error) {
      console.error('Failed to call customer:', error);
      addNotification({
        id: `call-failed-${Date.now()}`,
        type: 'error',
        title: 'Call Failed',
        message: 'Failed to initiate call. Please try again.'
      });
    }
  };

  // Handler for emailing service confirmations
  const handleEmailCustomer = async (ticket) => {
    if (!ticket?.contact_email) {
      addNotification({
        id: `no-email-${Date.now()}`,
        type: 'error',
        title: 'No Email Address',
        message: `Email address not available for ${ticket?.customer || 'this customer'}`
      });
      return;
    }

    try {
      const result = await emailService.sendServiceConfirmation({
        customer_email: ticket.contact_email,
        customer_name: ticket.contact_name,
        service_type: ticket.title,
        appointment_date: 'To be scheduled',
        technician_name: 'MATIKAI AI Support Team'
      });

      if (result.success) {
        addNotification({
          id: `email-sent-${Date.now()}`,
          type: 'success',
          title: 'Service Email Sent',
          message: `Service confirmation email sent to ${ticket.contact_name} at ${ticket.customer}`
        });
      }
    } catch (error) {
      console.error('Failed to email customer:', error);
      addNotification({
        id: `email-failed-${Date.now()}`,
        type: 'error',
        title: 'Email Failed',
        message: 'Failed to send service email. Please try again.'
      });
    }
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getStatusColor = (status) => {
    if (status === 'open') return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'in-progress') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

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

      {/* Support Tickets Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Active Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{ticket.title}</p>
                        <p className="text-sm text-gray-600">{ticket.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gray-900">{ticket.customer}</p>
                        <p className="text-sm text-gray-600">{ticket.contact_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="text-gray-400" size={16} />
                        <span className="text-sm">{ticket.created}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleCallCustomer(ticket)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                          title={`Call ${ticket.contact_name}`}
                        >
                          <Phone size={16} />
                        </button>
                        <button 
                          onClick={() => handleEmailCustomer(ticket)}
                          className="text-green-600 hover:bg-green-50 p-2 rounded"
                          title={`Email ${ticket.contact_name}`}
                        >
                          <Mail size={16} />
                        </button>
                        <button className="text-gray-600 hover:bg-gray-50 p-2 rounded" title="View details">
                          <User size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSupport;