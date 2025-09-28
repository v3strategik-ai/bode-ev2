import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://notify-mesh.preview.emergentagent.com';

class MessengerService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/messenger`;
    
    // Create axios instance with default config
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('messenger_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Room Management
  async createRoom(roomData) {
    try {
      const response = await this.api.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Create room error:', error);
      throw error;
    }
  }

  async getUserRooms() {
    try {
      const response = await this.api.get('/rooms');
      return response.data;
    } catch (error) {
      console.error('Get rooms error:', error);
      throw error;
    }
  }

  async joinRoom(roomId) {
    try {
      const response = await this.api.post(`/rooms/${roomId}/join`);
      return response.data;
    } catch (error) {
      console.error('Join room error:', error);
      throw error;
    }
  }

  async leaveRoom(roomId) {
    try {
      const response = await this.api.post(`/rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Leave room error:', error);
      throw error;
    }
  }

  // Message Management
  async sendMessage(messageData) {
    try {
      const response = await this.api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  async getRoomMessages(roomId, limit = 50) {
    try {
      const response = await this.api.get(`/rooms/${roomId}/messages?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get messages error:', error);
      throw error;
    }
  }

  async updateMessage(messageId, content) {
    try {
      const response = await this.api.put(`/messages/${messageId}`, { content });
      return response.data;
    } catch (error) {
      console.error('Update message error:', error);
      throw error;
    }
  }

  async deleteMessage(messageId) {
    try {
      const response = await this.api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  // Video Call Management
  async startVideoCall(callData) {
    try {
      const response = await this.api.post('/calls', callData);
      return response.data;
    } catch (error) {
      console.error('Start call error:', error);
      throw error;
    }
  }

  async joinVideoCall(callId) {
    try {
      const response = await this.api.post(`/calls/${callId}/join`);
      return response.data;
    } catch (error) {
      console.error('Join call error:', error);
      throw error;
    }
  }

  async endVideoCall(callId) {
    try {
      const response = await this.api.post(`/calls/${callId}/end`);
      return response.data;
    } catch (error) {
      console.error('End call error:', error);
      throw error;
    }
  }
}

export const messengerService = new MessengerService();