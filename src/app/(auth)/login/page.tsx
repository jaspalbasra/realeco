'use client';

import { useState, FormEvent } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography, 
  TextField, 
  Paper, 
  Container, 
  Grid, 
  Alert, 
  AlertTitle, 
  Divider, 
  InputAdornment, 
  IconButton,
  useTheme
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  Lock as LockIcon 
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/use-auth-store';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('michael.rodriguez@realtech.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the store
      console.error('Login error', error);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Sample credentials for demo
  const demoCredentials = [
    { role: 'Agent', email: 'sophia.chen@realtech.com' },
    { role: 'Team Lead', email: 'michael.rodriguez@realtech.com' },
    { role: 'Admin', email: 'admin@realtech.com' }
  ];
  
  return (
    <Container component="main" maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={0} sx={{ overflow: 'hidden', borderRadius: 4, boxShadow: theme.shadows[10] }}>
        {/* Left side - Login Form */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
              <Box sx={{ position: 'relative', width: 200, height: 50 }}>
                <Image
                  src="/logos/company-logo.svg"
                  alt="Dwello"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Box>
            
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Welcome Back
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Log in to access your Dwello dashboard
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
                <AlertTitle>Login Failed</AlertTitle>
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider>
                  <Typography variant="body2" color="text.secondary">
                    Demo Credentials
                  </Typography>
                </Divider>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {demoCredentials.map((cred) => (
                  <Box 
                    key={cred.role} 
                    sx={{ 
                      p: 1.5, 
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                    onClick={() => setEmail(cred.email)}
                  >
                    <Typography variant="body2">
                      <strong>{cred.role}</strong>: {cred.email}
                    </Typography>
                    <Button 
                      size="small" 
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmail(cred.email);
                        setPassword('password123');
                      }}
                    >
                      Use
                    </Button>
                  </Box>
                ))}
                <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                  Password for all demo accounts: <strong>password123</strong>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        
        {/* Right side - Image */}
        <Grid 
          item 
          xs={0} 
          md={6} 
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            backgroundImage: 'url(https://source.unsplash.com/random/1200x900?luxury,property)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            alignItems: 'flex-end',
            p: 4
          }}
        >
          <Box 
            sx={{ 
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              p: 3,
              borderRadius: 2,
              width: '100%'
            }}
          >
            <Typography variant="h5" color="white" fontWeight={600} gutterBottom>
              AI-Enhanced Real Estate Management
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.8)">
              Streamline your property management with our intelligent platform featuring automated document processing, commission tracking, and marketplace features.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

// Helper function to handle theme alpha colors
function alpha(color: string, value: number) {
  return `${color}${Math.round(value * 255).toString(16).padStart(2, '0')}`;
} 