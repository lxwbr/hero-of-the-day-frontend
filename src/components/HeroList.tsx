'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Title } from '@mantine/core';
import { getHeroList } from '@/utils/heroesApi';

const CURRENT_USER = 'alice'; // Mock current user

function HeroColumn({ heroes, title }: { heroes: { id: number; name: string; members: string[] }[]; title: string }) {
  return (
    <Box style={{ minWidth: 320 }}>
      <Title order={2} style={{ color: '#fff', fontWeight: 400, fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        {title}
      </Title>
      {heroes.map((hero) => (
        <Box
          key={hero.id}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #cfd8dc',
            textAlign: 'left',
          }}
        >
          <Link href={`/${hero.name}`} style={{ textDecoration: 'none' }}>
            <span style={{ color: '#36b37e', fontSize: '14px', fontWeight: 400, cursor: 'pointer' }}>{hero.name}</span>
          </Link>
        </Box>
      ))}
    </Box>
  );
}

// Helper function to wait for MSW to be ready
const waitForMSW = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.__MSW_READY__) {
      resolve();
    } else {
      const checkMSW = () => {
        if (window.__MSW_READY__) {
          resolve();
        } else {
          setTimeout(checkMSW, 100);
        }
      };
      checkMSW();
    }
  });
};

export function HeroList() {
  const [heroes, setHeroes] = useState<{ id: number; name: string; members: string[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        
        // Wait for MSW to be ready in development
        if (process.env.NODE_ENV === 'development') {
          console.log('HeroList: Waiting for MSW to be ready...');
          await waitForMSW();
          console.log('HeroList: MSW is ready, making API call...');
        }
        
        const data = await getHeroList();
        setHeroes(data);
      } catch (err) {
        console.error('Failed to fetch heroes:', err);
        setError('Failed to load heroes');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroes();
  }, []);

  if (loading) {
    return (
      <Box style={{ textAlign: 'center', marginTop: '2rem', color: '#fff' }}>
        Loading heroes...
      </Box>
    );
  }

  if (error) {
    return (
      <Box style={{ textAlign: 'center', marginTop: '2rem', color: '#ff6b6b' }}>
        {error}
      </Box>
    );
  }

  const heroArray = Array.isArray(heroes) ? heroes : [];
  const yourHeroes = heroArray.filter(h => h.members.includes(CURRENT_USER));
  const allHeroes = heroArray;

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
      <HeroColumn heroes={yourHeroes} title="Your heroes" />
      <HeroColumn heroes={allHeroes} title="All heroes" />
    </Box>
  );
} 