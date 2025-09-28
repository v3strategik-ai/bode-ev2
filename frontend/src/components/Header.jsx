import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import NotificationBell from './notifications/NotificationBell';

const Header = ({ darkMode, setDarkMode, onModuleChange }) => {
  
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
        {/* Left section - BODE EV Logo and title */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-baseline space-x-1">
              <span className="bg-green-500 text-white px-3 py-1.5 rounded-lg font-bold text-lg lowercase shadow-md">
                bode
              </span>
              <span className="bg-blue-600 text-white px-2 py-1.5 rounded-md font-bold text-sm uppercase tracking-wider shadow-md">
                EV
              </span>
            </div>
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Enterprise V3</span>
          </div>
          <div className="border-l border-gray-300 pl-6 ml-6">
            <h1 className="text-2xl font-bold text-gray-900">
              BODE EV Enterprise V3
            </h1>
            <p className="text-sm text-gray-600 font-medium">EV charging solutions & sales platform • Lead Generation & Quoting System</p>
          </div>
        </div>

        {/* Center section - Stats */}
        <div className="flex items-center space-x-8 text-sm">
          <div className="flex items-center space-x-3 bg-gray-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-300/30"></div>
            <span className="font-semibold text-gray-700">99.8% Platform Uptime</span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300/30"></div>
            <span className="font-semibold text-gray-700">77.3% Success Rate</span>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-lg shadow-amber-300/30"></div>
            <span className="font-semibold text-gray-700">59M+ EV Miles</span>
          </div>
        </div>

        {/* Right section - Actions and time */}
        <div className="flex items-center space-x-6">
          <div className="text-right text-sm bg-gray-50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
            <div className="font-mono text-xl font-bold text-gray-900">
              03:03:34 AM
            </div>
            <div className="text-gray-600 text-xs">9/22/2025</div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search charging networks"
                className="pl-12 pr-4 py-3 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 w-72 rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
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
            
            <div className="text-right bg-gray-50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200">
              <div className="font-semibold text-sm text-gray-900">BODE EV Admin</div>
              <div className="text-xs text-gray-600">Sales Operations</div>
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