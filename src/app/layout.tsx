import "./globals.css";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { theme } from './theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          theme={theme}
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
