import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GridPulseProvider } from '@/context/GridPulseContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';

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
      <body className="bg-[#050811] text-slate-100 min-h-screen font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
        {/* Dynamic Lively Microgrid Energy Background */}
        <AnimatedBackground />
        <GridPulseProvider>
          <div className="relative z-10">{children}</div>
        </GridPulseProvider>
      </body>
    </html>
  );
}
