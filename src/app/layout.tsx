import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import '@mantine/core/styles.css'
import './globals.css'
import MSWInit from './msw-client-init'

export const metadata = {
  title: 'Hello World',
  description: 'A simple Next.js application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MSWInit />
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  )
} 