'use client';

import { useState, MouseEvent } from 'react';
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider, 
  IconButton, 
  Tooltip, 
  Box, 
  Typography 
} from '@mui/material';
import { 
  Settings as SettingsIcon, 
  Logout as LogoutIcon, 
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  CreditCard as PaymentsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/use-auth-store';

export default function UserDropdown() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  if (!user) return null;
  
  // Format user name for display
  const displayName = user.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : 'User';
  
  // Get user avatar URL
  const avatarUrl = user.profile?.avatar || '';
  
  // Get user email
  const email = user.profile?.email || '';
  
  // Get user role
  const role = user.role || '';
  
  return (
    <>
      <Tooltip title="Account">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{ ml: 1 }}
        >
          <Avatar 
            src={avatarUrl} 
            alt={displayName}
            sx={{ 
              width: 32, 
              height: 32,
              bgcolor: 'primary.main'
            }}
          >
            {displayName.charAt(0)}
          </Avatar>
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 220,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {email}
          </Typography>
          <Typography variant="caption" sx={{ 
            backgroundColor: 'primary.light', 
            color: 'white', 
            px: 1, 
            py: 0.25, 
            borderRadius: 1,
            fontWeight: 500
          }}>
            {role}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={() => router.push('/profile')}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        <MenuItem onClick={() => router.push('/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        
        <MenuItem onClick={() => router.push('/commissions')}>
          <ListItemIcon>
            <PaymentsIcon fontSize="small" />
          </ListItemIcon>
          Commissions
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => router.push('/help')}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          Help Center
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
} 