'use client';

import React, { useState } from 'react';
import { useGridPulse } from '@/context/GridPulseContext';
import { Navbar } from '@/components/Navbar';
import { Download, Filter, CheckCircle2, AlertTriangle, ShieldCheck, Database } from 'lucide-react';
import { Reading } from '@/types/gridpulse';

export default function ReportsPage() {
  const { sites } = useGridPulse();
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Consolidate all historical readings across sites
  const allReadings: (Reading & { siteName: string })[] = [];
  sites.forEach((site) => {
    (site.readingsHistory || []).forEach((r: Reading) => {
      allReadings.push({
        ...r,
        siteName: site.name
      });
    });
  });

  // Filter readings based on controls
  const filteredReadings = allReadings.filter((r) => {
    const siteMatches = selectedSiteFilter === 'ALL' || r.siteId === selectedSiteFilter;
    const statusMatches = selectedStatusFilter === 'ALL' || r.status === selectedStatusFilter;
    return siteMatches && statusMatches;
  });

  // Calculate Institutional Audit Aggregates
  const totalCount = filteredReadings.length;
  const avgBatteryV = totalCount > 0 
    ? (filteredReadings.reduce((sum, r) => sum + r.battery_v, 0) / totalCount).toFixed(2) 
    : '0.00';
  const maxLoadA = totalCount > 0 
    ? Math.max(...filteredReadings.map((r) => r.load_a)).toFixed(1) 
    : '0.0';
  const totalFaults = filteredReadings.filter((r) => r.status === 'FAULT').length;

  // CSV EXPORT GENERATOR FUNCTION
  const handleExportCSV = () => {
    const headers = [
      'Timestamp',
      'Site ID',
      'Site Name',
      'Status',
      'Battery Voltage (V)',
      'Load Current (A)',
      'Irradiance (W/m2)',
      'Temperature (C)',
      'PV Voltage (V)',
      'AC Output (V)',
      'BMS Status',
      'Ping (ms)'
    ];

    const rows = filteredReadings.map((r) => [
      `"${r.timestamp}"`,
      `"${r.siteId}"`,
      `"${r.siteName}"`,
      `"${r.status}"`,
      r.battery_v,
      r.load_a,
      r.irradiance_raw,
      r.temp_c,
      r.pv_voltage,
      r.ac_out_v,
      `"${r.bms_status}"`,
      r.ping_ms
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gridpulse_telemetry_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Header & CSV Export Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold font-mono tracking-tight text-white">
                INSTITUTIONAL REPORTS & AUDIT
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-teal-500/10 text-teal-400 border border-teal-500/30">
                AUDIT READY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Export verified sensor telemetry logs for institutional ESG reporting & compliance.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export as CSV</span>
          </button>
        </div>

        {/* Audit Aggregates KPI Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>TELEMETRY LOGS RECORDED</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {totalCount} <span className="text-xs text-slate-500 font-sans">packets</span>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>AVG BATTERY VOLTAGE</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {avgBatteryV} V
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>PEAK LOAD DEMAND</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white tracking-tight">
              {maxLoadA} A
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 border border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
              <span>TOTAL FAULT EVENTS</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className={`text-2xl font-bold font-mono tracking-tight ${totalFaults > 0 ? 'text-red-400' : 'text-white'}`}>
              {totalFaults}
            </div>
          </div>
        </div>

        {/* Audit Table Filters */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Audit Query Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Site Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Site:</span>
              <select
                value={selectedSiteFilter}
                onChange={(e) => setSelectedSiteFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="ALL">All Microgrids</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="ALL">All Statuses</option>
                <option value="NORMAL">NORMAL</option>
                <option value="WARNING">WARNING</option>
                <option value="FAULT">FAULT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Readings Log Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden font-mono">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Microgrid Site</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Battery (V)</th>
                  <th className="py-3 px-4">Load (A)</th>
                  <th className="py-3 px-4">Irradiance (W/m²)</th>
                  <th className="py-3 px-4">Temp (°C)</th>
                  <th className="py-3 px-4">PV Voltage (V)</th>
                  <th className="py-3 px-4">BMS Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredReadings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                      No historical telemetry readings match the current audit filters.
                    </td>
                  </tr>
                ) : (
                  filteredReadings.slice(-50).map((r, idx) => (
                    <tr key={`${r.id}-${idx}`} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{r.timestamp}</td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{r.siteName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          r.status === 'FAULT'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : r.status === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-200">{r.battery_v.toFixed(1)} V</td>
                      <td className="py-3 px-4">{r.load_a.toFixed(1)} A</td>
                      <td className="py-3 px-4 text-yellow-400">{r.irradiance_raw} W/m²</td>
                      <td className="py-3 px-4">{r.temp_c.toFixed(1)} °C</td>
                      <td className="py-3 px-4">{r.pv_voltage.toFixed(1)} V</td>
                      <td className="py-3 px-4 text-teal-400 text-[11px]">{r.bms_status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
