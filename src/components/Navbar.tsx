'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGridPulse } from '@/context/GridPulseContext';
import { seedFirestoreData } from '@/lib/firebase';
import { 
  Zap, 
  Activity, 
  Play, 
  Pause, 
  Database, 
  FileText, 
  LayoutGrid, 
  Cpu, 
  RefreshCw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { 
    isDemoMode, 
    setIsDemoMode, 
    isPlaying, 
    setIsPlaying, 
    sites, 
    selectedSiteId, 
    setSelectedSiteId,
    currentStep,
    resetDemoSimulation
  } = useGridPulse();

  const [isSeeding, setIsSeeding] = useState(false);
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedNotice(null);
    const result = await seedFirestoreData();
    setIsSeeding(false);
    setSeedNotice(result.message);
    setTimeout(() => setSeedNotice(null), 5000);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Primary Segmented Navigation */}
        <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-start">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent border border-emerald-500/30 group-hover:border-emerald-400/60 transition-colors shadow-sm">
              <Zap className="w-5 h-5 text-emerald-400 group-hover:scale-105 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white font-mono">GRID<span className="text-emerald-400">PULSE</span></span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-300 border border-white/10">
                  OS v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide">Solar Microgrid OS</p>
            </div>
          </Link>

          {/* Sleek Segmented Pill Navigation */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-950/60 border border-white/10 rounded-xl font-mono text-xs">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                pathname === '/'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Fleet Overview</span>
            </Link>

            <Link
              href={`/site/${selectedSiteId}`}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                pathname.startsWith('/site')
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Site Inspector</span>
            </Link>

            <Link
              href="/reports"
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg transition-all ${
                pathname === '/reports'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reports & Audit</span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Mode Controls & Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {/* Site Dropdown Selector */}
          <div className="relative">
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="appearance-none bg-slate-950/80 border border-white/10 hover:border-white/20 text-slate-200 text-xs rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer transition-colors"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setIsDemoMode(false)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                !isDemoMode
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Live Firestore</span>
            </button>

            <button
              onClick={() => setIsDemoMode(true)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Demo Replay</span>
            </button>
          </div>

          {/* Demo Controls */}
          {isDemoMode && (
            <div className="flex items-center space-x-1 bg-slate-950/80 border border-white/10 rounded-xl px-2 py-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                className="p-1 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={resetDemoSimulation}
                title="Reset Simulation Arc"
                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] font-mono text-slate-400 px-1 border-l border-white/10 ml-1">
                Step {currentStep + 1}/30
              </span>
            </div>
          )}

          {/* Seed Firestore Action */}
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="flex items-center space-x-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono transition-all disabled:opacity-50"
            title="Populate mock microgrids in Firestore database"
          >
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{isSeeding ? 'Seeding...' : 'Seed Data'}</span>
          </button>
        </div>
      </div>

      {/* Seed Toast Banner */}
      {seedNotice && (
        <div className="max-w-7xl mx-auto mt-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{seedNotice}</span>
          </div>
        </div>
      )}
    </header>
  );
};
