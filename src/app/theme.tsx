'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';

// Extend the MUI Theme to include custom properties
declare module '@mui/material/styles' {
  interface PaletteColor {
    lightest?: string;
  }
  
  interface SimplePaletteColorOptions {
    lightest?: string;
  }
}

// Define Roboto font
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

// Create a theme instance
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
      lightest: '#ebf5ff', // Very light blue for backgrounds
    },
    secondary: {
      main: '#0f172a', // Slate 900
      light: '#1e293b',
      dark: '#0f172a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981', // Green
    },
    error: {
      main: '#ef4444', // Red
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    info: {
      main: '#06b6d4', // Cyan
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          boxShadow: 'none',
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 4px 8px rgba(37, 99, 235, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
      },
    },
  },
});

// Create dark theme
const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Blue 500
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
      lightest: '#172554', // Dark blue for backgrounds in dark mode
    },
    secondary: {
      main: '#94a3b8', // Slate 400
      light: '#cbd5e1',
      dark: '#64748b',
      contrastText: '#0f172a',
    },
    background: {
      default: '#0f172a', // Slate 900
      paper: '#1e293b', // Slate 800
    },
    text: {
      primary: '#f1f5f9', // Slate 100
      secondary: '#cbd5e1', // Slate 300
    },
    success: {
      main: '#22c55e', // Green 500
    },
    error: {
      main: '#ef4444', // Red 500
    },
    warning: {
      main: '#f59e0b', // Amber 500
    },
    info: {
      main: '#06b6d4', // Cyan 500
    },
  },
  components: {
    ...lightTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          background: '#1e293b',
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function AppThemeProvider({ children }: ThemeProviderProps) {
  // For this demo, we'll use light theme by default
  // In a real app, you'd implement user preference and system preference detection
  const theme = lightTheme; 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export { lightTheme, darkTheme }; 