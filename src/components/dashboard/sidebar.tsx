'use client';

import { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Typography,
  Divider,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  List as ListIcon,
  Add as AddIcon,
  Assignment as DocumentIcon,
  Sync as TradesIcon,
  LocalAtm as TrustIcon,
  AttachMoney as CommissionIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import { useViewStore, ViewMode } from '@/lib/store/use-view-store';

interface SidebarProps {
  pathname: string;
}

// Define navigation items
interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
  viewModes?: ViewMode[];
}

export default function Sidebar({ pathname }: SidebarProps) {
  const { viewMode } = useViewStore();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    listings: true,
  });

  const handleToggleSubMenu = (key: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Listings',
      path: '/listings',
      icon: <HomeIcon />,
      children: [
        {
          title: 'All Listings',
          path: '/listings',
          icon: <ListIcon />,
        },
        {
          title: 'Documents',
          path: '/listings/documents',
          icon: <DocumentIcon />,
        }
      ]
    },
    {
      title: 'Trades',
      path: '/trades',
      icon: <TradesIcon />,
      children: [
        {
          title: 'All Trades',
          path: '/trades',
          icon: <ListIcon />,
        },
        {
          title: 'Add Trade',
          path: '/trades/add',
          icon: <AddIcon />,
        }
      ]
    },
    {
      title: 'People',
      path: '/people',
      icon: <PeopleIcon />,
      children: [
        {
          title: 'Clients',
          path: '/people/clients',
          icon: <TrustIcon />,
        },
        {
          title: 'Add Person',
          path: '/people/add',
          icon: <AddIcon />,
        }
      ]
    },
    {
      title: 'Trust',
      path: '/trust',
      icon: <TrustIcon />,
    },
    {
      title: 'Commissions',
      path: '/commissions',
      icon: <CommissionIcon />,
      children: [
        {
          title: 'Scheduled',
          path: '/commissions/scheduled',
          icon: <ListIcon />,
        },
        {
          title: 'Pre-Construction',
          path: '/commissions/pre-construction',
          icon: <TrustIcon />,
        }
      ]
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <TrustIcon />,
      viewModes: ['TeamLead', 'Admin'],
    },
  ];

  // Filter navigation items based on view mode
  const filteredNavItems = navItems.filter(item => 
    !item.viewModes || item.viewModes.includes(viewMode)
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ position: 'relative', height: 50, width: 180 }}>
          <Image
            src="/logos/company-logo.svg"
            alt="Dwello"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
      </Box>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      {/* View Mode Indicator */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'primary.light', 
            bgcolor: 'rgba(59, 130, 246, 0.1)', 
            py: 0.5, 
            px: 1.5, 
            borderRadius: 4,
            fontWeight: 'medium'
          }}
        >
          {viewMode} View
        </Typography>
      </Box>
      
      {/* Navigation */}
      <List component="nav" sx={{ flexGrow: 1, px: 2 }}>
        {filteredNavItems.map((item) => {
          // Determine if this item or its children are active
          const isItemActive = pathname === item.path;
          const isChildActive = item.children?.some(child => pathname === child.path) || false;
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openSubMenus[item.title.toLowerCase()];
          
          return (
            <Box key={item.title}>
              {hasChildren ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleToggleSubMenu(item.title.toLowerCase())}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor: isChildActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: isChildActive ? 'primary.light' : 'white', minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: isChildActive ? 'primary.light' : 'white',
                            fontWeight: isChildActive ? 500 : 400,
                          }
                        }} 
                      />
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {item.children?.map((child) => {
                        const isActive = pathname === child.path;
                        return (
                          <Link href={child.path} passHref key={child.title} style={{ textDecoration: 'none' }}>
                            <ListItem disablePadding>
                              <ListItemButton
                                sx={{
                                  borderRadius: 2,
                                  mb: 0.5,
                                  bgcolor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ color: isActive ? 'primary.light' : 'white', minWidth: 40 }}>
                                  {child.icon}
                                </ListItemIcon>
                                <ListItemText 
                                  primary={child.title} 
                                  sx={{ 
                                    '& .MuiListItemText-primary': { 
                                      color: isActive ? 'primary.light' : 'white',
                                      fontWeight: isActive ? 500 : 400,
                                    }
                                  }} 
                                />
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        );
                      })}
                    </List>
                  </Collapse>
                </>
              ) : (
                <Link href={item.path} passHref style={{ textDecoration: 'none' }}>
                  <ListItem disablePadding>
                    <ListItemButton
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        bgcolor: isItemActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ color: isItemActive ? 'primary.light' : 'white', minWidth: 40 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.title} 
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            color: isItemActive ? 'primary.light' : 'white',
                            fontWeight: isItemActive ? 500 : 400,
                          }
                        }} 
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              )}
            </Box>
          );
        })}
      </List>
      
      {/* App Version */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );
} 