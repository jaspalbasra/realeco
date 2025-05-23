'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  InputBase,
  IconButton,
  Tooltip,
  Badge,
  ToggleButtonGroup,
  ToggleButton,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Notifications as NotificationIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { useNotificationStore } from '@/lib/store/use-notification-store';
import { useViewStore, ViewMode } from '@/lib/store/use-view-store';
import UserDropdown from '@/components/common/user-dropdown';
import NotificationPanel from '@/components/common/notification-panel';

export default function Header() {
  const theme = useTheme();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { viewMode, setViewMode } = useViewStore();
  const { unreadCount, togglePanel } = useNotificationStore();
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, implement search functionality
    console.log('Searching for:', searchQuery);
  };
  
  // View mode toggle
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null,
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };
  
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Search Bar */}
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', sm: 300, md: 400 },
          borderRadius: 20,
          mr: 2,
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          inputProps={{ 'aria-label': 'search' }}
        />
      </Paper>
      
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        {/* View Mode Toggle */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            sx={{
              '& .MuiToggleButtonGroup-grouped': {
                border: 1,
                borderColor: theme.palette.divider,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <ToggleButton value="Agent" aria-label="agent view">
              <Typography variant="caption" sx={{ fontWeight: 500 }}>Agent</Typography>
            </ToggleButton>
            <ToggleButton value="TeamLead" aria-label="team lead view">
              <Typography variant="caption" sx={{ fontWeight: 500 }}>Team Lead</Typography>
            </ToggleButton>
            <ToggleButton value="Admin" aria-label="admin view">
              <Typography variant="caption" sx={{ fontWeight: 500 }}>Admin</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={togglePanel}
            size="large"
            aria-label={`${unreadCount} new notifications`}
            color="inherit"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <NotificationPanel />
        
        {/* User Menu */}
        <UserDropdown />
      </Box>
    </Box>
  );
} 