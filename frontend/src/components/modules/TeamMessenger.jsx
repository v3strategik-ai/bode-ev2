import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageCircle, 
  Users, 
  Phone, 
  FileText, 
  Settings, 
  Wifi, 
  WifiOff,
  Plus,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/messenger/AuthContext';
import { useWebSocket } from '../../contexts/messenger/WebSocketContext';
import AuthContainer from '../messenger/auth/AuthContainer';
import ChatInterface from '../messenger/chat/ChatInterface';
import RoomsInterface from '../messenger/rooms/RoomsInterface';
import FilesInterface from '../messenger/files/FilesInterface';
import CallsInterface from '../messenger/calls/CallsInterface';

const TeamMessenger = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { isConnected, messages } = useWebSocket();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Team Messenger</h2>
          <p className="text-gray-600">Connect with your MATIKAI team in real-time</p>
        </div>
        <AuthContainer onAuthSuccess={() => {
          // Authentication success is handled by the context
          console.log('Authentication successful');
        }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Team Messenger</h2>
          <p className="text-gray-600">
            Welcome back, {user?.full_name || user?.username}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Online
                </Badge>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Disconnected
                </Badge>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Messenger Interface */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <CardTitle>MATIKAI Team Communication</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
          <CardDescription>
            Real-time messaging, file sharing, and team collaboration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chat" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Chats</span>
                {messages.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {messages.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Rooms</span>
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Calls</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Files</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-6">
              <ChatInterface 
                selectedRoom={selectedRoom} 
                onRoomSelect={setSelectedRoom}
              />
            </TabsContent>

            <TabsContent value="rooms" className="mt-6">
              <RoomsInterface 
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
              />
            </TabsContent>

            <TabsContent value="calls" className="mt-6">
              <CallsInterface 
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
              />
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <FilesInterface 
                selectedRoom={selectedRoom}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMessenger;