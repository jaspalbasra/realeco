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

export default function TradesPage() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={600}>
          Trades
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/trades/add')}
        >
          Add Trade
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
        Our AI system can intelligently track and manage trades with automated matching and processing.
      </Alert>

      {/* Placeholder Content */}
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Trades Management Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This section will contain tools to manage property trades and transactions.
        </Typography>
      </Paper>
    </Box>
  );
} 