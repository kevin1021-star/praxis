'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGridPulse } from '@/context/GridPulseContext';
import { Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isDemoMode, sites, selectedSiteId, setSelectedSiteId } = useGridPulse();

  const navItems = [
    { label: 'Overview', href: '/' },
    { label: 'Inspector', href: `/site/${selectedSiteId || 'village-a'}` },
    { label: 'Audit Log', href: '/reports' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#05070e]/80 border-b border-white/10 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between font-mono">
        
        {/* Brand Logo & Tag */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black tracking-tight text-white font-mono">GRIDPULSE</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">v2.4</span>
            </div>
          </div>
        </Link>

        {/* Floating Pill Nav Tabs */}
        <nav className="flex items-center bg-slate-950/90 border border-white/10 p-1 rounded-full text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href.startsWith('/site') && pathname.startsWith('/site'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Compact Site Selector Dropdown & Live Mode Badge */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-slate-950 text-slate-200 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-emerald-500/50"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <span className={`px-2.5 py-1 rounded-xl border text-xs font-mono flex items-center space-x-1.5 ${
            isDemoMode
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
            <span className="hidden sm:inline">{isDemoMode ? 'Demo Harness' : 'Live Data'}</span>
          </span>
        </div>

      </div>
    </header>
  );
};
