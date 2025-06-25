'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  Divider,
  TextField,
  MenuItem,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Chip,
  useTheme,
  IconButton
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  NavigateNext as NextIcon,
  ArrowUpward as UploadIcon,
  Home as HomeIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Bolt as AiIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DocumentProcessor from '@/components/listings/document-processor';
import { PropertyType, ListingStatus } from '@/types/listing';

// Form sections
const formSections = [
  { id: 'documents', label: 'Document Upload & AI Processing', required: false },
  { id: 'property', label: 'Property Details', required: true },
  { id: 'pricing', label: 'Pricing & Commission', required: true },
  { id: 'media', label: 'Photos & Media', required: false }
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
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AddListingPage() {
  const theme = useTheme();
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [formCompletion, setFormCompletion] = useState({
    documents: false,
    property: false,
    pricing: false,
    media: false
  });
  const [aiProcessed, setAiProcessed] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Residential' as PropertyType,
    status: 'Active' as ListingStatus,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Canada',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: '',
    description: '',
    features: '',
    listPrice: '',
    commission: '2.5',
  });

  // Calculate completion status for each section
  useEffect(() => {
    setFormCompletion({
      documents: aiProcessed,
      property: !!formData.title && !!formData.address && !!formData.city && !!formData.state,
      pricing: !!formData.listPrice && !!formData.commission,
      media: true // Optional in this demo
    });
  }, [formData, aiProcessed]);
  
  // Handler for form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle document processing completion - extract and fill form data
  const handleDocumentProcessed = (extractedData: Record<string, string>) => {
    // Extract property address
    if (extractedData.propertyAddress) {
      setFormData((prev) => ({
        ...prev,
        address: extractedData.propertyAddress,
      }));
    }
    
    // Extract city
    if (extractedData.city) {
      setFormData((prev) => ({
        ...prev,
        city: extractedData.city,
      }));
    }
    
    // Extract state/province
    if (extractedData.state) {
      setFormData((prev) => ({
        ...prev,
        state: extractedData.state,
      }));
    }
    
    // Extract ZIP/postal code
    if (extractedData.zipCode) {
      setFormData((prev) => ({
        ...prev,
        zipCode: extractedData.zipCode,
      }));
    }
    
    // Extract list price
    if (extractedData.listPrice) {
      const priceStr = extractedData.listPrice.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        listPrice: priceStr,
      }));
    }
    
    // Extract property type with mapping
    if (extractedData.propertyType) {
      // Map common AI responses to our dropdown values
      let mappedPropertyType = extractedData.propertyType;
      
      // Convert common variations to our standard types
      const lowerType = extractedData.propertyType.toLowerCase();
      if (lowerType.includes('condo') || lowerType.includes('apartment') || 
          lowerType.includes('house') || lowerType.includes('home') || 
          lowerType.includes('townhouse') || lowerType.includes('villa') || 
          lowerType.includes('duplex') || lowerType.includes('residential')) {
        mappedPropertyType = 'Residential';
      } else if (lowerType.includes('commercial') || lowerType.includes('office') || 
                 lowerType.includes('retail') || lowerType.includes('business')) {
        mappedPropertyType = 'Commercial';
      } else if (lowerType.includes('land') || lowerType.includes('lot') || lowerType.includes('vacant')) {
        mappedPropertyType = 'Land';
      } else if (lowerType.includes('industrial') || lowerType.includes('warehouse') || 
                 lowerType.includes('manufacturing')) {
        mappedPropertyType = 'Industrial';
      } else if (lowerType.includes('mixed') || lowerType.includes('multi')) {
        mappedPropertyType = 'Mixed-Use';
      } else if (lowerType.includes('pre-construction') || lowerType.includes('new construction') || 
                 lowerType.includes('under construction')) {
        mappedPropertyType = 'Pre-Construction';
      } else {
        // Default to Residential for most property types
        mappedPropertyType = 'Residential';
      }
      
      setFormData((prev) => ({
        ...prev,
        propertyType: mappedPropertyType as PropertyType,
      }));
    }
    
    // Extract property title
    if (extractedData.title) {
      setFormData((prev) => ({
        ...prev,
        title: extractedData.title,
      }));
    }
    
    // Extract bedrooms
    if (extractedData.bedrooms) {
      setFormData((prev) => ({
        ...prev,
        bedrooms: extractedData.bedrooms,
      }));
    }
    
    // Extract bathrooms
    if (extractedData.bathrooms) {
      setFormData((prev) => ({
        ...prev,
        bathrooms: extractedData.bathrooms,
      }));
    }
    
    // Extract square feet
    if (extractedData.squareFeet) {
      const sqftStr = extractedData.squareFeet.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        squareFeet: sqftStr,
      }));
    }
    
    // Extract lot size
    if (extractedData.lotSize) {
      setFormData((prev) => ({
        ...prev,
        lotSize: extractedData.lotSize,
      }));
    }
    
    // Extract year built
    if (extractedData.yearBuilt) {
      setFormData((prev) => ({
        ...prev,
        yearBuilt: extractedData.yearBuilt,
      }));
    }
    
    // Extract commission
    if (extractedData.commission) {
      setFormData((prev) => ({
        ...prev,
        commission: extractedData.commission,
      }));
    }
    
    // Extract property description
    if (extractedData.description) {
      setFormData((prev) => ({
        ...prev,
        description: extractedData.description,
      }));
    }
    
    // Extract property features
    if (extractedData.features) {
      setFormData((prev) => ({
        ...prev,
        features: extractedData.features,
      }));
    }
    
    // Mark AI processing as complete
    setAiProcessed(true);
    
    // REMOVED: Automatic navigation to property details tab
    // User can now manually navigate when ready
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Calculate overall form completion percentage
  const getCompletionPercentage = () => {
    const requiredSections = formSections.filter(section => section.required);
    const completedSections = requiredSections.filter(section => 
      formCompletion[section.id as keyof typeof formCompletion]
    );
    
    return Math.round((completedSections.length / requiredSections.length) * 100);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const errors = [];
    if (!formData.title) errors.push('Property title is required');
    if (!formData.address) errors.push('Property address is required');
    if (!formData.city) errors.push('City is required');
    if (!formData.state) errors.push('State is required');
    if (!formData.listPrice) errors.push('List price is required');
    
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Clear any errors
    setFormErrors([]);
    
    // In a real app, we would submit the form data to the server
    console.log('Form submitted with data:', formData);
    
    // Navigate to the listings page
    router.push('/listings');
  };
  
  // Property type options for the form
  const propertyTypes: PropertyType[] = ['Residential', 'Commercial', 'Land', 'Industrial', 'Mixed-Use', 'Pre-Construction'];
  
  // Status options for the form
  const statusOptions: ListingStatus[] = ['Active', 'Coming Soon', 'Off-Market'];
  
  // Canadian provinces for the dropdown
  const canadianProvinces = [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.push('/listings')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight={600}>
            Add New Listing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={getCompletionPercentage() < 100}
        >
          Save Listing
        </Button>
      </Box>
      
      {/* Form Completion Indicator */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Form Completion
          </Typography>
          <Typography 
            variant="h6" 
            fontWeight={600}
            color={
              getCompletionPercentage() === 100 
                ? 'success.main' 
                : getCompletionPercentage() >= 50 
                  ? 'warning.main' 
                  : 'error.main'
            }
          >
            {getCompletionPercentage()}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={getCompletionPercentage()} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            mb: 2,
            bgcolor: 'background.paper',
            '& .MuiLinearProgress-bar': {
              bgcolor: 
                getCompletionPercentage() === 100 
                  ? 'success.main' 
                  : getCompletionPercentage() >= 50 
                    ? 'warning.main' 
                    : 'error.main'
            }
          }}
        />
        
        <Grid container spacing={2}>
          {formSections.map((section) => (
            <Grid item xs={6} sm={3} key={section.id}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setTabValue(formSections.findIndex(s => s.id === section.id))}
              >
                {formCompletion[section.id as keyof typeof formCompletion] ? (
                  <CheckIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                ) : (
                  <ErrorIcon fontSize="small" color={section.required ? "error" : "disabled"} sx={{ mr: 1 }} />
                )}
                <Typography 
                  variant="body2" 
                  fontWeight={500}
                  color={formCompletion[section.id as keyof typeof formCompletion] 
                    ? 'text.primary' 
                    : section.required ? 'error.main' : 'text.secondary'}
                >
                  {section.label}
                  {section.required && (
                    <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                  )}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Form Errors */}
      {formErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Please correct the following errors:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {formErrors.map((error, index) => (
              <li key={index}>
                <Typography variant="body2">{error}</Typography>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {/* AI Processed Indicator */}
      {aiProcessed && (
        <Alert
          severity="success"
          icon={<AiIcon />}
          sx={{ mb: 3 }}
        >
          AI has populated {Object.keys(formData).filter(key => !!formData[key as keyof typeof formData]).length} fields from your document. Please review and complete any remaining fields.
        </Alert>
      )}
      
      {/* Form Tabs */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="form tabs">
            {formSections.map((section, index) => (
              <Tab 
                key={section.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {section.label}
                    {formCompletion[section.id as keyof typeof formCompletion] && (
                      <CheckIcon fontSize="small" color="success" sx={{ ml: 1 }} />
                    )}
                  </Box>
                }
                id={`form-tab-${index}`}
                aria-controls={`form-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {/* Document Upload Tab */}
        <TabPanel value={tabValue} index={0}>
          <DocumentProcessor onComplete={handleDocumentProcessed} />
        </TabPanel>

        {/* Property Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <form>
            {aiProcessed && (
              <Alert 
                severity="success" 
                icon={<AiIcon />} 
                sx={{ mb: 3 }}
                action={
                  <Button size="small" color="inherit" onClick={() => setTabValue(0)}>
                    View Document
                  </Button>
                }
              >
                AI has extracted data from your document and pre-filled {Object.keys(formData).filter(key => !!formData[key as keyof typeof formData]).length} fields. Look for the <Chip label="AI" size="small" color="primary" icon={<AiIcon fontSize="small" />} /> indicator.
              </Alert>
            )}
            
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Basic Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Property Title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  helperText="Enter a descriptive title for the property"
                  required
                  InputProps={{
                    endAdornment: (aiProcessed && formData.title) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Property Type"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (aiProcessed && formData.propertyType) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 4 }}>
              Property Location
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (aiProcessed && formData.address) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (aiProcessed && formData.city) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="State"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (aiProcessed && formData.state) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                >
                  {canadianProvinces.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.zipCode || ""}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (aiProcessed && formData.zipCode) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 4 }}>
              Property Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (aiProcessed && formData.bedrooms) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (aiProcessed && formData.bathrooms) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Square Feet"
                  name="squareFeet"
                  type="number"
                  value={formData.squareFeet || ""}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (aiProcessed && formData.squareFeet) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Lot Size"
                  name="lotSize"
                  value={formData.lotSize || ""}
                  onChange={handleChange}
                  placeholder="e.g., 0.25 acres"
                  InputProps={{
                    endAdornment: (aiProcessed && formData.lotSize) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year Built"
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt || ""}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (aiProcessed && formData.yearBuilt) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ position: 'relative', mb: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Property Description"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    helperText="Enter a detailed description of the property"
                    placeholder="Enter property description here or use the AI suggestion buttons below"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px 4px 0 0' } }}
                  />
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'background.paper', 
                    borderRadius: '0 0 4px 4px', 
                    border: '1px solid',
                    borderTop: 0,
                    borderColor: 'divider' 
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      AI Description Suggestions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<AiIcon />}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          description: "Beautiful 4-bedroom, 3-bathroom residential home in a prime Mississauga location. This well-maintained property features 2,500 square feet of living space on a generous 0.25-acre lot. Built in 1998, the home offers a perfect blend of modern amenities and classic charm. The spacious interior boasts an open floor plan with a gourmet kitchen, formal dining room, and comfortable living areas. Enjoy outdoor entertaining on the landscaped patio overlooking the fenced backyard. Conveniently located near schools, shopping, and major transportation routes in the Greater Toronto Area."
                        }))}
                        sx={{ borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                      >
                        Comprehensive
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<AiIcon />}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          description: "Stunning 4BR/3BA family home in desirable Mississauga neighborhood. Features 2,500 sq ft of beautifully designed living space on a quarter-acre lot. Built 1998. Open concept kitchen with granite countertops, stainless steel appliances. Primary suite with walk-in closet and en-suite bath. Perfect for entertaining with large deck and professionally landscaped yard. Great location near top schools and easy access to Highway 401."
                        }))}
                        sx={{ borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                      >
                        Concise
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined"
                        startIcon={<AiIcon />}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          description: "LUXURY 4BR/3BA RESIDENCE IN EXCLUSIVE MISSISSAUGA! This magnificent 2,500 sq ft architectural gem sits on a prime 0.25-acre lot in one of the GTA's most sought-after neighborhoods. Chef's dream kitchen with high-end finishes, spectacular primary suite, designer touches throughout. Indoor-outdoor Ontario living at its finest! A MUST-SEE for the discerning buyer!"
                        }))}
                        sx={{ borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                      >
                        Marketing
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Pricing & Commission Tab */}
        <TabPanel value={tabValue} index={2}>
          <form>
            {aiProcessed && (
              <Alert 
                severity="success" 
                icon={<AiIcon />} 
                sx={{ mb: 3 }}
                action={
                  <Button size="small" color="inherit" onClick={() => setTabValue(0)}>
                    View Document
                  </Button>
                }
              >
                AI has extracted pricing information from your document. You can adjust the values as needed.
              </Alert>
            )}
            
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Pricing Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="List Price"
                  name="listPrice"
                  type="number"
                  value={formData.listPrice || ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    endAdornment: (aiProcessed && formData.listPrice) ? (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />} 
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    ) : null
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Commission Percentage"
                  name="commission"
                  type="number"
                  value={formData.commission || ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                        {(aiProcessed && formData.commission) && (
                          <Chip 
                            label="AI" 
                            color="primary" 
                            size="small"
                            icon={<AiIcon fontSize="small" />}
                            sx={{ ml: 1, bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                          />
                        )}
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  mt: 2,
                  p: 2, 
                  bgcolor: 'primary.lightest', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'primary.light'
                }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <AiIcon color="primary" fontSize="small" />
                      Commission Calculation
                    </Box>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Commission Amount:</Typography>
                        <Typography variant="body2" fontWeight={500}>${formData.listPrice && formData.commission 
                          ? (parseFloat(formData.listPrice || "0") * (parseFloat(formData.commission || "0") / 100)).toLocaleString() 
                          : (1250000 * 0.025).toLocaleString()}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Closing Date:</Typography>
                        <Typography variant="body2" fontWeight={500}>August 15, 2025</Typography>
                      </Box>
                    </Grid>
                    {formData.propertyType === 'Pre-Construction' && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
                          Pre-construction commissions will be scheduled in installments. Configure in the Commissions tab.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Additional Pricing Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price Per Square Foot"
                  value={(formData.listPrice && formData.squareFeet) 
                    ? `$${(parseFloat(formData.listPrice || "0") / parseFloat(formData.squareFeet || "1")).toFixed(2)}` 
                    : "$500.00"}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />}
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Monthly Payment"
                  value="$5,840"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip 
                          label="AI" 
                          color="primary" 
                          size="small"
                          icon={<AiIcon fontSize="small" />}
                          sx={{ bgcolor: 'primary.lightest', color: 'primary.main', fontWeight: 500 }}
                        />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <AiIcon color="primary" />
                  <Typography variant="body2">
                    Our AI suggests the optimal listing price for this property is <strong>$1,275,000</strong> based on comparable sales in the area. 
                    This is 2% higher than your current list price.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<AiIcon />}
                    onClick={() => setFormData(prev => ({...prev, listPrice: "1275000"}))}
                    sx={{ borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Apply Suggestion
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Photos & Media Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert 
                severity="info" 
                icon={<AiIcon />}
                sx={{ mb: 3 }}
                action={
                  <Button size="small" color="info">
                    Learn More
                  </Button>
                }
              >
                Our AI will automatically enhance your photos, create virtual staging, and suggest the optimal order for maximum impact.
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  mb: 3 
                }}
              >
                <UploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop Photos Here
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or click to browse files
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Browse Files
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Photo Enhancements
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AiIcon />}
                    sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Virtual Staging
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AiIcon />}
                    sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Remove Objects
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AiIcon />}
                    sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Day to Dusk
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AiIcon />}
                    sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Enhance Lighting
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AiIcon />}
                    sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Fix Lens Distortion
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AiIcon />}
                    sx={{ py: 1.5, justifyContent: 'flex-start', borderColor: 'primary.light', color: 'primary.main', bgcolor: 'primary.lightest' }}
                  >
                    Optimize for Web
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Form Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.push('/listings')}
          >
            Cancel
          </Button>
          
          <Box>
            <Button
              variant="outlined"
              onClick={() => setTabValue(prev => Math.max(0, prev - 1))}
              disabled={tabValue === 0}
              sx={{ mr: 1 }}
            >
              Previous Section
            </Button>
            
            {tabValue < formSections.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<NextIcon />}
                onClick={() => setTabValue(prev => Math.min(formSections.length - 1, prev + 1))}
              >
                Next Section
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSubmit}
                disabled={getCompletionPercentage() < 100}
              >
                Save Listing
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
} 