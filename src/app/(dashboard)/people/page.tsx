'use client';

import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Bolt as AiIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function PeoplePage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600}>
          People
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/people/add')}
        >
          Add Person
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
        Our AI can automatically maintain client relationships and suggest potential matches for new listings.
      </Alert>

      {/* Placeholder Content */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          People Management Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This section will contain tools to manage client and contact information.
        </Typography>
      </Paper>
    </Box>
  );
} 