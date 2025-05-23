'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tooltip,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  Description as DocumentIcon,
  FileUpload as UploadIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Bolt as AiIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  AssignmentTurnedIn as ChecklistIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Sample listings with document checklists
const listings = [
  {
    id: 'L-1001',
    address: '123 Main Street, San Francisco, CA 94123',
    type: 'Residential',
    status: 'Active',
    client: 'John Smith',
    documents: [
      { id: 'DOC-1001', name: 'Listing Agreement', status: 'Complete', uploadDate: '2025-03-15', required: true },
      { id: 'DOC-1002', name: 'Property Disclosure', status: 'Complete', uploadDate: '2025-03-15', required: true },
      { id: 'DOC-1003', name: 'Lead Paint Disclosure', status: 'Complete', uploadDate: '2025-03-16', required: true },
      { id: 'DOC-1004', name: 'Floor Plan', status: 'Complete', uploadDate: '2025-03-16', required: false },
      { id: 'DOC-1005', name: 'Home Inspection Report', status: 'Pending', uploadDate: '', required: true },
      { id: 'DOC-1006', name: 'Title Report', status: 'Complete', uploadDate: '2025-03-18', required: true },
    ]
  },
  {
    id: 'L-1002',
    address: '456 Oak Avenue, Oakland, CA 94611',
    type: 'Commercial',
    status: 'Active',
    client: 'Acme Corporation',
    documents: [
      { id: 'DOC-2001', name: 'Listing Agreement', status: 'Complete', uploadDate: '2025-03-10', required: true },
      { id: 'DOC-2002', name: 'Property Disclosure', status: 'Complete', uploadDate: '2025-03-10', required: true },
      { id: 'DOC-2003', name: 'Environmental Assessment', status: 'Pending', uploadDate: '', required: true },
      { id: 'DOC-2004', name: 'Zoning Report', status: 'Complete', uploadDate: '2025-03-12', required: true },
      { id: 'DOC-2005', name: 'Building Inspection', status: 'Pending', uploadDate: '', required: true },
      { id: 'DOC-2006', name: 'Lease Agreements', status: 'Complete', uploadDate: '2025-03-14', required: true },
      { id: 'DOC-2007', name: 'Property Survey', status: 'Pending', uploadDate: '', required: false },
    ]
  },
  {
    id: 'L-1003',
    address: '789 Pine Boulevard, San Jose, CA 95112',
    type: 'Residential',
    status: 'Pending',
    client: 'Maria Garcia',
    documents: [
      { id: 'DOC-3001', name: 'Listing Agreement', status: 'Complete', uploadDate: '2025-03-05', required: true },
      { id: 'DOC-3002', name: 'Property Disclosure', status: 'Complete', uploadDate: '2025-03-05', required: true },
      { id: 'DOC-3003', name: 'Lead Paint Disclosure', status: 'Complete', uploadDate: '2025-03-06', required: true },
      { id: 'DOC-3004', name: 'Home Inspection Report', status: 'Complete', uploadDate: '2025-03-08', required: true },
      { id: 'DOC-3005', name: 'Title Report', status: 'Complete', uploadDate: '2025-03-09', required: true },
      { id: 'DOC-3006', name: 'Purchase Agreement', status: 'Complete', uploadDate: '2025-03-12', required: true },
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
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const getTagColor = (tag: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (tag) {
    case 'Listing':
      return 'primary';
    case 'Purchase':
      return 'secondary';
    case 'Inspection':
      return 'warning';
    case 'Title':
      return 'info';
    case 'Legal':
      return 'error';
    default:
      return 'default';
  }
};

export default function DocumentsPage() {
  const theme = useTheme();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<(typeof listings)[0] | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenUploadDialog = (listing: (typeof listings)[0]) => {
    setSelectedListing(listing);
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Calculate document completion percentage
  const getCompletionPercentage = (documents: any[]) => {
    const requiredDocs = documents.filter(doc => doc.required);
    const completeDocs = requiredDocs.filter(doc => doc.status === 'Complete');
    return Math.round((completeDocs.length / requiredDocs.length) * 100);
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600}>
          Document Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/listings/add')}
        >
          Add New Listing
        </Button>
      </Box>

      {/* AI Feature Alert */}
      <Alert 
        severity="info" 
        icon={<AiIcon />}
        sx={{ mb: 3 }}
        action={
          <Button color="info" size="small">
            Learn More
          </Button>
        }
      >
        Our AI can automatically verify document completeness and extract key information for faster processing.
      </Alert>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="document tabs">
            <Tab label="All Listings" id="document-tab-0" aria-controls="document-tabpanel-0" />
            <Tab label="Incomplete" id="document-tab-1" aria-controls="document-tabpanel-1" />
            <Tab label="Complete" id="document-tab-2" aria-controls="document-tabpanel-2" />
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
        </Box>

        {/* All Listings Tab Panel */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            {listings.map((listing) => {
              const completionPercentage = getCompletionPercentage(listing.documents);
              return (
                <Card key={listing.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {listing.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {listing.id} • {listing.client}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Chip 
                            key={listing.type}
                            label={listing.type}
                            size="small"
                            color={getTagColor(listing.type)}
                            sx={{ mr: 0.5, mt: 0.5 }}
                          />
                          <Chip 
                            key={listing.status}
                            label={listing.status}
                            color={listing.status === 'Active' ? 'success' : 'warning'}
                            size="small" 
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" fontWeight={500} mr={1}>
                            Document Completion:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            color={
                              completionPercentage === 100 
                                ? 'success.main' 
                                : completionPercentage >= 50 
                                  ? 'warning.main' 
                                  : 'error.main'
                            }
                          >
                            {completionPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={completionPercentage} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4, 
                            width: 200,
                            mb: 2,
                            bgcolor: 'background.paper',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: 
                                completionPercentage === 100 
                                  ? 'success.main' 
                                  : completionPercentage >= 50 
                                    ? 'warning.main' 
                                    : 'error.main'
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<UploadIcon />}
                          onClick={() => handleOpenUploadDialog(listing)}
                          sx={{ mt: 1 }}
                        >
                          Upload Documents
                        </Button>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Document Checklist
                    </Typography>
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Document</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Uploaded On</TableCell>
                            <TableCell>Required</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listing.documents.map((document) => (
                            <TableRow key={document.id} hover>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <DocumentIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
                                  <Typography variant="body2">
                                    {document.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={document.status} 
                                  color={document.status === 'Complete' ? 'success' : 'warning'}
                                  size="small"
                                  icon={document.status === 'Complete' ? <CheckIcon fontSize="small" /> : <WarningIcon fontSize="small" />}
                                />
                              </TableCell>
                              <TableCell>{formatDate(document.uploadDate)}</TableCell>
                              <TableCell>
                                {document.required ? (
                                  <Chip label="Required" size="small" color="primary" />
                                ) : (
                                  <Chip label="Optional" size="small" variant="outlined" />
                                )}
                              </TableCell>
                              <TableCell align="right">
                                <Tooltip title="View Document">
                                  <IconButton size="small" sx={{ mr: 1 }}>
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {document.status === 'Complete' && (
                                  <Tooltip title="Download">
                                    <IconButton size="small">
                                      <DownloadIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </TabPanel>

        {/* Incomplete Tab Panel */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            {listings
              .filter(listing => getCompletionPercentage(listing.documents) < 100)
              .map((listing) => {
                const completionPercentage = getCompletionPercentage(listing.documents);
                return (
                  <Card key={listing.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {listing.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {listing.id} • {listing.client}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Chip 
                              label={listing.type} 
                              size="small" 
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={listing.status} 
                              color={listing.status === 'Active' ? 'success' : 'warning'}
                              size="small" 
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" fontWeight={500} mr={1}>
                              Document Completion:
                            </Typography>
                            <Typography 
                              variant="body2" 
                              fontWeight={600}
                              color={completionPercentage >= 50 ? 'warning.main' : 'error.main'}
                            >
                              {completionPercentage}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={completionPercentage} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 4, 
                              width: 200,
                              mb: 2,
                              bgcolor: 'background.paper',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: completionPercentage >= 50 ? 'warning.main' : 'error.main'
                              }
                            }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<UploadIcon />}
                            onClick={() => handleOpenUploadDialog(listing)}
                            sx={{ mt: 1 }}
                          >
                            Upload Missing Documents
                          </Button>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Missing Required Documents
                      </Typography>
                      
                      <List dense>
                        {listing.documents
                          .filter(doc => doc.required && doc.status !== 'Complete')
                          .map((document) => (
                            <ListItem key={document.id}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <WarningIcon fontSize="small" color="warning" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={document.name} 
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                              />
                              <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<UploadIcon />}
                                onClick={() => handleOpenUploadDialog(listing)}
                              >
                                Upload
                              </Button>
                            </ListItem>
                          ))}
                      </List>
                    </CardContent>
                  </Card>
                );
              })}
          </Box>
        </TabPanel>

        {/* Complete Tab Panel */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            {listings
              .filter(listing => getCompletionPercentage(listing.documents) === 100)
              .map((listing) => (
                <Card key={listing.id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {listing.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {listing.id} • {listing.client}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Chip 
                            label={listing.type} 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={listing.status} 
                            color={listing.status === 'Active' ? 'success' : 'warning'}
                            size="small" 
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CheckIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            All required documents submitted
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<ChecklistIcon />}
                      onClick={() => {}}
                      sx={{ mr: 1 }}
                    >
                      Generate Report
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<DownloadIcon />}
                      onClick={() => {}}
                    >
                      Download All
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </TabPanel>
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Upload Documents for {selectedListing?.address}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 1 }}>
            <Alert
              severity="info"
              icon={<AiIcon />}
              sx={{ mb: 3 }}
            >
              Drag and drop multiple documents at once. Our AI will automatically detect, categorize and process them.
            </Alert>
            
            <Box 
              sx={{ 
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                bgcolor: 'background.paper',
                mb: 3
              }}
            >
              <UploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Drag & Drop Documents Here
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                or click to browse files
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }}>
                Browse Files
              </Button>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Required Documents
            </Typography>
            
            <List dense>
              {selectedListing?.documents
                .filter(doc => doc.required && doc.status !== 'Complete')
                .map((document) => (
                  <ListItem key={document.id}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <WarningIcon fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={document.name} 
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            startIcon={<AiIcon />}
            onClick={handleCloseUploadDialog}
          >
            Upload & Process
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 