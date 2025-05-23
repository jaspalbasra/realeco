import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/types/user';

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'commission'
  | 'listing'
  | 'client'
  | 'marketplace'
  | 'document'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  timestamp: string;
  sender?: string;
  metadata?: Record<string, any>;
}

interface NotificationState {
  // Notification list
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Notification panel state
  isPanelOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    // Default notifications for the demo
    {
      id: '1',
      type: 'commission',
      title: 'Commission Payment Due',
      message: 'Commission payment for 123 Main Street is due in 3 days',
      read: false,
      actionUrl: '/commissions/1',
      actionLabel: 'View Details',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      metadata: {
        amount: 5000,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        propertyId: '123'
      }
    },
    {
      id: '2',
      type: 'listing',
      title: 'New Listing Pending Approval',
      message: '456 Oak Avenue listing has been submitted for review',
      read: true,
      actionUrl: '/listings/2',
      actionLabel: 'Review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: '3',
      type: 'marketplace',
      title: 'New Bid Received',
      message: 'You have received a new bid for your mortgage lead',
      read: false,
      actionUrl: '/marketplace/leads/3',
      actionLabel: 'View Bid',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      metadata: {
        amount: 15000,
        providerName: 'First Capital Mortgage'
      }
    },
    {
      id: '4',
      type: 'document',
      title: 'Document Processed by AI',
      message: 'The listing agreement for 789 Pine Street has been processed',
      read: false,
      actionUrl: '/listings/4/documents',
      actionLabel: 'View Extracted Data',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    }
  ],
  
  unreadCount: 3, // Initial count based on default notifications
  
  addNotification: (notification) => set((state) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      read: false,
      timestamp: new Date().toISOString()
    };
    
    return {
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    };
  }),
  
  markAsRead: (id) => set((state) => {
    const updatedNotifications = state.notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    const decrementUnread = state.notifications.find(n => n.id === id && !n.read) ? 1 : 0;
    
    return {
      notifications: updatedNotifications,
      unreadCount: Math.max(0, state.unreadCount - decrementUnread)
    };
  }),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(notification => ({ ...notification, read: true })),
    unreadCount: 0
  })),
  
  removeNotification: (id) => set((state) => {
    const notification = state.notifications.find(n => n.id === id);
    const decrementUnread = notification && !notification.read ? 1 : 0;
    
    return {
      notifications: state.notifications.filter(notification => notification.id !== id),
      unreadCount: Math.max(0, state.unreadCount - decrementUnread)
    };
  }),
  
  clearAllNotifications: () => set({
    notifications: [],
    unreadCount: 0
  }),
  
  isPanelOpen: false,
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  closePanel: () => set({ isPanelOpen: false })
})); 