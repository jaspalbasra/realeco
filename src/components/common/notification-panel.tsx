'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  ListItemButton,
  Avatar, 
  IconButton, 
  Badge, 
  Drawer, 
  Divider, 
  Button, 
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MonetizationOn as CommissionIcon,
  Home as ListingIcon,
  Person as ClientIcon,
  Store as MarketplaceIcon,
  Description as DocumentIcon,
  Settings as SystemIcon,
  DoneAll as MarkAllReadIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { useNotificationStore, NotificationType, Notification } from '@/lib/store/use-notification-store';
import { useRouter } from 'next/navigation';

// Helper function to get icon for notification type
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'success':
      return <SuccessIcon color="success" />;
    case 'warning':
      return <WarningIcon color="warning" />;
    case 'error':
      return <ErrorIcon color="error" />;
    case 'commission':
      return <CommissionIcon color="primary" />;
    case 'listing':
      return <ListingIcon style={{ color: '#10b981' }} />;
    case 'client':
      return <ClientIcon style={{ color: '#8b5cf6' }} />;
    case 'marketplace':
      return <MarketplaceIcon style={{ color: '#f59e0b' }} />;
    case 'document':
      return <DocumentIcon style={{ color: '#06b6d4' }} />;
    case 'system':
      return <SystemIcon color="secondary" />;
    case 'info':
    default:
      return <InfoIcon color="info" />;
  }
}

// Helper function to format the time
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If it's today, show relative time
  if (date.toDateString() === now.toDateString()) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  // If it's within the last week, show day of week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date > oneWeekAgo) {
    return format(date, 'EEEE');
  }
  
  // Otherwise, show the full date
  return format(date, 'MMM d, yyyy');
}

export default function NotificationPanel() {
  const theme = useTheme();
  const router = useRouter();
  const { 
    notifications, 
    isPanelOpen, 
    closePanel, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate if there's an action URL
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
    
    // Close the panel
    closePanel();
  };
  
  return (
    <Drawer
      anchor="right"
      open={isPanelOpen}
      onClose={closePanel}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
          height: '100%',
          borderRadius: 0,
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Mark all as read">
            <IconButton onClick={markAllAsRead} size="small">
              <MarkAllReadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={closePanel} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      
      <Divider />
      
      {notifications.length === 0 ? (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <NotificationIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No notifications yet
          </Typography>
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <div key={notification.id}>
              <ListItemButton
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  py: 2,
                  backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.light, 0.05),
                  '&:hover': {
                    backgroundColor: notification.read 
                      ? alpha(theme.palette.primary.light, 0.05)
                      : alpha(theme.palette.primary.light, 0.1),
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: notification.read ? 'action.selected' : 'primary.light',
                      color: notification.read ? 'text.secondary' : 'white'
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: notification.read ? 400 : 600,
                        color: notification.read ? 'text.secondary' : 'text.primary'
                      }}
                    >
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography 
                        variant="body2" 
                        component="span" 
                        sx={{ 
                          display: 'block',
                          color: 'text.secondary',
                          mb: notification.actionLabel ? 1 : 0
                        }}
                      >
                        {notification.message}
                      </Typography>
                      {notification.actionLabel && (
                        <Button 
                          size="small" 
                          color="primary" 
                          sx={{ 
                            mt: 0.5, 
                            textTransform: 'none', 
                            fontWeight: 500,
                            p: 0,
                            minWidth: 'auto',
                            '&:hover': {
                              background: 'transparent',
                            }
                          }}
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                      <Typography 
                        variant="caption" 
                        component="div" 
                        sx={{ 
                          color: 'text.disabled',
                          mt: 0.5
                        }}
                      >
                        {formatTime(notification.timestamp)}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
              <Divider component="li" />
            </div>
          ))}
        </List>
      )}
    </Drawer>
  );
}

// Helper function to handle theme.palette.primary.light alpha
function alpha(color: string, value: number) {
  return `${color}${Math.round(value * 255).toString(16).padStart(2, '0')}`;
} 