'use client';

import React, { useState } from 'react';
import { Site } from '@/types/gridpulse';
import { MapPin, Zap, Thermometer, Sun, Battery, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';

interface FleetMapViewProps {
  sites: Site[];
  onSelectSite?: (id: string) => void;
}

export const FleetMapView: React.FC<FleetMapViewProps> = ({ sites, onSelectSite }) => {
  const [activeSite, setActiveSite] = useState<Site | null>(sites[0] || null);

  return (
    <div className="relative w-full h-[520px] rounded-2xl glass-panel overflow-hidden border border-slate-800 p-4">
      {/* GIS Grid Map Background Graphic */}
      <div className="absolute inset-0 bg-[#060913] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-80" />
      
      {/* Top Map Status Overlay */}
      <div className="absolute top-6 left-6 z-10 flex items-center space-x-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span className="text-xs font-mono text-slate-300">GEO-TELEMETRY MATRIX (NORTH EAST REGION)</span>
      </div>

      {/* Nodes Map Visualization Canvas */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Subtle Map Outlines / Nodes Positioning */}
        <div className="relative w-[85%] h-[80%] border border-slate-800/60 rounded-xl bg-slate-950/40 p-6 flex flex-col justify-between">
          
          {/* Map Node Pins */}
          {sites.map((site, index) => {
            const status = site.latestReading?.status || 'NORMAL';
            const isSelected = activeSite?.id === site.id;

            // Approximate relative positions on map preview
            const topPositions = ['28%', '68%', '42%'];
            const leftPositions = ['72%', '35%', '62%'];

            const glowClass =
              status === 'FAULT'
                ? 'bg-red-500/30 border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                : status === 'WARNING'
                ? 'bg-amber-500/30 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-emerald-500/30 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]';

            return (
              <div
                key={site.id}
                style={{
                  position: 'absolute',
                  top: topPositions[index % 3],
                  left: leftPositions[index % 3]
                }}
                className="group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-110"
                onClick={() => {
                  setActiveSite(site);
                  if (onSelectSite) onSelectSite(site.id);
                }}
              >
                {/* Pulse Ring */}
                <div
                  className={`absolute -inset-3 rounded-full border opacity-75 animate-ping ${
                    status === 'FAULT'
                      ? 'border-red-500'
                      : status === 'WARNING'
                      ? 'border-amber-500'
                      : 'border-emerald-500'
                  }`}
                />

                {/* Pin Node Icon */}
                <div className={`relative p-3 rounded-full border ${glowClass} backdrop-blur-md flex items-center justify-center`}>
                  <MapPin className="w-5 h-5" />
                </div>

                {/* Node Label Tooltip */}
                <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-44 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl shadow-xl transition-all duration-200 ${isSelected ? 'opacity-100 scale-100 z-20' : 'opacity-80 group-hover:opacity-100 scale-95'}`}>
                  <div className="flex items-center justify-between text-[11px] font-bold text-white mb-1">
                    <span className="truncate">{site.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                      status === 'FAULT' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      status === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span>{site.latestReading?.battery_v.toFixed(1) || '51.2'}V</span>
                    <span>{site.latestReading?.load_a.toFixed(1) || '15.0'}A</span>
                    <span>{site.latestReading?.temp_c.toFixed(0) || '30'}°C</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Site Detail Floating Panel */}
      {activeSite && (
        <div className="absolute bottom-6 right-6 z-10 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-semibold text-white truncate">{activeSite.name}</h4>
              <p className="text-[11px] text-slate-400">{activeSite.location}</p>
            </div>
            <Link
              href={`/site/${activeSite.id}`}
              className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-medium flex items-center space-x-1 transition-colors"
            >
              <span>Inspect</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Battery className="w-3 h-3 text-emerald-400" /> Battery
              </span>
              <span className="text-sm font-bold text-white">
                {activeSite.latestReading?.battery_v.toFixed(1) || '51.2'} V
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Load
              </span>
              <span className="text-sm font-bold text-white">
                {activeSite.latestReading?.load_a.toFixed(1) || '15.0'} A
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Sun className="w-3 h-3 text-yellow-400" /> Solar
              </span>
              <span className="text-sm font-bold text-white">
                {activeSite.latestReading?.irradiance_raw || 800} W/m²
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-red-400" /> Thermal
              </span>
              <span className="text-sm font-bold text-white">
                {activeSite.latestReading?.temp_c.toFixed(1) || '30.0'} °C
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
