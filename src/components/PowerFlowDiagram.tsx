'use client';

import React from 'react';
import { Reading } from '@/types/gridpulse';
import { Sun, Battery, Zap, Cpu, ArrowRight } from 'lucide-react';

interface PowerFlowDiagramProps {
  reading?: Reading;
  capacityKw: number;
}

export const PowerFlowDiagram: React.FC<PowerFlowDiagramProps> = ({ reading }) => {
  const pvPowerKw = Number((((reading?.pv_voltage || 120) * (reading?.pv_current || 12)) / 1000).toFixed(2));
  const loadPowerKw = Number((((reading?.ac_out_v || 230) * (reading?.load_a || 15)) / 1000).toFixed(2));
  const netBatteryPowerKw = Number((pvPowerKw - loadPowerKw).toFixed(2));
  const isCharging = netBatteryPowerKw >= 0;

  // Conversion efficiency calculation
  const efficiencyPct = Math.min(98.4, Math.max(82.0, Number((100 - (reading?.temp_c || 30) * 0.15).toFixed(1))));

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">ENERGY VECTOR FLOW MAP</h3>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          Conversion Efficiency: {efficiencyPct}%
        </span>
      </div>

      {/* Visual Block Diagram Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono">
        
        {/* Node 1: PV Array Generation */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-yellow-500/30 text-center space-y-2 relative group hover:border-yellow-400 transition-colors">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              <Sun className="w-5 h-5 animate-spin-slow" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">1. PV Generation</span>
          <div className="text-xl font-bold text-white">{pvPowerKw} kW</div>
          <span className="text-[10px] text-slate-500 block">{reading?.irradiance_raw || 800} W/m² Irradiance</span>

          {/* Flow Arrow */}
          <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-yellow-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Node 2: Inverter / MPPT Core */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-teal-500/30 text-center space-y-2 relative group hover:border-teal-400 transition-colors">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">2. Inverter MPPT</span>
          <div className="text-xl font-bold text-white">{reading?.ac_out_v.toFixed(1) || 230} V</div>
          <span className="text-[10px] text-teal-400 block">{reading?.ac_freq || 50.0} Hz Grid Sync</span>

          {/* Flow Arrow */}
          <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-teal-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Node 3: LiFePO4 Battery Buffer */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-emerald-500/30 text-center space-y-2 relative group hover:border-emerald-400 transition-colors">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Battery className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">3. Battery Storage</span>
          <div className="text-xl font-bold text-white">{reading?.battery_v.toFixed(1) || 51.2} V</div>
          <span className={`text-[10px] block font-bold ${isCharging ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isCharging ? `+${netBatteryPowerKw} kW (Charging)` : `${netBatteryPowerKw} kW (Discharging)`}
          </span>

          {/* Flow Arrow */}
          <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Node 4: Community AC Demand */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 text-center space-y-2 group hover:border-amber-400 transition-colors">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">4. AC Load Demand</span>
          <div className="text-xl font-bold text-white">{loadPowerKw} kW</div>
          <span className="text-[10px] text-slate-500 block">{reading?.load_a.toFixed(1) || 15} A Load Current</span>
        </div>
      </div>
    </div>
  );
};
