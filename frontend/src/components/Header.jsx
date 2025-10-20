import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import NotificationBell from './notifications/NotificationBell';

const Header = ({ darkMode, setDarkMode, onModuleChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleQuoteRequest = () => {
    onModuleChange('quotes');
  };

  const handleLeadGeneration = () => {
    onModuleChange('leads');
  };

  const handleReportGeneration = () => {
    onModuleChange('analytics');
  };

  const handleSettings = () => {
    onModuleChange('settings');
  };
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left section - MATIKAI Logo and title */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/matikai-logo.png" 
              alt="MATIKAI Logo" 
              className="h-12 w-auto shadow-lg rounded-lg"
            />
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">Enterprise AI Platform</span>
          </div>
          <div className="border-l border-blue-200 pl-6 ml-6">
            <h1 className="text-2xl font-bold text-gray-900">
              MATIKAI Enterprise AI
            </h1>
            <p className="text-sm text-gray-600 font-medium">AI-powered business solutions & intelligent automation • Sales & Communications Platform</p>
          </div>
        </div>

        {/* Center section - Stats */}
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-3 bg-blue-50 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-200">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300/30"></div>
            <span className="font-semibold text-blue-700">99.8% AI Uptime</span>
          </div>
          <div className="flex items-center space-x-3 bg-indigo-50 backdrop-blur-sm rounded-full px-4 py-2 border border-indigo-200">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-300/30"></div>
            <span className="font-semibold text-indigo-700">94.2% Accuracy Rate</span>
          </div>
          <div className="flex items-center space-x-3 bg-purple-50 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-200">
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-300/30"></div>
            <span className="font-semibold text-purple-700">2.8M+ Interactions</span>
          </div>
        </div>

        {/* Right section - Actions and time */}
        <div className="flex items-center space-x-6">
          <div className="text-right text-sm bg-gray-50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
            <div className="font-mono text-xl font-bold text-gray-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-600 text-xs">{formatDate(currentTime)}</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search AI solutions..."
                className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 w-72 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-700 hover:bg-gray-100 rounded-xl px-4 py-2 border border-gray-200 transition-all duration-300"
            >
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              Dark
            </Button>
            
            <NotificationBell />
            
            <div className="text-right bg-blue-50 backdrop-blur-sm rounded-xl px-4 py-2 border border-blue-200">
              <div className="font-semibold text-sm text-blue-900">MATIKAI Admin</div>
              <div className="text-xs text-blue-600">AI Operations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-100">
        <Button 
          onClick={handleQuoteRequest}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3 text-lg">💰</span>
          Create Quote
        </Button>
        <Button 
          onClick={handleLeadGeneration}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3">🎯</span>
          Generate Leads
        </Button>
        <Button 
          onClick={handleReportGeneration}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3">📊</span>
          Sales Report
        </Button>
        <Button 
          onClick={handleSettings}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3">⚙️</span>
          Settings
        </Button>
      </div>
    </header>
  );
};

export default Header;