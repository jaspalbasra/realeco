'use client';

import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page after a brief delay
    const redirectTimer = setTimeout(() => {
      router.push('/login');
    }, 500);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" mt={2}>
        Redirecting to login...
      </Typography>
    </Box>
  );
}
