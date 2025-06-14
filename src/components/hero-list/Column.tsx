import { Anchor, Box, Title } from "@mantine/core";
import Link from "next/link";

export function Column({ heroes, title }: { heroes: { name: string }[]; title: string }) {
    return (
      <Box style={{ minWidth: 320 }}>
        <Title order={2} style={{ fontWeight: 600, marginBottom: '1rem', textAlign: 'center' }}>
          {title}
        </Title>
        {heroes.map((hero) => (
          <Box
            key={hero.name}
            style={{
              padding: '12px 0',
              borderBottom: '1px solid #cfd8dc',
              textAlign: 'left',
            }}
          >
            <Anchor component={Link} href={`/${hero.name}`}>
              {hero.name}
            </Anchor>
          </Box>
        ))}
      </Box>
    );
  }