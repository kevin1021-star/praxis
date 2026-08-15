import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GridPulseProvider } from '@/context/GridPulseContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'GridPulse | Real-Time Solar Microgrid Intelligence OS',
  description: 'Production-grade real-time monitoring and predictive analytics platform for solar microgrid installations.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#070a11] text-slate-100 min-h-screen font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <GridPulseProvider>{children}</GridPulseProvider>
      </body>
    </html>
  );
}
