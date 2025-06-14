import { Box } from '@mantine/core';
import { Column } from './Column';

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
      <Column title="Your heroes" heroes={[{ name: 'default-hero' }]} />
      <Column title="All heroes" heroes={[{ name: 'some-hero' }, { name: 'some-other-hero' }]} />
    </Box>
  );
} 