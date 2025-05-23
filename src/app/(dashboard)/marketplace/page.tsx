'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Avatar,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  InputAdornment,
  Divider,
  Badge,
  LinearProgress,
  Paper,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Timer as TimerIcon,
  Home as HomeIcon,
  Business as BuildingIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Insights as InsightsIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Visibility as ViewIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MarketplaceLead, MarketplaceLeadType, MarketplaceLeadStatus, MarketplaceLeadRequirements, MarketplaceLeadSource } from '@/types/marketplace';
import { mockMarketplaceLeads, mockMarketplaceProviders } from '@/lib/data/mock-marketplace';

// Extended interface to maintain compatibility with existing code
interface ExtendedMarketplaceLead extends MarketplaceLead {
  type: MarketplaceLeadType;
  title: string;
  description: string;
  requirements: MarketplaceLeadRequirements;
  expiresAt: string;
  bids: any[];
  analytics: {
    views: number;
    uniqueViews: number;
    bookmarks: number;
    matchScore?: number;
  };
  agentId: string;
  updatedAt: string;
}

export default function MarketplacePage() {
  const theme = useTheme();
  const router = useRouter();
  
  // State for filtering and viewing
  const [tabValue, setTabValue] = useState(0);
  const [openProviderDialog, setOpenProviderDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ExtendedMarketplaceLead | null>(null);
  
  // Cast the mock data to our extended interface
  const leads = mockMarketplaceLeads as ExtendedMarketplaceLead[];
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [typeFilter, setTypeFilter] = useState<MarketplaceLeadType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for the bid dialog
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle filter change
  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value as MarketplaceLeadType | 'All');
    applyFilters(event.target.value as MarketplaceLeadType | 'All', searchQuery);
  };
  
  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyFilters(typeFilter, event.target.value);
  };
  
  // Apply filters
  const applyFilters = (type: MarketplaceLeadType | 'All', query: string) => {
    let filtered = leads;
    
    // Filter by type
    if (type !== 'All') {
      filtered = filtered.filter(lead => lead.type === type);
    }
    
    // Filter by search query
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.title.toLowerCase().includes(lowercasedQuery) ||
        lead.description.toLowerCase().includes(lowercasedQuery) ||
        (lead.requirements.location && lead.requirements.location.some(
          loc => loc.toLowerCase().includes(lowercasedQuery)
        ))
      );
    }
    
    setFilteredLeads(filtered);
  };
  
  // Handle bid dialog open
  const handleOpenBidDialog = (lead: typeof leads[0]) => {
    setSelectedLead(lead);
    setBidDialogOpen(true);
  };
  
  // Handle bid dialog close
  const handleCloseBidDialog = () => {
    setBidDialogOpen(false);
    setSelectedLead(null);
    setBidAmount('');
    setBidMessage('');
  };
  
  // Handle bid submission
  const handleSubmitBid = () => {
    console.log('Bid submitted:', {
      leadId: selectedLead?.id,
      amount: bidAmount,
      message: bidMessage
    });
    
    // Close the dialog
    handleCloseBidDialog();
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Your bid has been submitted successfully!');
  };
  
  // Get color for lead type chip
  const getLeadTypeColor = (type: MarketplaceLeadType) => {
    switch (type) {
      case 'Buyer':
        return 'primary';
      case 'Mortgage':
        return 'success';
      case 'Insurance':
        return 'warning';
      case 'Legal':
        return 'error';
      case 'Inspection':
        return 'info';
      case 'HomeWarranty':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
  // Get lead type options for filter
  const leadTypeOptions: (MarketplaceLeadType | 'All')[] = [
    'All', 'Buyer', 'Mortgage', 'Insurance', 'Legal', 'Inspection', 'HomeWarranty'
  ];
  
  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Marketplace
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and bid on anonymized real estate opportunities
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="large"
            onClick={() => console.log('Create new lead')}
          >
            Create New Lead
          </Button>
        </Grid>
      </Grid>
      
      {/* Tabs and Filters */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ borderRadius: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="marketplace tabs"
              sx={{ px: 2, pt: 2 }}
            >
              <Tab label="All Leads" />
              <Tab label="My Leads" />
              <Tab label="My Bids" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={5}>
                <FormControl fullWidth>
                  <InputLabel id="lead-type-filter-label">Lead Type</InputLabel>
                  <Select
                    labelId="lead-type-filter-label"
                    id="lead-type-filter"
                    value={typeFilter}
                    onChange={handleTypeFilterChange}
                    label="Lead Type"
                  >
                    {leadTypeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<FilterIcon />}
                  fullWidth
                  onClick={() => applyFilters(typeFilter, searchQuery)}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
      
      {/* Marketplace Leads Grid */}
      <Grid container spacing={3}>
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <Grid item xs={12} sm={6} md={4} key={lead.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Status bar */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0, 
                    width: '100%', 
                    height: 4, 
                    bgcolor: 
                      lead.status === 'Open' ? 'success.main' : 
                      lead.status === 'Pending' ? 'warning.main' : 
                      lead.status === 'Closed' ? 'error.main' : 
                      'grey.500'
                  }} 
                />
                
                <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      label={lead.type} 
                      size="small"
                      color={getLeadTypeColor(lead.type)}
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'text.secondary' 
                      }}
                    >
                      <TimerIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                      {formatDate(lead.expiresAt, 'MM/dd/yyyy')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {lead.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {lead.description}
                  </Typography>
                  
                  {/* Lead details */}
                  <Box sx={{ mt: 2 }}>
                    {lead.requirements.budget && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MoneyIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="body2">
                          Budget: {formatCurrency(lead.requirements.budget.min)} - {formatCurrency(lead.requirements.budget.max)}
                        </Typography>
                      </Box>
                    )}
                    
                    {lead.requirements.location && lead.requirements.location.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <LocationIcon fontSize="small" sx={{ mr: 1, mt: 0.3, color: 'info.main' }} />
                        <Typography variant="body2">
                          Location: {lead.requirements.location.join(', ')}
                        </Typography>
                      </Box>
                    )}
                    
                    {lead.requirements.timeframe && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TimerIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                        <Typography variant="body2">
                          Timeframe: {lead.requirements.timeframe}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Lead statistics */}
                  <Box 
                    sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {lead.bids.length} bids
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <InsightsIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight={500} color="primary">
                        {lead.analytics.matchScore ? 
                          `${Math.round(lead.analytics.matchScore * 100)}% match` : 
                          'No match score'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    onClick={() => handleOpenBidDialog(lead)}
                    disabled={lead.status !== 'Open'}
                  >
                    {lead.status === 'Open' ? 'Place Bid' : 'View Details'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <HomeIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No marketplace leads found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try changing your filters or create a new lead
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => console.log('Create new lead')}
              >
                Create New Lead
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Bid dialog */}
      <Dialog
        open={bidDialogOpen}
        onClose={handleCloseBidDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Place Bid on Lead</Typography>
            <IconButton onClick={handleCloseBidDialog} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedLead && (
            <>
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={selectedLead.type} 
                  size="small"
                  color={getLeadTypeColor(selectedLead.type)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6" gutterBottom>
                  {selectedLead.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedLead.description}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Lead Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Budget Range</Typography>
                  <Typography variant="body1">
                    {selectedLead.requirements.budget ? 
                      `${formatCurrency(selectedLead.requirements.budget.min)} - ${formatCurrency(selectedLead.requirements.budget.max)}` : 
                      'Not specified'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Timeframe</Typography>
                  <Typography variant="body1">
                    {selectedLead.requirements.timeframe || 'Not specified'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">
                    {selectedLead.requirements.location && selectedLead.requirements.location.length > 0 ? 
                      selectedLead.requirements.location.join(', ') : 
                      'Not specified'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Your Bid
              </Typography>
              
              <TextField
                fullWidth
                label="Bid Amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                placeholder="Describe your offer and why you're the best match for this lead..."
              />
              
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                bgcolor: 'info.main', 
                color: 'white',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <LockIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Client identity is anonymized until your bid is accepted
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseBidDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitBid} 
            variant="contained" 
            color="primary"
            disabled={!bidAmount}
          >
            Submit Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 