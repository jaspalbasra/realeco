'use client';

import { useState, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  LinearProgress, 
  Divider,
  Grid,
  Chip,
  Alert,
  Stack,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import { 
  CloudUpload as UploadIcon, 
  Description as FileIcon,
  CheckCircle as CheckIcon,
  Bolt as AiIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Document } from '@/types/listing';
import { useListingsStore } from '@/lib/store/use-listings-store';

interface DocumentProcessorProps {
  onComplete?: (extractedData: Record<string, string>) => void;
}

export default function DocumentProcessor({ onComplete }: DocumentProcessorProps) {
  const theme = useTheme();
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const { 
    processingDocument, 
    processingProgress, 
    processingComplete,
    uploadAndProcessDocument,
    resetDocumentProcessing
  } = useListingsStore();
  
  // Sample extracted data (in a real app, this would come from the AI)
  const extractedData = {
    propertyAddress: "123 Main Street, Mississauga, ON L6B 1A1",
    listPrice: "$1,250,000",
    propertyType: "Residential",
    bedrooms: "4",
    bathrooms: "3",
    squareFeet: "2,500",
    lotSize: "0.25 acres",
    yearBuilt: "1998",
    sellerName: "John & Jane Smith",
    commission: "2.5%",
    closingDate: "08/15/2025"
  };
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Create document object
    const documentData = {
      name: file.name,
      type: getDocumentType(file.name),
      size: file.size,
      url: URL.createObjectURL(file),
    };
    
    // Upload and process document
    const processedDocument = await uploadAndProcessDocument(documentData, () => {
      // Show side-by-side view after processing
      setShowSideBySide(true);
      
      // Callback after processing is complete
      if (onComplete && processedDocument?.extractedData) {
        setTimeout(() => {
          onComplete(extractedData); // Using our sample data in the demo
        }, 1000); // Delay to allow user to see the extracted data
      }
    });
  }, [uploadAndProcessDocument, onComplete, extractedData]);
  
  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    disabled: !!processingDocument,
  });
  
  // Helper function to determine document type from filename
  function getDocumentType(filename: string): Document['type'] {
    filename = filename.toLowerCase();
    
    if (filename.includes('listing') || filename.includes('agreement')) {
      return 'Listing Agreement';
    } else if (filename.includes('purchase')) {
      return 'Purchase Agreement';
    } else if (filename.includes('inspection')) {
      return 'Inspection Report';
    } else if (filename.includes('appraisal')) {
      return 'Appraisal';
    } else if (filename.includes('floor') || filename.includes('plan')) {
      return 'Floor Plan';
    } else if (filename.includes('title')) {
      return 'Title Document';
    } else {
      return 'Other';
    }
  }
  
  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  
  // Render data extraction results
  const renderSideBySideComparison = () => {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Document Analysis Results
        </Typography>
        
        <Grid container spacing={3}>
          {/* Extracted Data - Now takes full width */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Extracted Data
                </Typography>
                <Box sx={{ height: 450, overflow: 'auto' }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell width="40%"><Typography variant="subtitle2">Field</Typography></TableCell>
                          <TableCell><Typography variant="subtitle2">Extracted Value</Typography></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(extractedData).map(([key, value]) => (
                          <TableRow key={key} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight={500}>
                                {key.replace(/([A-Z])/g, ' $1')
                                   .replace(/^./, str => str.toUpperCase())
                                   .replace(/([a-z])([A-Z])/g, '$1 $2')}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {value}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      if (onComplete) {
                        onComplete(extractedData);
                      }
                    }}
                  >
                    Use Extracted Data
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Alert 
          severity="info" 
          sx={{ mt: 3 }}
          icon={<AiIcon />}
        >
          All extracted data will be used to pre-fill the listing form in the next step. You can edit any incorrect values in the form.
        </Alert>
      </Box>
    );
  };
  
  // Reset all processing state
  const resetDocumentState = () => {
    resetDocumentProcessing();
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        AI Document Processing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload property documents and let our AI extract key information automatically.
      </Typography>
      
      {/* Dropzone */}
      <Paper
        ref={dropzoneRef}
        {...getRootProps()}
        sx={{
          border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: processingDocument ? 'default' : 'pointer',
          backgroundColor: isDragActive ? `${theme.palette.primary.lightest}` : 'transparent',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        
        {processingDocument ? (
          <Box>
            {processingComplete ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CheckIcon 
                      sx={{ 
                        fontSize: 48, 
                        color: 'success.main',
                        mb: 2
                      }} 
                    />
                  </motion.div>
                  <Typography variant="h6" gutterBottom>
                    Document Processed Successfully
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Our AI has extracted all the important information from your document.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<ClearIcon />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      resetDocumentState();
                      setShowSideBySide(false);
                    }}
                    sx={{ mt: 2 }}
                  >
                    Process Another Document
                  </Button>
                </Box>
              </motion.div>
            ) : (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom fontWeight={500}>
                    Processing Document
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {processingProgress < 30 ? 'Analyzing document structure...' : 
                     processingProgress < 60 ? 'Extracting property information...' : 
                     processingProgress < 90 ? 'Validating extracted data...' : 
                     'Finalizing results...'}
                  </Typography>
                </Box>
                
                <Box sx={{ position: 'relative', mt: 4, mb: 3 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={processingProgress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box
                    className="ai-processing-beam"
                    sx={{
                      position: 'absolute',
                      top: -2,
                      left: 0,
                      width: '100%',
                      height: 12,
                      borderRadius: 4,
                      opacity: 0.5,
                      pointerEvents: 'none',
                    }}
                  />
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center', 
                    gap: 1,
                    animation: 'pulse 2s infinite'
                  }}
                >
                  <AiIcon color="primary" />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  >
                    AI Processing
                  </Typography>
                </Box>
                
                {/* Document info */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 3,
                    p: 2, 
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    maxWidth: 400,
                    mx: 'auto'
                  }}
                >
                  <FileIcon color="action" />
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography variant="body2" noWrap fontWeight={500}>
                      {processingDocument?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={processingDocument?.type} 
                        size="small" 
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {processingDocument ? formatFileSize(processingDocument.size) : ''}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            <UploadIcon sx={{ fontSize: 48, color: 'action.active', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag & Drop Document
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              or click to browse files
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Supported formats: PDF, JPG, PNG
            </Typography>
          </Box>
        )}
      </Paper>
      
      {processingComplete && showSideBySide && renderSideBySideComparison()}
      
      {!processingDocument && (
        <Alert 
          severity="info" 
          icon={<AiIcon />}
          sx={{ mt: 1 }}
        >
          Our AI can extract property details from various documents including listing agreements, purchase agreements, and property disclosures.
        </Alert>
      )}
    </Box>
  );
} 