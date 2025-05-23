'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  BarChart as ChartIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  MonetizationOn as MoneyIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import StatsCards from '@/components/dashboard/stats-cards';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { mockListings } from '@/lib/data/mock-listings';
import { mockClients } from '@/lib/data/mock-clients';
import { recentPayments, upcomingMilestones } from '@/lib/data/mock-commissions';

// Mock data for performance chart
const performanceData = [
  { name: 'Jan', revenue: 42000, listings: 4 },
  { name: 'Feb', revenue: 38000, listings: 3 },
  { name: 'Mar', revenue: 54000, listings: 5 },
  { name: 'Apr', revenue: 63000, listings: 6 },
  { name: 'May', revenue: 55000, listings: 4 },
  { name: 'Jun', revenue: 78000, listings: 7 },
  { name: 'Jul', revenue: 81000, listings: 8 },
];

// Mock recent activity data
const recentActivity = [
  { 
    id: '1', 
    type: 'listing', 
    title: 'New Listing Added', 
    description: '123 Main Street, New York', 
    time: '2 hours ago',
    icon: <HomeIcon />
  },
  { 
    id: '2', 
    type: 'client', 
    title: 'New Client Signed', 
    description: 'John & Sarah Johnson', 
    time: '5 hours ago',
    icon: <PersonIcon />
  },
  { 
    id: '3', 
    type: 'commission', 
    title: 'Commission Payment Received', 
    description: '$12,500 - 456 Oak Avenue', 
    time: '1 day ago',
    icon: <MoneyIcon />
  },
  { 
    id: '4', 
    type: 'reminder', 
    title: 'Commission Payment Due', 
    description: '$8,750 - 789 Pine Street', 
    time: '2 days ago',
    icon: <TimerIcon />
  },
];

export default function DashboardPage() {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [performanceTab, setPerformanceTab] = useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setPerformanceTab(newValue);
  };
  
  // Recent listings to display
  const recentListings = mockListings
    .slice(0, 4)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Recent clients to display  
  const recentClients = mockClients
    .slice(0, 4)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome, {user?.profile.firstName}! Here's an overview of your real estate business.
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <StatsCards />
      </Box>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Performance Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ boxShadow: theme.shadows[1], borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Performance Overview
                </Typography>
                <Box>
                  <Tabs value={performanceTab} onChange={handleTabChange} aria-label="performance chart tabs">
                    <Tab label="Revenue" />
                    <Tab label="Listings" />
                  </Tabs>
                </Box>
              </Box>
              
              <Box sx={{ height: 300, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => 
                        performanceTab === 0 
                          ? `$${value / 1000}k` 
                          : value.toString()
                      } 
                    />
                    <Tooltip 
                      formatter={(value: number) => 
                        performanceTab === 0 
                          ? formatCurrency(value) 
                          : value
                      }
                    />
                    <Bar 
                      dataKey={performanceTab === 0 ? "revenue" : "listings"} 
                      fill={theme.palette.primary.main} 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ boxShadow: theme.shadows[1], borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Activity
                </Typography>
                <Button startIcon={<RefreshIcon />} size="small">
                  Refresh
                </Button>
              </Box>
              
              <List>
                {recentActivity.map((activity) => (
                  <ListItem 
                    key={activity.id}
                    alignItems="flex-start"
                    sx={{
                      px: 0,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: 
                            activity.type === 'listing' ? '#e6f7ff' : 
                            activity.type === 'client' ? '#f6ffed' :
                            activity.type === 'commission' ? '#fff7e6' : '#f9f0ff',
                          color: 
                            activity.type === 'listing' ? '#1890ff' : 
                            activity.type === 'client' ? '#52c41a' :
                            activity.type === 'commission' ? '#fa8c16' : '#722ed1',
                        }}
                      >
                        {activity.icon}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.title}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {activity.description}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {activity.time}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  endIcon={<ArrowForwardIcon />} 
                  size="small"
                  onClick={() => console.log('View all activity')}
                >
                  View All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Commissions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: theme.shadows[1], borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Upcoming Commission Payments
              </Typography>
              
              {upcomingMilestones.length > 0 ? (
                <Box>
                  {upcomingMilestones.slice(0, 4).map((milestone, index) => (
                    <Box 
                      key={milestone.id} 
                      sx={{ 
                        mb: 2, 
                        pb: 2, 
                        borderBottom: index < 3 ? `1px solid ${theme.palette.divider}` : 'none'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {milestone.name}
                        </Typography>
                        <Chip 
                          label={formatCurrency(milestone.amount)} 
                          size="small" 
                          color="primary" 
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Due: {formatDate(milestone.dueDate, 'MMM dd, yyyy')}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'warning.main',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <TimerIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                          {Math.ceil((new Date(milestone.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => console.log('View all commissions')}
                  >
                    View All Commission Schedules
                  </Button>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No upcoming commission payments
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Listings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: theme.shadows[1], borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Recent Listings
              </Typography>
              
              {recentListings.map((listing, index) => (
                <Box 
                  key={listing.id} 
                  sx={{ 
                    mb: 2, 
                    pb: 2, 
                    borderBottom: index < recentListings.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                    display: 'flex',
                    gap: 2
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: 1, 
                      overflow: 'hidden',
                      backgroundImage: `url(${listing.photos[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0
                    }} 
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} noWrap>
                      {listing.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {listing.location.address}, {listing.location.city}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(listing.financials.listPrice)}
                      </Typography>
                      <Chip 
                        label={listing.status} 
                        size="small" 
                        color={
                          listing.status === 'Active' ? 'success' :
                          listing.status === 'Pending' ? 'warning' :
                          listing.status === 'Sold' ? 'primary' : 'default'
                        }
                        sx={{ height: 20, fontSize: '0.625rem' }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
              
              <Button 
                variant="outlined" 
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => console.log('View all listings')}
              >
                View All Listings
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 