/**
 * Dialer Interface Component
 * Handles all calling functionality for MATIKAI sales team
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { 
  Phone, 
  PhoneCall, 
  Clock, 
  DollarSign, 
  User, 
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

import dialerService from '../../../services/communications/dialerService';

const DialerInterface = () => {
  const [activeCall, setActiveCall] = useState(null);
  const [callForm, setCallForm] = useState({
    phone: '',
    purpose: '',
    notes: ''
  });
  const [callHistory, setCallHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState('');

  useEffect(() => {
    loadCallHistory();
  }, []);

  const loadCallHistory = async () => {
    try {
      // In a real implementation, this would fetch from the API
      const history = dialerService.getMockCallHistory();
      setCallHistory(history);
    } catch (error) {
      console.error('Failed to load call history:', error);
    }
  };

  const handleMakeCall = async () => {
    if (!callForm.phone || !callForm.purpose) {
      alert('Please fill in phone number and call purpose');
      return;
    }

    setIsLoading(true);
    try {
      const callData = {
        to_number: dialerService.formatPhoneNumber(callForm.phone),
        purpose: callForm.purpose,
        notes: callForm.notes
      };

      const result = await dialerService.makeCall(callData);
      
      if (result.success) {
        setActiveCall({
          id: result.call_id,
          phone: callForm.phone,
          purpose: callForm.purpose,
          status: result.status,
          startTime: new Date()
        });
        setCallStatus('Call initiated successfully!');
        
        // Clear form
        setCallForm({ phone: '', purpose: '', notes: '' });
        
        // Reload call history
        setTimeout(loadCallHistory, 1000);
      }
    } catch (error) {
      console.error('Failed to make call:', error);
      setCallStatus('Failed to make call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDial = (contact) => {
    setCallForm({
      phone: contact.phone,
      purpose: 'lead_follow_up',
      notes: `Quick dial to ${contact.name}`
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'no-answer':
      case 'busy':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const quickContacts = [
    { name: 'TechCorp Solutions', phone: '+15551234567', company: 'Tesla Inc.' },
    { name: 'EcoCharge Networks', phone: '+15559876543', company: 'EcoCharge' },
    { name: 'Green Energy Solutions', phone: '+15555551234', company: 'Green Energy' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dialer Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhoneCall className="h-5 w-5 mr-2" />
              Make a Call
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={callForm.phone}
                onChange={(e) => setCallForm({ ...callForm, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="purpose">Call Purpose</Label>
              <Select 
                value={callForm.purpose} 
                onValueChange={(value) => setCallForm({ ...callForm, purpose: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select call purpose" />
                </SelectTrigger>
                <SelectContent>
                  {dialerService.getCallPurposes().map((purpose) => (
                    <SelectItem key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this call..."
                value={callForm.notes}
                onChange={(e) => setCallForm({ ...callForm, notes: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleMakeCall} 
              disabled={isLoading || !callForm.phone || !callForm.purpose}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calling...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  Make Call
                </>
              )}
            </Button>

            {callStatus && (
              <p className={`text-sm ${callStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {callStatus}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Active Call Status */}
        {activeCall && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Active Call
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{activeCall.phone}</span>
                  <Badge>{activeCall.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Purpose: {dialerService.getCallPurposes().find(p => p.value === activeCall.purpose)?.label}
                </div>
                <div className="text-sm">
                  Started: {activeCall.startTime.toLocaleTimeString()}
                </div>
                
                <div className="flex space-x-2 pt-3">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-1" />
                    Transfer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Follow-up
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setActiveCall(null)}
                  >
                    End Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Quick Dial Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleQuickDial(contact)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {callHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No calls made yet</p>
            ) : (
              callHistory.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(call.status)}
                    <div>
                      <p className="font-medium">{call.customer_name || call.to_number}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{dialerService.getCallPurposes().find(p => p.value === call.purpose)?.label}</span>
                        <span>•</span>
                        <span>{call.start_time.toLocaleString()}</span>
                        {call.duration > 0 && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(call.duration)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{call.status}</Badge>
                    <div className="text-right text-sm">
                      <p className="font-medium">{call.cost}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DialerInterface;