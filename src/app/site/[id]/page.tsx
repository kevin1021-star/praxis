'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useGridPulse } from '@/context/GridPulseContext';
import { Navbar } from '@/components/Navbar';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { PowerFlowDiagram } from '@/components/PowerFlowDiagram';
import { DispatchTicketModal } from '@/components/DispatchTicketModal';
import { HardwareRelayControl } from '@/components/HardwareRelayControl';
import { calculateBatterySoC } from '@/lib/analytics';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  ReferenceLine 
} from 'recharts';
import { 
  ArrowLeft, 
  Battery, 
  Zap, 
  Sun, 
  Thermometer, 
  AlertTriangle, 
  Send, 
  Activity, 
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Cpu,
  Wrench,
  Sliders
} from 'lucide-react';

export default function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const siteId = resolvedParams.id;
  const { sites, alerts, lastUpdatedTime } = useGridPulse();

  const site = sites.find((s) => s.id === siteId) || sites[0];
  const reading = site?.latestReading;
  const history = site?.readingsHistory || [];
  const status = reading?.status || 'NORMAL';
  const soc = calculateBatterySoC(reading?.battery_v || 51.2);
  const trend = site?.trend;

  const [activeChartMetric, setActiveChartMetric] = useState<'battery_v' | 'load_a' | 'irradiance_raw' | 'temp_c'>('battery_v');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Filter alerts for this site
  const siteAlerts = alerts.filter((a) => a.siteId === siteId);

  // Generate WhatsApp prefilled alert message link
  const generateWhatsAppLink = () => {
    const text = encodeURIComponent(
      `🚨 *GRIDPULSE MICROGRID ALERT* 🚨\n\n` +
      `📍 *Site:* ${site.name} (${site.location})\n` +
      `⚠️ *Status:* ${status}\n` +
      `🔋 *Battery Voltage:* ${reading?.battery_v.toFixed(1) || '51.2'}V (${soc}% SoC)\n` +
      `⚡ *Load Current:* ${reading?.load_a.toFixed(1) || '15.0'}A\n` +
      `☀️ *Solar Input:* ${reading?.irradiance_raw || 800} W/m²\n` +
      `🌡️ *BMS Temp:* ${reading?.temp_c.toFixed(1) || '30.0'}°C\n` +
      `⏱️ *Time:* ${reading?.timestamp || lastUpdatedTime}\n\n` +
      `*Action Required:* Immediate technician dispatch for ${status === 'FAULT' ? 'CRITICAL HARDWARE FAULT' : 'THERMAL LOAD WARNING'}.`
    );
    return `https://wa.me/?text=${text}`;
  };

  const statusBannerStyle =
    status === 'FAULT'
      ? 'bg-red-950/40 border-red-500/60 status-glow-fault text-red-300'
      : status === 'WARNING'
      ? 'bg-amber-950/40 border-amber-500/60 status-glow-warning text-amber-300'
      : 'bg-emerald-950/40 border-emerald-500/60 status-glow-normal text-emerald-300';

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Back Link & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-emerald-400 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Fleet Overview</span>
            </Link>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">
                {site.name}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {site.location}
              </span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Technician Dispatch Modal */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white font-mono px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-600/20"
            >
              <Wrench className="w-4 h-4" />
              <span>Dispatch Smartphone Ticket</span>
            </button>

            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Send WhatsApp Alert</span>
            </a>
          </div>
        </div>

        {/* Top Dynamic Status Banner */}
        <div className={`glass-panel p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${statusBannerStyle}`}>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700 shrink-0">
              {status === 'FAULT' ? (
                <AlertTriangle className="w-6 h-6 text-red-400 animate-bounce" />
              ) : status === 'WARNING' ? (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm uppercase tracking-wider font-mono">
                  HARDWARE TELEMETRY STATUS: {status}
                </span>
                <span className={`led-dot ${
                  status === 'FAULT' ? 'led-fault' : status === 'WARNING' ? 'led-warning' : 'led-normal'
                }`} />
              </div>
              <p className="text-xs mt-1 text-slate-300 font-mono">
                {status === 'FAULT'
                  ? 'CRITICAL ALERT: LiFePO4 pack cell voltage dropped below 44.0V safety threshold or thermal cutoff tripped.'
                  : status === 'WARNING'
                  ? 'WARNING: Elevated thermal load on inverter power FETs or load surge active.'
                  : 'SYSTEM NOMINAL: All microgrid hardware parameters operating within safe operating bounds.'}
              </p>
            </div>
          </div>

          <div className="text-right text-xs font-mono shrink-0">
            <span className="text-slate-400 block">UPDATED</span>
            <span className="text-white font-bold">{lastUpdatedTime}</span>
          </div>
        </div>

        {/* Real-Time Power Flow Vector Diagram */}
        <PowerFlowDiagram reading={reading} capacityKw={site.capacity_kw} />

        {/* Live Gauges / Framer Motion Animated Numbers Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Gauge 1: Battery Voltage */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-emerald-400" /> Battery Storage
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {soc}% SoC
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold font-mono text-white tracking-tight">
                <AnimatedCounter value={reading?.battery_v || 51.2} decimals={1} suffix=" V" />
              </div>
            </div>

            {/* Arc Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  soc < 20 ? 'bg-red-500' : soc < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, soc))}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1">
              <span>Trend: {trend?.direction || 'stable'}</span>
              <span className="text-slate-500">Nominal: 51.2V</span>
            </div>
          </div>

          {/* Gauge 2: Load Current */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Load Demand
              </span>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                AC Output
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold font-mono text-white tracking-tight">
                <AnimatedCounter value={reading?.load_a || 15.0} decimals={1} suffix=" A" />
              </div>
            </div>

            {/* Load Capacity Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, ((reading?.load_a || 15) / 60) * 100)}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1">
              <span>Freq: {reading?.ac_freq || 50.0} Hz</span>
              <span className="text-slate-500">Cap: 60A</span>
            </div>
          </div>

          {/* Gauge 3: Solar Irradiance */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-yellow-400" /> PV Irradiance
              </span>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                Solar Sensor
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold font-mono text-white tracking-tight">
                <AnimatedCounter value={reading?.irradiance_raw || 800} decimals={0} suffix=" W/m²" />
              </div>
            </div>

            {/* Solar Intensity Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-yellow-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, ((reading?.irradiance_raw || 800) / 1000) * 100)}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1">
              <span>PV V: {reading?.pv_voltage.toFixed(1) || 120}V</span>
              <span className="text-slate-500">Max: 1000 W/m²</span>
            </div>
          </div>

          {/* Gauge 4: Hardware Temperature */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-red-400" /> BMS / FET Temp
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                (reading?.temp_c || 30) > 55 
                  ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {(reading?.temp_c || 30) > 55 ? 'High Thermal' : 'Cooling OK'}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-bold font-mono text-white tracking-tight">
                <AnimatedCounter value={reading?.temp_c || 30.0} decimals={1} suffix=" °C" />
              </div>
            </div>

            {/* Temp Thermal Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  (reading?.temp_c || 30) > 60 ? 'bg-red-500' : (reading?.temp_c || 30) > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, ((reading?.temp_c || 30) / 80) * 100)}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between pt-1">
              <span>Cell Delta: {reading?.cell_delta_mv || 10}mV</span>
              <span className="text-slate-500">Trip: 65°C</span>
            </div>
          </div>
        </div>

        {/* Bi-Directional Hardware Relay Remote Controller */}
        <HardwareRelayControl site={site} />

        {/* Main Telemetry Time-Series Chart (Recharts) & Hardware Specs Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recharts Telemetry Line Chart */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold font-mono text-white tracking-tight flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>TIME-SERIES TELEMETRY STREAM</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Live sensor trajectory over recent operational steps
                </p>
              </div>

              {/* Metric Selector Tabs */}
              <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl font-mono text-xs">
                <button
                  onClick={() => setActiveChartMetric('battery_v')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeChartMetric === 'battery_v'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Battery V
                </button>
                <button
                  onClick={() => setActiveChartMetric('load_a')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeChartMetric === 'load_a'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Load A
                </button>
                <button
                  onClick={() => setActiveChartMetric('irradiance_raw')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeChartMetric === 'irradiance_raw'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Solar W/m²
                </button>
                <button
                  onClick={() => setActiveChartMetric('temp_c')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    activeChartMetric === 'temp_c'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Temp °C
                </button>
              </div>
            </div>

            {/* Recharts Area Chart Container */}
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} domain={['auto', 'auto']} tickLine={false} />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090d16',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />

                  {activeChartMetric === 'battery_v' && (
                    <>
                      <ReferenceLine y={44.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '44V Safety Cutoff', fill: '#ef4444', fontSize: 10 }} />
                      <Area type="monotone" dataKey="battery_v" name="Battery (V)" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#batteryGrad)" />
                    </>
                  )}

                  {activeChartMetric === 'load_a' && (
                    <Area type="monotone" dataKey="load_a" name="Load (A)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#loadGrad)" />
                  )}

                  {activeChartMetric === 'irradiance_raw' && (
                    <Area type="monotone" dataKey="irradiance_raw" name="Solar (W/m²)" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#solarGrad)" />
                  )}

                  {activeChartMetric === 'temp_c' && (
                    <>
                      <ReferenceLine y={65.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '65°C Overheat Trip', fill: '#ef4444', fontSize: 10 }} />
                      <Area type="monotone" dataKey="temp_c" name="Temp (°C)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#tempGrad)" />
                    </>
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hardware Specs & Predictive Bench Panel */}
          <div className="space-y-6">
            
            {/* Hardware System Specs Card */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>HARDWARE SYSTEM SPECS</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Microcontroller:</span>
                  <span className="text-slate-200 font-bold">{site.controller_model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Inverter Charger:</span>
                  <span className="text-slate-200">{site.inverter_model}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Rated PV Output:</span>
                  <span className="text-emerald-400 font-bold">{site.capacity_kw} kW</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Battery Bank:</span>
                  <span className="text-slate-200">{site.battery_capacity_kwh} kWh (48V LiFePO4)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Firmware:</span>
                  <span className="text-teal-400">{site.firmware_ver}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">BMS Operating Mode:</span>
                  <span className="text-amber-400 font-bold">{reading?.bms_status || 'FLOAT_CHARGE'}</span>
                </div>
              </div>
            </div>

            {/* Predictive Trend & Health Bench */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>PREDICTIVE HEALTH BENCH</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-1">VOLTAGE DRIFT TRAJECTORY</span>
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    {trend?.direction === 'falling' ? (
                      <TrendingDown className="w-4 h-4 text-amber-400" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{trend?.statusDescription}</span>
                  </div>
                </div>

                {trend?.predictedMinutesToDepletion && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span className="text-[10px] uppercase font-bold block">DISCHARGE TIME PREDICTION</span>
                    <span className="text-lg font-bold">~{trend.predictedMinutesToDepletion} mins to safety cutoff</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Triggered Alerts & Anomaly Audit Panel */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold font-mono text-white">ANOMALY AUDIT LOG ({siteAlerts.length})</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Automated Real-time Sensor Triggers</span>
          </div>

          {siteAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              ✓ No active hardware anomalies logged for {site.name}.
            </div>
          ) : (
            <div className="space-y-3">
              {siteAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-950/20 border-red-500/40 text-red-300'
                      : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                      alert.severity === 'CRITICAL' ? 'text-red-400 animate-pulse' : 'text-amber-400'
                    }`} />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold uppercase">[{alert.severity}]</span>
                        <span className="font-semibold text-white">{alert.message}</span>
                      </div>
                      <span className="text-[11px] opacity-80 block mt-1">
                        Metric: {alert.metric} ({alert.value}) | Limit: {alert.threshold}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-400 shrink-0">
                    {alert.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Smartphone Field Dispatch Modal */}
      <DispatchTicketModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        site={site}
        reading={reading}
      />
    </div>
  );
}
