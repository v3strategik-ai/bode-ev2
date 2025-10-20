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
    onModuleChange('lead-generation');
  };

  const handleReportGeneration = () => {
    onModuleChange('reports');
  };

  const handleSettings = () => {
    onModuleChange('settings');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Left section - Large MATIKAI Logo with badge underneath */}
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="relative group">
              <img 
                src="/matikai-logo.png" 
                alt="MATIKAI Logo" 
                className="h-24 w-auto backdrop-blur-sm bg-white/10 shadow-2xl rounded-2xl border border-white/20 transform hover:scale-110 transition-all duration-500 hover:shadow-3xl hover:bg-white/20 relative z-10"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(59, 130, 246, 0.15))'
                }}
              />
              {/* Floating glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl blur-xl -z-10 group-hover:from-blue-400/30 group-hover:to-purple-500/30 transition-all duration-500"></div>
            </div>
            <span className="text-sm text-blue-600 font-semibold bg-blue-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/50 shadow-lg hover:bg-blue-50/90 transition-all duration-300">
              Enterprise AI Platform
            </span>
          </div>
          <div className="border-l border-blue-200 pl-8 ml-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              MATIKAI Enterprise AI
            </h1>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              Intelligent business automation & AI-driven solutions
            </p>
            <p className="text-sm text-blue-600 font-medium mt-1">
              Enterprise AI Platform & CRM
            </p>
          </div>
        </div>

        {/* Center section - Stats */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-6 text-sm">
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
        </div>

        {/* Right section - Actions and time */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-6 mb-2">
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
                  placeholder="Search platform features..."
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
      </div>

      {/* Action buttons row */}
      <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-100">
        <Button 
          onClick={handleQuoteRequest}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3 text-lg">💼</span>
          AI Proposals
        </Button>
        <Button 
          onClick={handleLeadGeneration}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3">🤖</span>
          AI Lead Gen
        </Button>
        <Button 
          onClick={handleReportGeneration}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3">📊</span>
          AI Analytics
        </Button>
        <Button 
          onClick={handleSettings}
          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-0"
        >
          <span className="mr-3">⚙️</span>
          AI Settings
        </Button>
      </div>
    </header>
  );
};

export default Header;