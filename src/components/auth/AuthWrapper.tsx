'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Title, Text, Paper } from '@mantine/core';
import { LoginButton } from './LoginButton';
import { authService } from '@/services/auth';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        // If authenticated but no email, try to get token to refresh user info
        if (authenticated && !authService.getUserEmail()) {
          await authService.getAccessToken();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <Container size="sm" style={{ marginTop: '10rem' }}>
        <Paper p="xl" radius="md" withBorder>
          <Box style={{ textAlign: 'center' }}>
            <Title order={2} mb="md">
              Loading...
            </Title>
            <Text c="dimmed">
              Checking authentication status...
            </Text>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <Container size="sm" style={{ marginTop: '10rem' }}>
        <Paper p="xl" radius="md" withBorder>
          <Box style={{ textAlign: 'center' }}>
            <Title order={2} mb="md">
              Welcome to Hero of the Day
            </Title>
            <Text c="dimmed" mb="xl">
              Please sign in with your Microsoft account to continue
            </Text>
            <LoginButton onLoginSuccess={handleLoginSuccess} />
          </Box>
        </Paper>
      </Container>
    );
  }

  // Show authenticated content
  return (
    <Box>
      <Box 
        style={{ 
          position: 'fixed', 
          top: 0, 
          right: 0, 
          padding: '1rem',
          zIndex: 1000
        }}
      >
        <LoginButton onLoginSuccess={handleLoginSuccess} />
      </Box>
      {children}
    </Box>
  );
} 