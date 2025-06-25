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
import { openAIDocumentProcessor, ExtractedPropertyData } from '@/lib/services/openai-document-processor';

interface DocumentProcessorProps {
  onComplete?: (extractedData: Record<string, string>) => void;
}

export default function DocumentProcessor({ onComplete }: DocumentProcessorProps) {
  const theme = useTheme();
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedPropertyData>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [processingDocument, setProcessingDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    try {
      // Reset state
      setError(null);
      setIsProcessing(true);
      setProcessingComplete(false);
      setProcessingProgress(0);
      setExtractedData({});
      
      // Create document object
      const documentData = {
        name: file.name,
        type: getDocumentType(file.name),
        size: file.size,
        url: URL.createObjectURL(file),
      };
      
      setProcessingDocument(documentData);
      
      // Process document with OpenAI
      const extracted = await openAIDocumentProcessor.processDocument(file, (progress) => {
        setProcessingProgress(progress);
      });
      
      // Set extracted data
      setExtractedData(extracted);
      setProcessingComplete(true);
      setShowSideBySide(true);
      
      // Convert to Record<string, string> for callback
      const dataForCallback: Record<string, string> = {};
      Object.entries(extracted).forEach(([key, value]) => {
        if (value) {
          dataForCallback[key] = value;
        }
      });
      
      // Call completion callback immediately when processing completes
      if (onComplete) {
        onComplete(dataForCallback);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
      setIsProcessing(false);
      setProcessingComplete(false);
    }
  }, [onComplete]);
  
  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    disabled: isProcessing,
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
  
  // Render clean extracted data results
  const renderExtractedDataResults = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AiIcon color="primary" />
          AI Extracted Data
        </Typography>
        
        <Card variant="outlined" sx={{ mt: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.lightest' }}>
                    <TableCell width="35%">
                      <Typography variant="subtitle2" fontWeight={600}>Field</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={600}>Extracted Value</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(extractedData).map(([key, value]) => (
                    <TableRow key={key} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="text.secondary">
                          {key.replace(/([A-Z])/g, ' $1')
                             .replace(/^./, str => str.toUpperCase())
                             .replace(/([a-z])([A-Z])/g, '$1 $2')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {value}
                          </Typography>
                          <Chip 
                            label="AI" 
                            color="primary" 
                            size="small"
                            icon={<AiIcon fontSize="small" />}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem',
                              bgcolor: 'primary.lightest', 
                              color: 'primary.main', 
                              fontWeight: 500 
                            }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
        
        <Alert 
          severity="success" 
          sx={{ mt: 3 }}
          icon={<AiIcon />}
          action={
            <Button 
              size="small" 
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                resetDocumentState();
              }}
            >
              Process Another
            </Button>
          }
        >
          AI has extracted {Object.keys(extractedData).length} fields from your document. Click "Next Section" to continue with the populated form.
        </Alert>
      </Box>
    );
  };
  
  // Reset all processing state
  const resetDocumentState = () => {
    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingComplete(false);
    setProcessingDocument(null);
    setExtractedData({});
    setError(null);
    setShowSideBySide(false);
  };
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        AI Document Processing
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload property documents and let our AI extract key information automatically.
      </Typography>
      
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Show extracted data results if processing is complete */}
      {processingComplete && showSideBySide ? (
        renderExtractedDataResults()
      ) : (
        <>
          {/* Dropzone - only show when not processing complete */}
          <Paper
            ref={dropzoneRef}
            {...getRootProps()}
            sx={{
              border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: isProcessing ? 'default' : 'pointer',
              backgroundColor: isDragActive ? `${theme.palette.primary.lightest}` : 'transparent',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
              mb: 3
            }}
          >
            <input {...getInputProps()} />
            
            {isProcessing ? (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom fontWeight={500}>
                    Processing Document
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {processingProgress < 30 ? 'Analyzing document structure...' : 
                     processingProgress < 60 ? 'Extracting property information...' : 
                     processingProgress < 85 ? 'Validating extracted data...' : 
                     processingProgress < 95 ? 'Enhancing with web search...' :
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
          
          {/* Info alert - only show when not processing */}
          {!isProcessing && (
            <Alert 
              severity="info" 
              icon={<AiIcon />}
              sx={{ mt: 1 }}
            >
              Our AI can extract property details from various documents including listing agreements, purchase agreements, and property disclosures.
            </Alert>
          )}
        </>
      )}
    </Box>
  );
} 