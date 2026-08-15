'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Site } from '@/types/gridpulse';
import { MapPin, Zap, Sun, Thermometer, Battery, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';
import { calculateBatterySoC } from '@/lib/analytics';

interface FleetMapViewProps {
  sites: Site[];
}

export const FleetMapView: React.FC<FleetMapViewProps> = ({ sites }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id || 'village-a');
  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const reading = selectedSite?.latestReading;
  const soc = calculateBatterySoC(reading?.battery_v || 51.2);
  const status = reading?.status || 'NORMAL';

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-white/10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 font-mono">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              GIS GEOGRAPHIC MAP MATRIX
            </span>
            <span className="text-xs text-slate-400">North-East India Microgrid Nodes</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            INDIA ➔ NORTH-EAST REGIONAL CLUSTER MAP
          </h2>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="led-dot led-normal" />
            <span className="text-slate-300">🟢 Normal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="led-dot led-warning" />
            <span className="text-slate-300">🟡 Warning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="led-dot led-fault" />
            <span className="text-slate-300">🔴 Critical</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive GIS Region Map Container */}
        <div className="lg:col-span-2 bg-slate-950/90 rounded-2xl border border-white/10 p-6 min-h-[380px] relative overflow-hidden flex flex-col justify-between font-mono">
          
          {/* Map Stylized Overlay Vector Graphic */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="flex justify-between items-center z-10">
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>REGIONAL CLUSTER: <strong className="text-white">NORTHEAST HILL TRACTS</strong></span>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-900 px-2.5 py-1 rounded border border-white/10">
              GIS Coordinates Synced
            </span>
          </div>

          {/* Interactive GIS Microgrid Pins */}
          <div className="relative w-full h-64 my-4 flex items-center justify-center">
            
            {sites.map((site, index) => {
              const nodeReading = site.latestReading;
              const nodeStatus = nodeReading?.status || 'NORMAL';
              const isSelected = site.id === selectedSiteId;

              // Node positions on North-East India map graphic representation
              const positions = [
                { top: '35%', left: '72%' }, // Kiphire, Nagaland
                { top: '62%', left: '48%' }, // Mawlynnong, Meghalaya
                { top: '22%', left: '85%' }  // Ziro Valley, Arunachal Pradesh
              ];

              const pos = positions[index % positions.length];

              const statusColor =
                nodeStatus === 'FAULT' ? 'bg-red-500 shadow-red-500/50' :
                nodeStatus === 'WARNING' ? 'bg-amber-500 shadow-amber-500/50' :
                'bg-emerald-500 shadow-emerald-500/50';

              const ringColor =
                nodeStatus === 'FAULT' ? 'border-red-500 text-red-400' :
                nodeStatus === 'WARNING' ? 'border-amber-500 text-amber-400' :
                'border-emerald-500 text-emerald-400';

              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  style={{ top: pos.top, left: pos.left }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all group z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Animated Pulsing Ring */}
                    <span className={`absolute w-10 h-10 rounded-full border-2 animate-ping opacity-60 ${ringColor}`} />
                    
                    {/* GIS Pin Core */}
                    <div className={`w-7 h-7 rounded-full ${statusColor} shadow-lg flex items-center justify-center text-slate-950 font-bold text-[11px]`}>
                      {index + 1}
                    </div>

                    {/* Hover Label */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 px-2.5 py-1 rounded border border-white/20 text-[10px] text-white opacity-90 group-hover:opacity-100 shadow-xl">
                      {site.name} ({nodeStatus})
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 z-10 flex items-center justify-between border-t border-white/10 pt-3">
            <span>Click any numbered node pin to inspect live telemetry drawer</span>
            <span className="text-emerald-400 font-bold">3 Active Field Nodes</span>
          </div>
        </div>

        {/* Selected Node Live Telemetry Drawer Panel */}
        <div className="bg-slate-950/80 rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-4 font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inspecting GIS Node</span>
                <h3 className="text-base font-bold text-white">{selectedSite.name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                status === 'FAULT' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                status === 'WARNING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {status}
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedSite.location}</span>
            </p>

            <div className="space-y-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Battery className="w-4 h-4 text-emerald-400" /> Battery Pack
                </span>
                <span className="text-sm font-bold text-white">
                  {reading?.battery_v.toFixed(1) || '51.2'} V ({soc}%)
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Load Demand
                </span>
                <span className="text-sm font-bold text-white">
                  {reading?.load_a.toFixed(1) || '15.0'} A
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-yellow-400" /> Solar Irradiance
                </span>
                <span className="text-sm font-bold text-white">
                  {reading?.irradiance_raw || 800} W/m²
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-red-400" /> Temp
                </span>
                <span className="text-sm font-bold text-white">
                  {reading?.temp_c.toFixed(1) || '30.0'} °C
                </span>
              </div>
            </div>
          </div>

          <Link
            href={`/site/${selectedSite.id}`}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center justify-center space-x-1 transition-all"
          >
            <span>Open Deep Inspector Page</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
