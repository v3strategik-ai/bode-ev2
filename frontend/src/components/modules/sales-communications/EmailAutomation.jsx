/**
 * Email Automation Component
 * Handles email templates, AI generation, and campaigns for BODE EV
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
  Mail, 
  Send, 
  Bot, 
  FileText, 
  Users,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wand2,
  Copy,
  Edit3
} from 'lucide-react';

import emailService from '../../../services/communications/emailService';

const EmailAutomation = () => {
  const [activeTab, setActiveTab] = useState('compose');
  const [emailForm, setEmailForm] = useState({
    to_email: '',
    subject: '',
    content: '',
    template_type: ''
  });
  const [aiForm, setAIForm] = useState({
    recipient_name: '',
    recipient_email: '',
    context: '',
    tone: 'professional',
    call_to_action: '',
    customer_data: {}
  });
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [emailHistory, setEmailHistory] = useState([]);

  useEffect(() => {
    loadEmailHistory();
  }, []);

  const loadEmailHistory = () => {
    // Mock email history - in real implementation, fetch from API
    setEmailHistory([
      {
        id: '1',
        to_email: 'procurement@tesla.com',
        subject: 'EV Charging Infrastructure Proposal',
        status: 'delivered',
        sent_time: new Date(Date.now() - 3600000),
        opened: true,
        clicked: false
      },
      {
        id: '2',
        to_email: 'contact@ecocharge.com',
        subject: 'Your BODE EV Quote #BODE-12345',
        status: 'delivered',
        sent_time: new Date(Date.now() - 7200000),
        opened: true,
        clicked: true
      },
      {
        id: '3',
        to_email: 'info@greenenergy.com',
        subject: 'Service Appointment Confirmation',
        status: 'delivered',
        sent_time: new Date(Date.now() - 10800000),
        opened: false,
        clicked: false
      }
    ]);
  };

  const handleSendEmail = async () => {
    if (!emailForm.to_email || !emailForm.subject || !emailForm.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await emailService.sendEmail({
        to_email: emailForm.to_email,
        subject: emailForm.subject,
        content: emailForm.content,
        content_type: 'html'
      });

      if (result.success) {
        setEmailStatus('Email sent successfully!');
        setEmailForm({ to_email: '', subject: '', content: '', template_type: '' });
        setTimeout(loadEmailHistory, 1000);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setEmailStatus('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAIEmail = async () => {
    if (!aiForm.recipient_name || !aiForm.recipient_email || !aiForm.context) {
      alert('Please fill in recipient name, email, and context');
      return;
    }

    setIsLoading(true);
    try {
      const result = await emailService.generateAIEmail({
        recipient_name: aiForm.recipient_name,
        recipient_email: aiForm.recipient_email,
        context: aiForm.context,
        tone: aiForm.tone,
        call_to_action: aiForm.call_to_action,
        customer_data: aiForm.customer_data
      });

      if (result.success) {
        setGeneratedEmail({
          subject: result.subject,
          content: result.html_content
        });
        setEmailStatus('AI email generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate AI email:', error);
      setEmailStatus('Failed to generate AI email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAIEmail = async () => {
    if (!generatedEmail) return;

    setIsLoading(true);
    try {
      const result = await emailService.generateAndSendAIEmail(aiForm);
      
      if (result.success) {
        setEmailStatus('AI email sent successfully!');
        setGeneratedEmail(null);
        setAIForm({
          recipient_name: '',
          recipient_email: '',
          context: '',
          tone: 'professional',
          call_to_action: '',
          customer_data: {}
        });
        setTimeout(loadEmailHistory, 1000);
      }
    } catch (error) {
      console.error('Failed to send AI email:', error);
      setEmailStatus('Failed to send AI email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToCompose = () => {
    if (generatedEmail) {
      setEmailForm({
        ...emailForm,
        to_email: aiForm.recipient_email,
        subject: generatedEmail.subject,
        content: generatedEmail.content
      });
      setActiveTab('compose');
    }
  };

  const loadTemplate = (templateType) => {
    const templates = {
      lead_follow_up: {
        subject: 'Thank you for your interest in BODE EV Solutions',
        content: `<p>Dear [Customer Name],</p>
        <p>Thank you for your interest in our EV charging solutions...</p>`
      },
      quote_follow_up: {
        subject: 'Your BODE EV Quote - Next Steps',
        content: `<p>Dear [Customer Name],</p>
        <p>Following up on the quote we recently sent you...</p>`
      },
      service_confirmation: {
        subject: 'Service Appointment Confirmed',
        content: `<p>Dear [Customer Name],</p>
        <p>Your service request has been confirmed...</p>`
      }
    };

    const template = templates[templateType];
    if (template) {
      setEmailForm({
        ...emailForm,
        subject: template.subject,
        content: template.content,
        template_type: templateType
      });
    }
  };

  const getStatusIcon = (status, opened = false, clicked = false) => {
    if (clicked) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (opened) return <Eye className="h-4 w-4 text-blue-600" />;
    if (status === 'delivered') return <CheckCircle className="h-4 w-4 text-gray-600" />;
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <Button 
          variant={activeTab === 'compose' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('compose')}
          className="flex items-center"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Compose
        </Button>
        <Button 
          variant={activeTab === 'ai-generate' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('ai-generate')}
          className="flex items-center"
        >
          <Bot className="h-4 w-4 mr-2" />
          AI Generate
        </Button>
        <Button 
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('templates')}
          className="flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('history')}
          className="flex items-center"
        >
          <Clock className="h-4 w-4 mr-2" />
          History
        </Button>
      </div>

      {/* Compose Email Tab */}
      {activeTab === 'compose' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Compose Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="to_email">To</Label>
              <Input
                id="to_email"
                type="email"
                placeholder="customer@example.com"
                value={emailForm.to_email}
                onChange={(e) => setEmailForm({ ...emailForm, to_email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Email subject line"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                placeholder="Email content (HTML supported)"
                value={emailForm.content}
                onChange={(e) => setEmailForm({ ...emailForm, content: e.target.value })}
                rows={10}
              />
            </div>

            <div className="flex justify-between">
              <Select 
                value={emailForm.template_type} 
                onValueChange={(value) => {
                  setEmailForm({ ...emailForm, template_type: value });
                  loadTemplate(value);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Load template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead_follow_up">Lead Follow-up</SelectItem>
                  <SelectItem value="quote_follow_up">Quote Follow-up</SelectItem>
                  <SelectItem value="service_confirmation">Service Confirmation</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleSendEmail}
                disabled={isLoading || !emailForm.to_email || !emailForm.subject || !emailForm.content}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </div>

            {emailStatus && (
              <p className={`text-sm ${emailStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                {emailStatus}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Generate Tab */}
      {activeTab === 'ai-generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                AI Email Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipient_name">Recipient Name</Label>
                <Input
                  id="recipient_name"
                  placeholder="John Smith"
                  value={aiForm.recipient_name}
                  onChange={(e) => setAIForm({ ...aiForm, recipient_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="recipient_email">Recipient Email</Label>
                <Input
                  id="recipient_email"
                  type="email"
                  placeholder="john.smith@company.com"
                  value={aiForm.recipient_email}
                  onChange={(e) => setAIForm({ ...aiForm, recipient_email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="context">Email Context</Label>
                <Select 
                  value={aiForm.context} 
                  onValueChange={(value) => setAIForm({ ...aiForm, context: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select email context" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailService.getEmailContexts().map((context) => (
                      <SelectItem key={context.value} value={context.value}>
                        {context.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tone">Email Tone</Label>
                <Select 
                  value={aiForm.tone} 
                  onValueChange={(value) => setAIForm({ ...aiForm, tone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {emailService.getEmailTones().map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="call_to_action">Call to Action (Optional)</Label>
                <Input
                  id="call_to_action"
                  placeholder="Schedule a consultation, Accept quote, etc."
                  value={aiForm.call_to_action}
                  onChange={(e) => setAIForm({ ...aiForm, call_to_action: e.target.value })}
                />
              </div>

              <Button 
                onClick={handleGenerateAIEmail}
                disabled={isLoading || !aiForm.recipient_name || !aiForm.recipient_email || !aiForm.context}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate AI Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Email Preview */}
          {generatedEmail && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Generated Email Preview
                  </span>
                  <Badge variant="outline">AI Generated</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Subject</Label>
                  <div className="p-3 bg-gray-50 rounded border">
                    {generatedEmail.subject}
                  </div>
                </div>

                <div>
                  <Label>Content Preview</Label>
                  <div 
                    className="p-3 bg-gray-50 rounded border max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: generatedEmail.content }}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSendAIEmail}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                  <Button 
                    onClick={copyToCompose}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Edit & Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Email Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(emailService.getEmailTemplates()).map(([key, template]) => (
                <div key={key} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  <div className="text-xs text-muted-foreground mb-3">
                    Fields: {template.fields.join(', ')}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      loadTemplate(key);
                      setActiveTab('compose');
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email History Tab */}
      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Email History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emailHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No emails sent yet</p>
              ) : (
                emailHistory.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(email.status, email.opened, email.clicked)}
                      <div>
                        <p className="font-medium">{email.subject}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>To: {email.to_email}</span>
                          <span>•</span>
                          <span>{email.sent_time.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{email.status}</Badge>
                      {email.opened && <Badge variant="outline">Opened</Badge>}
                      {email.clicked && <Badge variant="outline">Clicked</Badge>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailAutomation;