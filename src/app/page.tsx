'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGridPulse } from '@/context/GridPulseContext';
import { Navbar } from '@/components/Navbar';
import { SparklineChart } from '@/components/SparklineChart';
import { FleetMapView } from '@/components/FleetMapView';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { calculateBatterySoC, calculateBatterySoH, calculateFleetFinancialImpact } from '@/lib/analytics';
import { 
  Zap, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  Battery, 
  Sun, 
  Thermometer, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  ArrowUpRight,
  Terminal,
  Grid,
  Map,
  ShieldCheck,
  Cpu,
  Radio,
  Coins,
  Leaf,
  Award,
  Sparkles,
  Brain,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function FleetOverviewPage() {
  const { sites, isDemoMode, hardwareLogs, lastUpdatedTime, triggerHardwareEvent } = useGridPulse();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison'>('overview');
  const [lastActiveEvent, setLastActiveEvent] = useState<string | null>(null);

  // Compute fleet aggregated totals
  const totalFleetPower = sites.reduce((sum, s) => {
    const pv = (s.latestReading?.pv_voltage || 0) * (s.latestReading?.pv_current || 0);
    return sum + pv / 1000;
  }, 0);

  const activeSitesCount = sites.length;
  const faultCount = sites.filter((s) => s.latestReading?.status === 'FAULT').length;
  const warningCount = sites.filter((s) => s.latestReading?.status === 'WARNING').length;

  // Financial ROI & CO2 impact calculations
  const financialImpact = calculateFleetFinancialImpact(activeSitesCount, totalFleetPower);

  const handleSimulateEvent = (eventKey: 'CLOUD_COVER' | 'GRID_SURGE' | 'OVERHEAT_FAULT' | 'RECOVERY_RESET') => {
    setLastActiveEvent(eventKey);
    triggerHardwareEvent(eventKey);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* 1. CREATIVE EXECUTIVE HERO & AI EVENT HARNESS BENCH */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-white/10 relative overflow-hidden shadow-2xl bg-gradient-to-r from-slate-950/90 via-emerald-950/20 to-slate-950/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 font-mono">
            <div>
              <div className="flex items-center space-x-2.5 mb-2">
                <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs text-emerald-400 font-bold tracking-wider">
                  AUTONOMOUS RENEWABLE ENERGY OS
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
                GRID<span className="text-emerald-400">PULSE</span> <span className="text-xs text-slate-500 font-normal">v2.4</span>
              </h1>
              <p className="text-xs lg:text-sm text-slate-300 font-sans mt-1.5 max-w-xl">
                AI-powered intelligence for reliable rural solar microgrids. <span className="text-emerald-400 font-mono font-semibold">Monitor. Predict. Respond.</span>
              </p>
            </div>

            {/* Interactive Hardware Event Bench */}
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Competition Anomaly Simulator Bench
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleSimulateEvent('CLOUD_COVER')}
                  className="px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  ☁ Cloud Drop
                </button>
                <button
                  onClick={() => handleSimulateEvent('GRID_SURGE')}
                  className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  ⚡ Surge
                </button>
                <button
                  onClick={() => handleSimulateEvent('OVERHEAT_FAULT')}
                  className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  🔥 Fault
                </button>
                <button
                  onClick={() => handleSimulateEvent('RECOVERY_RESET')}
                  className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  ✓ Recover
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CREATIVE AI NEURAL CAUSALITY STEPPER (VISUAL PIPELINE) */}
        <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white uppercase tracking-wider">AI CAUSALITY CHAIN REACTION PIPELINE</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Inference: 12ms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/30 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">1. EVENT TRIGGER</span>
              <span className="font-bold text-amber-400 block">{lastActiveEvent ? lastActiveEvent.replace('_', ' ') : 'Nominal Grid'}</span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-blue-500/30 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">2. TELEMETRY SHIFT</span>
              <span className="font-bold text-blue-300 block">
                {lastActiveEvent === 'CLOUD_COVER' ? 'Solar Irradiance ↓ 42%' : lastActiveEvent === 'GRID_SURGE' ? 'AC Load Current ↑ 32A' : lastActiveEvent === 'OVERHEAT_FAULT' ? 'MOSFET Temp ↑ 68°C' : 'Stable 51.2V'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-500/30 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">3. AI PREDICTION</span>
              <span className="font-bold text-purple-300 block">
                {lastActiveEvent === 'OVERHEAT_FAULT' ? 'Thermal Trip Threat' : 'Depletion ~38m'}
              </span>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-teal-500/30 space-y-1">
              <span className="text-[9px] text-slate-500 uppercase block font-bold">4. ACTION ADVISORY</span>
              <span className="font-bold text-teal-300 block">
                {lastActiveEvent === 'OVERHEAT_FAULT' ? 'Trip Relay 1' : 'Shed Pump Load'}
              </span>
            </div>

            <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-500/50 space-y-1">
              <span className="text-[9px] text-emerald-400 uppercase block font-bold">5. SYSTEM RESULT</span>
              <span className="font-bold text-emerald-300 block">Grid Stabilized ✓</span>
            </div>
          </div>
        </div>

        {/* 3. EXECUTIVE BENTO KPI GRID (4 COLUMNS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>SOLAR GENERATION</span>
              <Sun className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={totalFleetPower} decimals={1} suffix=" kW" />
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Peak Array Output
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>ACTIVE MICROGRIDS</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {activeSitesCount} <span className="text-xs text-slate-500 font-normal">/ {activeSitesCount} Online</span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> ESP32 RS485 Synced
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>EST. DIESEL SAVINGS</span>
              <Coins className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              ₹{financialImpact.monthlyRupeesSaved.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/mo</span>
            </div>
            <p className="text-[11px] text-emerald-300">
              Fuel Replacement ROI
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>CARBON OFFSET</span>
              <Leaf className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold text-teal-300">
              {financialImpact.monthlyCo2OffsetTons} Tons <span className="text-xs text-slate-400 font-normal">CO₂/mo</span>
            </div>
            <p className="text-[11px] text-teal-400">
              {financialImpact.paybackDays} Days Hardware Payback
            </p>
          </div>

        </div>

        {/* 4. MAIN VIEWPORT: SIDE-BY-SIDE SITE CARDS & GIS MAP */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">FIELD MICROGRID MATRIX</span>
              <span className="text-xs text-slate-400">({sites.length} Active Nodes)</span>
            </div>

            {/* View Switcher Controls */}
            <div className="flex items-center bg-slate-950/80 border border-white/10 p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Card Grid</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>GIS Region Map</span>
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <FleetMapView sites={sites} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sites.map((site) => {
                const reading = site.latestReading;
                const status = reading?.status || 'NORMAL';
                const soc = calculateBatterySoC(reading?.battery_v || 51.2);
                const soh = calculateBatterySoH(site.readingsHistory || []);
                const trend = site.trend;

                const statusCardGlow =
                  status === 'FAULT'
                    ? 'status-glow-fault'
                    : status === 'WARNING'
                    ? 'status-glow-warning'
                    : 'status-glow-normal';

                const statusBadgeStyle =
                  status === 'FAULT'
                    ? 'bg-red-500/15 text-red-400 border-red-500/40'
                    : status === 'WARNING'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                    : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';

                return (
                  <div
                    key={site.id}
                    className={`glass-card rounded-2xl p-6 border flex flex-col justify-between space-y-5 relative overflow-hidden transition-all ${statusCardGlow}`}
                  >
                    {/* Card Header: Site Name, Location, Status Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white font-mono tracking-tight">
                            {site.name}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center space-x-1 font-mono mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{site.location}</span>
                          </p>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border flex items-center space-x-1.5 ${statusBadgeStyle}`}>
                          <span className={`led-dot ${
                            status === 'FAULT' ? 'led-fault' : status === 'WARNING' ? 'led-warning' : 'led-normal'
                          }`} />
                          <span>{status}</span>
                        </span>
                      </div>

                      {/* Hardware Controller Model & SoH Badge */}
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between border-b border-white/10 pb-3 mt-3">
                        <span>Node: {site.controller_model}</span>
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          SoH: {soh.sohPct}% ({soh.healthStatus})
                        </span>
                      </div>
                    </div>

                    {/* Battery Metric & Live Sparkline */}
                    <div className="bg-slate-950/60 rounded-xl p-4 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                            Battery Pack Voltage
                          </span>
                          <div className="text-2xl font-bold font-mono text-white flex items-baseline space-x-2">
                            <AnimatedCounter value={reading?.battery_v || 51.2} decimals={1} suffix=" V" />
                            <span className="text-xs font-normal text-slate-400">({soc}% SoC)</span>
                          </div>
                        </div>

                        {/* 5-Reading Predictive Trend Indicator */}
                        {trend && (
                          <div className="text-right font-mono">
                            <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs border ${
                              trend.direction === 'rising'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : trend.direction === 'falling'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                              {trend.direction === 'rising' && <TrendingUp className="w-3 h-3" />}
                              {trend.direction === 'falling' && <TrendingDown className="w-3 h-3" />}
                              {trend.direction === 'stable' && <Minus className="w-3 h-3" />}
                              <span className="capitalize">{trend.direction}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {trend.deltaV > 0 ? `+${trend.deltaV}` : trend.deltaV}V / 5 steps
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Mini Sparkline */}
                      <div className="pt-1">
                        <SparklineChart data={site.readingsHistory || []} status={status} height={38} />
                      </div>
                    </div>

                    {/* Secondary Sensor Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Load
                        </span>
                        <span className="font-bold text-slate-200">
                          {reading?.load_a.toFixed(1) || '15.0'} A
                        </span>
                      </div>

                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Sun className="w-3 h-3 text-yellow-400" /> Solar
                        </span>
                        <span className="font-bold text-slate-200">
                          {reading?.irradiance_raw || 800} W/m²
                        </span>
                      </div>

                      <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/10">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-red-400" /> Temp
                        </span>
                        <span className="font-bold text-slate-200">
                          {reading?.temp_c.toFixed(1) || '30.0'} °C
                        </span>
                      </div>
                    </div>

                    {/* Predictive Status Line & Action Link */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono">
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {trend?.statusDescription || 'Hardware Nominal'}
                      </div>

                      <Link
                        href={`/site/${site.id}`}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-xl text-xs flex items-center space-x-1 transition-colors"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. CREATIVE ACCORDION: WHY GRIDPULSE IS DIFFERENT (ELEGANT INTEGRATED DRAWER) */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 font-mono space-y-4">
          <button
            onClick={() => setActiveTab(activeTab === 'comparison' ? 'overview' : 'comparison')}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  WHY GRIDPULSE IS DIFFERENT <span className="text-[10px] text-slate-400 font-normal">(Competitive Matrix)</span>
                </h3>
                <p className="text-[11px] text-slate-400">Click to expand executive feature comparison with legacy solar portals</p>
              </div>
            </div>
            <div className={`p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 group-hover:text-white transition-all ${
              activeTab === 'comparison' ? 'rotate-90 text-emerald-400' : ''
            }`}>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {activeTab === 'comparison' && (
            <div className="pt-4 border-t border-white/10 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-2xl space-y-2">
                  <span className="text-red-400 font-bold text-xs uppercase block">❌ Legacy Standard Dashboards</span>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    <li>• Passive 1-way telemetry (Read-only, no remote control)</li>
                    <li>• Dies during rural cellular/internet blackouts</li>
                    <li>• Alert sent AFTER battery has already blacked out</li>
                    <li>• High hardware gateway cost ($200+)</li>
                  </ul>
                </div>

                <div className="bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-2xl space-y-2">
                  <span className="text-emerald-300 font-bold text-xs uppercase block">✓ GridPulse Autonomous AI OS</span>
                  <ul className="space-y-1.5 text-slate-200 text-[11px]">
                    <li>• Closed-loop bi-directional remote relay control</li>
                    <li>• 10ms on-chip ESP32 hardware interlocks (Offline autonomy)</li>
                    <li>• Predictive trajectory engine calculates depletion min ahead</li>
                    <li>• Ultra-low BOM cost of ~$15.60 (₹1,250) per node</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Hardware Serial Console Drawer */}
        {showTerminal && (
          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden font-mono text-xs shadow-2xl">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-200">ESP32 HARDWARE SERIAL LOG STREAM</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-950/95 h-48 overflow-y-auto space-y-1.5 text-[11px] leading-relaxed">
              {hardwareLogs.length === 0 ? (
                <div className="text-slate-600 italic">Listening for incoming hardware serial telemetry logs...</div>
              ) : (
                hardwareLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span className="text-teal-400 shrink-0">[{log.siteId}]</span>
                    <span className={`shrink-0 font-bold ${
                      log.level === 'ERROR' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-amber-400' :
                      'text-emerald-400'
                    }`}>
                      [{log.level}]
                    </span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
