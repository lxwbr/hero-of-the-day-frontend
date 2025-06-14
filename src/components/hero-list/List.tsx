'use client';

import { useState, useEffect } from 'react';
import { Box, LoadingOverlay, Alert, Button, Text } from '@mantine/core';
import { Column } from './Column';
import { heroApi, Hero } from '@/services/api';

interface HeroListProps {
  userEmail: string;
}

export function HeroList({ userEmail }: HeroListProps) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await heroApi.getHeroes();
      setHeroes(data);
    } catch (err) {
      setError('Failed to fetch heroes. Please check your API connection.');
      console.error('Error fetching heroes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleRetry = () => {
    fetchHeroes();
  };

  // Filter heroes based on user membership
  const myHeroes = heroes.filter(hero => 
    hero.members.some(member => member.toLowerCase() === userEmail.toLowerCase())
  );
  
  const otherHeroes = heroes.filter(hero => 
    !hero.members.some(member => member.toLowerCase() === userEmail.toLowerCase())
  );

  if (loading) {
    return (
      <Box style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingOverlay 
          visible={true} 
          loaderProps={{ color: 'green', type: 'bars' }}
          overlayProps={{ color: '#23272f', opacity: 0.8 }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Alert variant="light" color="red" title="Error" withCloseButton>
          <Text>{error}</Text>
          <Button onClick={handleRetry} mt="md" size="sm">
            Try Again
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '8vw',
        width: '100vw',
        marginTop: '2.5rem',
      }}
    >
      <Column title="My heroes" heroes={myHeroes} />
      <Column title="Other heroes" heroes={otherHeroes} />
    </Box>
  );
} 