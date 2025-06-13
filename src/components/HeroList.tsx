import Link from 'next/link';
import { Box, Title } from '@mantine/core';

const yourHeroes = ['default-hero'];
const allHeroes = ['default-hero', 'another-hero', 'foobar-hero'];

function HeroColumn({ heroes, title }: { heroes: string[]; title: string }) {
  return (
    <Box style={{ minWidth: 320 }}>
      <Title order={2} style={{ color: '#fff', fontWeight: 400, fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        {title}
      </Title>
      {heroes.map((hero, idx) => (
        <Box
          key={hero}
          style={{
            padding: '12px 0',
            borderBottom: '1px solid #cfd8dc',
            textAlign: 'left',
          }}
        >
          <Link href={`/hero/${hero}`} style={{ textDecoration: 'none' }}>
            <span style={{ color: '#36b37e', fontSize: '14px', fontWeight: 400, cursor: 'pointer' }}>{hero}</span>
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export function HeroList() {
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