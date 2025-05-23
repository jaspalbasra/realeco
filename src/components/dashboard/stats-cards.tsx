'use client';

import { ReactNode } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Avatar,
  LinearProgress,
  Chip,
  useTheme
} from '@mui/material';
import {
  Home as HomeIcon,
  MonetizationOn as CommissionIcon,
  People as ClientsIcon,
  CalendarMonth as CalendarIcon,
  BarChart as ChartIcon,
  Loyalty as LoyaltyIcon,
  CheckCircle as CheckIcon,
  AccessTime as ClockIcon
} from '@mui/icons-material';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  secondaryValue?: string;
  percentChange?: number;
  isLoading?: boolean;
  helperText?: string;
}

// Individual Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
  secondaryValue,
  percentChange,
  isLoading = false,
  helperText
}: StatCardProps) {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: theme.shadows[1],
      }}
    >
      {isLoading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              backgroundColor: `${color}20`,
              color: color,
              mr: 2,
              width: 44,
              height: 44,
            }}
          >
            {icon}
          </Avatar>
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            {title}
          </Typography>
        </Box>
        
        <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 600 }}>
          {value}
        </Typography>
        
        {secondaryValue && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {secondaryValue}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          {percentChange !== undefined && (
            <Chip
              size="small"
              icon={percentChange >= 0 ? <CheckIcon fontSize="small" /> : <ClockIcon fontSize="small" />}
              label={`${percentChange >= 0 ? '+' : ''}${percentChange}%`}
              color={percentChange >= 0 ? 'success' : 'error'}
              sx={{
                fontWeight: 500,
                fontSize: '0.75rem',
                height: 24,
                mr: 1,
              }}
            />
          )}
          
          {helperText && (
            <Typography variant="caption" color="text.secondary">
              {helperText}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function StatsCards() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Listings"
          value={12}
          icon={<HomeIcon />}
          color="#2563eb"
          secondaryValue="3 pending offers"
          percentChange={8}
          helperText="vs last month"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Pending Commissions"
          value={formatCurrency(78500)}
          icon={<CommissionIcon />}
          color="#f59e0b"
          secondaryValue="Next payment in 5 days"
          percentChange={12}
          helperText="vs last month"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Active Clients"
          value={45}
          icon={<ClientsIcon />}
          color="#10b981"
          secondaryValue="8 new leads this month"
          percentChange={-3}
          helperText="vs last month"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Marketplace Leads"
          value={7}
          icon={<LoyaltyIcon />}
          color="#8b5cf6"
          secondaryValue="2 with active bidding"
          percentChange={20}
          helperText="vs last month"
        />
      </Grid>
    </Grid>
  );
} 