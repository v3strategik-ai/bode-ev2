import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sound alert function for high-priority notifications
  const playNotificationSound = useCallback((priority) => {
    if (priority === 'critical' || priority === 'high') {
      try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different tones for different priorities
        if (priority === 'critical') {
          // Urgent alert sound - higher pitch
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        } else {
          // High priority sound - single tone
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Audio notification not available:', error);
      }
    }
  }, []);

  // Add notification function
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Play sound for high-priority notifications
    playNotificationSound(notification.priority);

    // Browser notification for critical alerts (if permission granted)
    if (notification.priority === 'critical' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`MATIKAI: ${notification.title}`, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }

    return id;
  }, [playNotificationSound]);

  // Remove notification function
  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.id === id && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Predefined notification templates for business events
  const businessNotifications = {
    highPriorityLead: (leadData) => ({
      type: 'ai_alert',
      priority: 'critical',
      title: 'High-Priority Lead Detected!',
      message: `${leadData.company_name} scored ${leadData.score}/100 with $${leadData.estimated_value?.toLocaleString()} potential value`,
      icon: '🚨',
      actionText: 'View Lead',
      actionUrl: '#lead-generation'
    }),

    newLeadCaptured: (leadData) => ({
      type: 'business_event',
      priority: 'medium',
      title: 'New Lead Captured',
      message: `${leadData.company_name} from ${leadData.industry} industry`,
      icon: '📧',
      actionText: 'Review Lead',
      actionUrl: '#lead-generation'
    }),

    quoteApprovalNeeded: (quoteData) => ({
      type: 'approval_request',
      priority: 'high',
      title: 'Quote Approval Required',
      message: `${quoteData.project} - ${quoteData.value} needs approval`,
      icon: '📋',
      actionText: 'Review Quote',
      actionUrl: '#quote-management'
    }),

    quoteExpiring: (quoteData) => ({
      type: 'deadline_alert',
      priority: 'high',
      title: 'Quote Expiring Soon',
      message: `${quoteData.project} expires on ${quoteData.deadline}`,
      icon: '⏰',
      actionText: 'Follow Up',
      actionUrl: '#quote-management'
    }),

    aiPricingComplete: (pricingData) => ({
      type: 'ai_update',
      priority: 'low',
      title: 'AI Pricing Calculated',
      message: `Optimized price: $${pricingData.recommended_price?.toLocaleString()} (${pricingData.confidence_level * 100}% confidence)`,
      icon: '🧠',
      actionText: 'View Results',
      actionUrl: '#quote-management'
    }),

    pipelineUpdate: (change) => ({
      type: 'business_event',
      priority: 'medium',
      title: 'Pipeline Update',
      message: `Pipeline value ${change > 0 ? 'increased' : 'decreased'} by $${Math.abs(change).toLocaleString()}`,
      icon: change > 0 ? '📈' : '📉',
      actionText: 'View Dashboard',
      actionUrl: '#dashboard'
    }),

    followUpReminder: (leadData) => ({
      type: 'reminder',
      priority: 'medium',
      title: 'Follow-up Reminder',
      message: `Time to follow up with ${leadData.company_name}`,
      icon: '🔔',
      actionText: 'Contact Lead',
      actionUrl: '#lead-generation'
    })
  };

  // Request browser notification permission on first use
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    businessNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;