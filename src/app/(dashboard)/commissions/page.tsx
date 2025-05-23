'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Badge,
  Alert,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  NotificationsActive as NotificationIcon,
  CalendarMonth as CalendarIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Bolt as AiIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Sample commission data
const commissions = [
  {
    id: 'COM-001',
    propertyAddress: '123 Main St, Toronto, ON L4B 1G9',
    propertyType: 'Residential',
    amount: 25000,
    status: 'Pending',
    date: '2025-05-15',
    clientName: 'John Smith'
  },
  {
    id: 'COM-002',
    propertyAddress: '456 Oak Ave, Mississauga, ON L5R 3L2',
    propertyType: 'Residential',
    amount: 18500,
    status: 'Paid',
    date: '2025-04-05',
    clientName: 'Maria Garcia'
  },
  {
    id: 'COM-003',
    propertyAddress: '789 Pine Blvd, Ottawa, ON K1P 5M7',
    propertyType: 'Commercial',
    amount: 42000,
    status: 'Pending',
    date: '2025-06-20',
    clientName: 'David Chen'
  },
  {
    id: 'COM-004',
    propertyAddress: '101 Sunset Tower, Unit 2201, Hamilton, ON L8S 4L8',
    propertyType: 'Pre-Construction',
    amount: 20000,
    status: 'Installments',
    date: '2025-07-10',
    clientName: 'Emily Johnson',
    installments: [
      { amount: 5000, date: '2025-07-10', status: 'Pending', description: 'Initial Commission' },
      { amount: 10000, date: '2026-01-15', status: 'Pending', description: 'Progress Payment' },
      { amount: 5000, date: '2026-08-20', status: 'Pending', description: 'Final Closing' }
    ]
  },
  {
    id: 'COM-005',
    propertyAddress: '202 Marina Tower, Unit 1803, Markham, ON L3R 0H8',
    propertyType: 'Pre-Construction',
    amount: 30000,
    status: 'Installments',
    date: '2025-08-25',
    clientName: 'Robert Wilson',
    installments: [
      { amount: 7500, date: '2025-08-25', status: 'Pending', description: 'Initial Commission' },
      { amount: 7500, date: '2026-02-25', status: 'Pending', description: '6-Month Payment' },
      { amount: 7500, date: '2026-08-25', status: 'Pending', description: '12-Month Payment' },
      { amount: 7500, date: '2027-08-25', status: 'Pending', description: 'Final Closing' }
    ]
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`commission-tabpanel-${index}`}
      aria-labelledby={`commission-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CommissionsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Installments':
        return 'info';
      default:
        return 'default';
    }
  };

  // Calculate upcoming commissions total
  const upcomingTotal = commissions
    .filter(comm => comm.status === 'Pending')
    .reduce((total, comm) => total + comm.amount, 0);

  // Get number of upcoming installments in the next 30 days
  const getUpcomingInstallments = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    let count = 0;
    commissions.forEach(comm => {
      if (comm.installments) {
        comm.installments.forEach(installment => {
          const installmentDate = new Date(installment.date);
          if (installmentDate >= today && installmentDate <= thirtyDaysFromNow) {
            count++;
          }
        });
      }
    });
    
    return count;
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600}>
          Commissions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/commissions/add')}
        >
          Add Commission
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Upcoming Commissions
              </Typography>
              <Typography variant="h5" fontWeight={600} color="primary.main">
                {formatCurrency(upcomingTotal)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Next 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Installment Payments
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={getUpcomingInstallments()} color="primary" sx={{ mr: 1 }}>
                  <NotificationIcon color="action" />
                </Badge>
                Due Soon
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {getUpcomingInstallments()} payments in next 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Year-to-Date Received
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {formatCurrency(188500)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                15% higher than last year
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Pre-Construction Scheduled
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {formatCurrency(50000)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Over next 24 months
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Feature Highlight */}
      <Alert 
        severity="info" 
        icon={<AiIcon />}
        sx={{ mb: 3 }}
        action={
          <Button color="info" size="small">
            Enable
          </Button>
        }
      >
        Our AI can help track commission payment schedules and send automated reminders for pre-construction installments.
      </Alert>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="commission tabs">
            <Tab label="All Commissions" id="commission-tab-0" aria-controls="commission-tabpanel-0" />
            <Tab label="Scheduled" id="commission-tab-1" aria-controls="commission-tabpanel-1" />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Pre-Construction
                  <Badge badgeContent={getUpcomingInstallments()} color="primary" sx={{ ml: 1 }} />
                </Box>
              } 
              id="commission-tab-2" 
              aria-controls="commission-tabpanel-2" 
            />
            <Tab label="Paid" id="commission-tab-3" aria-controls="commission-tabpanel-3" />
          </Tabs>
        </Box>

        {/* Filter Bar */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button startIcon={<FilterIcon />} sx={{ mr: 2 }}>
              Filter
            </Button>
            <Button startIcon={<SearchIcon />}>
              Search
            </Button>
          </Box>
          <Button startIcon={<ExportIcon />}>
            Export
          </Button>
        </Box>

        {/* All Commissions Tab Panel */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commissions.map((commission) => (
                  <TableRow 
                    key={commission.id}
                    hover
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => router.push(`/commissions/${commission.id}`)}
                  >
                    <TableCell>{commission.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {commission.propertyAddress}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {commission.propertyType}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{commission.clientName}</TableCell>
                    <TableCell>{formatCurrency(commission.amount)}</TableCell>
                    <TableCell>{formatDate(commission.date)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={commission.status} 
                        color={getStatusColor(commission.status) as 'success' | 'warning' | 'info' | 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to calendar
                        }}
                      >
                        <CalendarIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Download
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Pre-Construction Tab Panel */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            {commissions.filter(c => c.propertyType === 'Pre-Construction').map((commission) => (
              <Card key={commission.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {commission.propertyAddress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {commission.id} • {commission.clientName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip 
                          label={commission.propertyType} 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Total Amount: {formatCurrency(commission.amount)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CalendarIcon />}
                        sx={{ mr: 1 }}
                      >
                        Schedule
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<NotificationIcon />}
                      >
                        Reminders
                      </Button>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Schedule
                  </Typography>
                  
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Payment</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {commission.installments?.map((installment, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{installment.description}</TableCell>
                            <TableCell>{formatCurrency(installment.amount)}</TableCell>
                            <TableCell>{formatDate(installment.date)}</TableCell>
                            <TableCell>
                              <Chip 
                                label={installment.status} 
                                color={getStatusColor(installment.status) as 'success' | 'warning' | 'info' | 'default'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small">
                                <CalendarIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>

        {/* Other Tab Panels */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Scheduled Commissions</Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Paid Commissions</Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
} 