import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/core/providers/AppProviders'

export const metadata: Metadata = {
  title: 'Smart Order Closure - FlightDeck Automation',
  description: 'Enterprise-grade FlightDeck task automation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
