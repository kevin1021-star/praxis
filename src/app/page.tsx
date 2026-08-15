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
  Brain
} from 'lucide-react';

export default function FleetOverviewPage() {
  const { sites, isDemoMode, hardwareLogs, lastUpdatedTime, triggerHardwareEvent } = useGridPulse();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
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
        
        {/* EXECUTIVE STORYTELLING HERO HEADER */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 font-mono">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-3 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>REAL-TIME SOLAR MICROGRID INTELLIGENCE OS</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                GRID<span className="text-emerald-400">PULSE</span> <span className="text-xs text-slate-400 font-normal">v2.4</span>
              </h1>
              
              <p className="text-xs lg:text-sm text-slate-300 font-sans font-medium leading-relaxed max-w-2xl mt-2">
                AI-powered intelligence for reliable rural solar microgrids. Monitor. Predict. Respond.
              </p>
            </div>

            {/* View Mode & Serial Console Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-slate-950/80 border border-white/10 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
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
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>GIS Node Map</span>
                </button>
              </div>

              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs text-slate-300 font-mono transition-all ${
                  showTerminal
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-950/80 border-white/10 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span className="hidden sm:inline">Telemetry Serial</span>
              </button>
            </div>
          </div>
        </div>

        {/* ELEGANT HARDWARE EVENT SIMULATOR BENCH */}
        {isDemoMode && (
          <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" /> Hardware Event Simulator Bench
              </h3>
              <p className="text-[11px] text-slate-400">Inject hardware anomalies to evaluate real-time UI reaction & alerts:</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleSimulateEvent('CLOUD_COVER')}
                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs transition-colors"
              >
                + Cloud Cover Drop
              </button>
              <button
                onClick={() => handleSimulateEvent('GRID_SURGE')}
                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs transition-colors"
              >
                + Industrial Surge
              </button>
              <button
                onClick={() => handleSimulateEvent('OVERHEAT_FAULT')}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs transition-colors"
              >
                ! Trigger Critical Fault
              </button>
              <button
                onClick={() => handleSimulateEvent('RECOVERY_RESET')}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs transition-colors"
              >
                ✓ BMS Reset / Normal
              </button>
            </div>
          </div>
        )}

        {/* FINANCIAL ROI & ENVIRONMENTAL SAVINGS SUMMARY BAR */}
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Monthly Diesel Savings</span>
              <span className="text-xl font-bold text-emerald-400">
                ₹{financialImpact.monthlyRupeesSaved.toLocaleString()} / mo
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-6">
            <div className="p-2.5 rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Carbon Emissions Offset</span>
              <span className="text-xl font-bold text-teal-300">
                {financialImpact.monthlyCo2OffsetTons} Tons CO₂ / mo
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-6">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Hardware Node Payback</span>
              <span className="text-xl font-bold text-amber-300">
                {financialImpact.paybackDays} Days (Full ROI)
              </span>
            </div>
          </div>
        </div>

        {/* Executive Metric KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>TOTAL PV INPUT POWER</span>
              <Sun className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              <AnimatedCounter value={totalFleetPower} decimals={1} suffix=" kW" />
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Combined Solar Array Output
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>ONLINE MICROGRIDS</span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {activeSitesCount} <span className="text-xs text-slate-500 font-sans font-normal">/ {activeSitesCount} Operational</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> ESP32-S3 Hardware Synced
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>ANOMALY WARNINGS</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {warningCount} <span className="text-xs text-amber-400/80 font-sans font-normal">Sites Throttled</span>
            </div>
            <p className="text-[11px] text-amber-400 mt-1">
              {warningCount > 0 ? 'Thermal or Load surge alert' : 'Thermal headroom optimal'}
            </p>
          </div>

          <div className={`glass-card rounded-2xl p-5 border transition-all ${
            faultCount > 0 
              ? 'border-red-500/50 status-glow-fault bg-red-950/20' 
              : 'border-white/10'
          }`}>
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>CRITICAL FAULTS</span>
              <Zap className={`w-4 h-4 ${faultCount > 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            </div>
            <div className={`text-2xl font-bold tracking-tight ${faultCount > 0 ? 'text-red-400' : 'text-white'}`}>
              {faultCount}
            </div>
            <p className={`text-[11px] mt-1 ${faultCount > 0 ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
              {faultCount > 0 ? 'BMS Safety Trip Active' : 'Zero hardware trips'}
            </p>
          </div>
        </div>

        {/* View Content: Card Grid vs Geo Map */}
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
