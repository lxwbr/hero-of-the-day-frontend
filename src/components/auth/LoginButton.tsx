'use client';

import { useState } from 'react';
import { Button, Text, Group, Avatar } from '@mantine/core';
import { authService } from '@/services/auth';

interface LoginButtonProps {
  onLoginSuccess?: (email: string) => void;
}

export function LoginButton({ onLoginSuccess }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(authService.getUserEmail());

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await authService.login();
      if (result?.account) {
        const email = result.account.username;
        setUserEmail(email);
        onLoginSuccess?.(email);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUserEmail(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (userEmail) {
    return (
      <Group>
        <Avatar size="sm" color="green" />
        <Text size="sm" c="dimmed">
          {userEmail}
        </Text>
        <Button 
          variant="light" 
          size="xs" 
          onClick={handleLogout}
          loading={isLoading}
        >
          Logout
        </Button>
      </Group>
    );
  }

  return (
    <Button 
      onClick={handleLogin}
      loading={isLoading}
      variant="filled"
      color="blue"
    >
      Sign in with Microsoft
    </Button>
  );
} 