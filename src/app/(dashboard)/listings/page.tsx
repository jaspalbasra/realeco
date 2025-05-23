'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  TextField, 
  InputAdornment,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  Visibility as ViewIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useListingsStore } from '@/lib/store/use-listings-store';
import { PropertyType, ListingStatus } from '@/types/listing';

export default function ListingsPage() {
  const theme = useTheme();
  const router = useRouter();
  const { listings, filteredListings, filters, setStatusFilter, setPropertyTypeFilter, setSearchQuery, applyFilters } = useListingsStore();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Apply filters on mount
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  // Handle filter changes
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as ListingStatus | 'All');
    applyFilters();
  };
  
  const handlePropertyTypeChange = (event: SelectChangeEvent) => {
    setPropertyTypeFilter(event.target.value as PropertyType | 'All');
    applyFilters();
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyFilters();
  };
  
  // Pagination handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Navigation handlers
  const handleAddListing = () => {
    router.push('/listings/add');
  };
  
  const handleViewListing = (id: string) => {
    router.push(`/listings/${id}`);
  };
  
  const handleEditListing = (id: string) => {
    router.push(`/listings/${id}`);
  };
  
  const handleDeleteListing = (id: string) => {
    // In a real app, you would implement confirmation and deletion logic
    console.log('Delete listing', id);
  };
  
  // List of status options
  const statusOptions: (ListingStatus | 'All')[] = ['All', 'Active', 'Pending', 'Sold', 'Off-Market', 'Coming Soon', 'Under Contract'];
  
  // List of property type options
  const propertyTypeOptions: (PropertyType | 'All')[] = ['All', 'Residential', 'Commercial', 'Land', 'Industrial', 'Mixed-Use', 'Pre-Construction'];
  
  // Get status chip color
  const getStatusColor = (status: ListingStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Pending':
      case 'Under Contract':
        return 'warning';
      case 'Sold':
        return 'primary';
      case 'Coming Soon':
        return 'info';
      case 'Off-Market':
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      {/* Header Section */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Property Listings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage all your property listings in one place
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size="large"
            onClick={handleAddListing}
          >
            Add New Listing
          </Button>
        </Grid>
      </Grid>
      
      {/* Filters and Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search listings..."
              value={filters.searchQuery}
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
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={filters.status}
                onChange={handleStatusChange}
                label="Status"
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="property-type-filter-label">Property Type</InputLabel>
              <Select
                labelId="property-type-filter-label"
                id="property-type-filter"
                value={filters.propertyType}
                onChange={handlePropertyTypeChange}
                label="Property Type"
              >
                {propertyTypeOptions.map((type) => (
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
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Listings Table */}
      <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'secondary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Property</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Listed Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredListings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((listing) => (
                  <TableRow key={listing.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: 1, 
                            overflow: 'hidden',
                            backgroundImage: `url(${listing.photos[0]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            flexShrink: 0,
                            boxShadow: 1
                          }} 
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                            {listing.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            MLS# {listing.mlsNumber}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {listing.location.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {listing.location.city}, {listing.location.state}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {listing.propertyType}
                      </Typography>
                      {listing.details.bedrooms && listing.details.bathrooms && (
                        <Typography variant="caption" color="text.secondary">
                          {listing.details.bedrooms} bd, {listing.details.bathrooms} ba
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(listing.financials.listPrice)}
                      </Typography>
                      {listing.financials.soldPrice && (
                        <Typography variant="caption" color="success.main" fontWeight={500}>
                          Sold: {formatCurrency(listing.financials.soldPrice)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={listing.status} 
                        size="small" 
                        color={getStatusColor(listing.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(listing.listedDate)}
                      </Typography>
                      {listing.soldDate && (
                        <Typography variant="caption" color="text.secondary">
                          Sold: {formatDate(listing.soldDate)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewListing(listing.id)}
                          sx={{ color: 'info.main' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditListing(listing.id)}
                          sx={{ color: 'warning.main' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteListing(listing.id)}
                          sx={{ color: 'error.main' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              
              {filteredListings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                    <HomeIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      No listings found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try changing your filters or add a new listing
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredListings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
} 