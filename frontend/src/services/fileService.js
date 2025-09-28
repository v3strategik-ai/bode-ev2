import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://notify-mesh.preview.emergentagent.com';

class FileService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api/files`;
    
    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // Longer timeout for file uploads
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

  async uploadFile(file, folder = 'documents', roomId = null) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      if (roomId) {
        formData.append('room_id', roomId);
      }

      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          // You can use this for progress bars
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  async uploadMultipleFiles(files, folder = 'documents', roomId = null) {
    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      formData.append('folder', folder);
      if (roomId) {
        formData.append('room_id', roomId);
      }

      const response = await this.api.post('/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload multiple files error:', error);
      throw error;
    }
  }

  async listFiles(folder = null, limit = 100) {
    try {
      let url = `/list?limit=${limit}`;
      if (folder) {
        url += `&folder=${folder}`;
      }
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }

  async deleteFile(filename) {
    try {
      const response = await this.api.delete(`/delete/${encodeURIComponent(filename)}`);
      return response.data;
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  async getFileInfo(filename) {
    try {
      const response = await this.api.get(`/info/${encodeURIComponent(filename)}`);
      return response.data;
    } catch (error) {
      console.error('Get file info error:', error);
      throw error;
    }
  }

  async generateShareLink(filename, method = 'GET', expiration = 3600) {
    try {
      const response = await this.api.post('/presigned-url', {
        filename,
        method,
        expiration
      });
      return response.data;
    } catch (error) {
      console.error('Generate share link error:', error);
      throw error;
    }
  }

  async getRoomAttachments(roomId) {
    try {
      const response = await this.api.get(`/room/${roomId}/attachments`);
      return response.data;
    } catch (error) {
      console.error('Get room attachments error:', error);
      throw error;
    }
  }

  // Helper method to format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper method to get file icon based on type
  getFileIcon(contentType) {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType.startsWith('video/')) return '🎥';
    if (contentType.startsWith('audio/')) return '🎵';
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('word') || contentType.includes('document')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '📋';
    if (contentType.includes('zip') || contentType.includes('archive')) return '📦';
    return '📁';
  }
}

export const fileService = new FileService();