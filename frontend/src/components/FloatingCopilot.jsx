import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Send, Mic, MessageSquare, Bot, Zap, Calendar, FileText, BarChart3, Settings, Calculator, Target, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const FloatingCopilot = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('automation');
  const [messages, setMessages] = useState([
    { type: 'assistant', content: 'Welcome to MATIKAI Assistant! I specialize in lead generation, quoting, and organizational workflows. I can help you:\n\n• Generate and qualify leads automatically\n• Create accurate quotes in minutes\n• Set up automated follow-up sequences\n• Optimize your sales processes\n\nWhat would you like to accomplish today?' }
  ]);

  const leadGenerationTools = [
    { 
      label: 'Lead Capture Automation', 
      icon: Target, 
      color: 'from-blue-500 to-blue-600', 
      description: 'Auto-capture leads from website, events, referrals',
      action: 'Set up lead capture forms and integrations'
    },
    { 
      label: 'AI Lead Scoring', 
      icon: TrendingUp, 
      color: 'from-green-500 to-green-600', 
      description: 'Intelligent lead qualification and prioritization',
      action: 'Configure scoring rules based on your criteria'
    },
    { 
      label: 'Follow-up Sequences', 
      icon: Calendar, 
      color: 'from-purple-500 to-indigo-600', 
      description: 'Automated nurture campaigns and reminders',
      action: 'Create email sequences and task automation'
    },
    { 
      label: 'Territory Management', 
      icon: Users, 
      color: 'from-orange-500 to-red-500', 
      description: 'Geographic lead distribution and assignment',
      action: 'Define territories and assignment rules'
    }
  ];

  const quotingTools = [
    { 
      label: 'Smart Quote Generator', 
      icon: Calculator, 
      color: 'from-green-500 to-emerald-600', 
      description: 'AI-powered pricing with real-time calculations',
      action: 'Generate quotes with dynamic pricing models'
    },
    { 
      label: 'Quote Templates', 
      icon: FileText, 
      color: 'from-blue-500 to-cyan-600', 
      description: 'Pre-built templates for different scenarios',
      action: 'Create and manage quote templates'
    },
    { 
      label: 'Approval Workflows', 
      icon: Settings, 
      color: 'from-indigo-500 to-purple-600', 
      description: 'Automated approval process for large projects',
      action: 'Set up multi-level approval chains'
    },
    { 
      label: 'Price Optimization', 
      icon: TrendingUp, 
      color: 'from-purple-500 to-pink-600', 
      description: 'Market-based dynamic pricing recommendations',
      action: 'Analyze pricing trends and optimize rates'
    }
  ];

  const organizationTools = [
    { 
      label: 'Task Automation', 
      icon: Zap, 
      color: 'from-yellow-500 to-orange-500', 
      description: 'Automate routine tasks and workflows',
      action: 'Create custom task automation rules'
    },
    { 
      label: 'Performance Analytics', 
      icon: BarChart3, 
      color: 'from-indigo-500 to-blue-600', 
      description: 'Track KPIs and generate insights',
      action: 'Set up dashboards and reporting automation'
    },
    { 
      label: 'Process Optimization', 
      icon: Settings, 
      color: 'from-green-500 to-teal-600', 
      description: 'Identify bottlenecks and improvement opportunities',
      action: 'Analyze and optimize your workflows'
    },
    { 
      label: 'Communication Hub', 
      icon: MessageSquare, 
      color: 'from-purple-500 to-indigo-600', 
      description: 'Centralized customer and team communications',
      action: 'Integrate communication channels'
    }
  ];

  const quickActions = [
    { label: 'Generate Lead Report', icon: '📊' },
    { label: 'Create Quote', icon: '💰' },
    { label: 'Schedule Follow-up', icon: '📅' },
    { label: 'Optimize Pricing', icon: '🎯' }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessages = [...messages, { type: 'user', content: message }];
      
      // AI-powered response based on MATIKAI focus areas
      let response = '';
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('lead') || lowerMessage.includes('prospect')) {
        response = 'I can help you optimize your lead generation process. Would you like me to:\n\n• Set up automated lead capture from your website\n• Configure lead scoring rules\n• Create follow-up email sequences\n• Analyze your current lead conversion rates\n\nWhat specific aspect of lead generation would you like to improve?';
      } else if (lowerMessage.includes('quote') || lowerMessage.includes('pricing')) {
        response = 'Let me assist with your quoting process. I can:\n\n• Generate accurate quotes using our smart calculator\n• Create custom quote templates for different project types\n• Set up approval workflows for large projects\n• Analyze pricing trends for optimization\n\nWhich quoting feature would be most valuable for your current needs?';
      } else if (lowerMessage.includes('organize') || lowerMessage.includes('workflow')) {
        response = 'I\'ll help streamline your operations. Here are some automation options:\n\n• Task automation for routine processes\n• Performance dashboards and reporting\n• Communication workflow optimization\n• Process bottleneck identification\n\nWhat aspect of your organization would you like to improve first?';
      } else {
        response = 'I understand you need assistance with your EV charging business operations. As your MATIKAI Assistant, I can help with:\n\n🎯 **Lead Generation** - Capture, score, and nurture prospects\n💰 **Quoting** - Smart pricing and approval workflows  \n📋 **Organization** - Process automation and optimization\n\nCould you tell me more about your specific challenge?';
      }
      
      newMessages.push({ type: 'assistant', content: response });
      setMessages(newMessages);
      setMessage('');
    }
  };

  const renderToolSection = () => {
    let tools = [];
    let title = '';
    
    switch(activeSection) {
      case 'leads':
        tools = leadGenerationTools;
        title = 'Lead Generation Tools';
        break;
      case 'quotes':
        tools = quotingTools;
        title = 'Quoting & Pricing Tools';
        break;
      case 'organization':
        tools = organizationTools;
        title = 'Organization & Workflow Tools';
        break;
      default:
        return (
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Core Business Areas</h4>
            <Button
              onClick={() => setActiveSection('leads')}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-xl border-0 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5" />
                  <span className="font-semibold">Lead Generation</span>
                </div>
                <Badge className="bg-white/20 text-white">4 Tools</Badge>
              </div>
            </Button>
            <Button
              onClick={() => setActiveSection('quotes')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-xl border-0 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <Calculator className="h-5 w-5" />
                  <span className="font-semibold">Quote Management</span>
                </div>
                <Badge className="bg-white/20 text-white">4 Tools</Badge>
              </div>
            </Button>
            <Button
              onClick={() => setActiveSection('organization')}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-xl border-0 transition-all duration-300"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5" />
                  <span className="font-semibold">Organization</span>
                </div>
                <Badge className="bg-white/20 text-white">4 Tools</Badge>
              </div>
            </Button>
          </div>
        );
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection('automation')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Button>
        </div>
        <div className="space-y-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900">{tool.label}</div>
                    <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                    <Button size="sm" variant="outline" className="text-xs h-6">
                      {tool.action}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50 group">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-110 border-0"
        >
          <Bot className="h-8 w-8 group-hover:animate-pulse" />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          MATIKAI Assistant
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-gray-200 transition-all duration-500 ${
      isMaximized ? 'w-[500px] h-[700px]' : 'w-96 h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-t-3xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-lg">MATIKAI Assistant</span>
              <div className="text-xs opacity-90">Business Operations AI</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-xl transition-all duration-300"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-xl transition-all duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-80px)]">
        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-12 flex flex-col items-center justify-center space-y-1 hover:bg-green-50 hover:border-green-200 transition-all duration-300"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Tool Sections */}
        <div className="flex-1 overflow-y-auto">
          {renderToolSection()}
        </div>

        {/* Chat Area */}
        <div className="border-t border-gray-100">
          <div className="max-h-40 overflow-y-auto p-3 space-y-2">
            {messages.slice(-2).map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2 rounded-xl text-xs ${
                  msg.type === 'user' 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask about leads, quotes, or organization..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-xl border-gray-200 focus:border-green-500 transition-all duration-300 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-3 border-0 transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCopilot;