'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/use-auth-store';

const DRAWER_WIDTH = 280;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const pathname = usePathname();
  
  const { user, isAuthenticated } = useAuthStore();

  // Set drawer state based on screen size
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Wait for authentication check
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: open ? `${DRAWER_WIDTH}px` : 0 },
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: theme.palette.text.primary }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Header />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            background: theme.palette.secondary.main,
            color: theme.palette.common.white,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', height: '100%' }}>
          <Sidebar pathname={pathname} />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: open ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          height: '100vh',
          overflow: 'auto',
          backgroundColor: theme.palette.background.default,
          pt: { xs: 8, sm: 9 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 