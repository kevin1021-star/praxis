'use client';

import React from 'react';
import { Sparkles, Brain, CheckCircle2, ShieldAlert, Cpu, ArrowRight, Zap } from 'lucide-react';
import { Site } from '@/types/gridpulse';

interface AiInsightPanelProps {
  activeEvent: string | null;
  sites: Site[];
}

export const AiInsightPanel: React.FC<AiInsightPanelProps> = ({ activeEvent, sites }) => {
  const faultSite = sites.find((s) => s.latestReading?.status === 'FAULT');
  const warningSite = sites.find((s) => s.latestReading?.status === 'WARNING');

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30 space-y-5 relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              GRIDPULSE AI NEURAL INSIGHT ENGINE <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">v2.4 ACTIVE</span>
            </h3>
            <p className="text-[11px] text-slate-400">Autonomous Causality Predictor & Automated Load Shedding Advisory</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>Real-time Inference: 12ms</span>
        </div>
      </div>

      {/* AI Anomaly Reaction Stepper Flow (Visually Alive Timeline) */}
      {activeEvent ? (
        <div className="bg-slate-950/80 rounded-xl p-4 border border-white/10 space-y-3 font-mono">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
            ⚡ LIVE SIMULATION CAUSALITY CHAIN REACTION
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs items-center">
            {/* Step 1 */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-amber-500/30 text-center">
              <span className="text-[9px] text-slate-500 block">1. TRIGGER</span>
              <span className="font-bold text-amber-400">{activeEvent.replace('_', ' ')}</span>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-blue-500/30 text-center">
              <span className="text-[9px] text-slate-500 block">2. TELEMETRY</span>
              <span className="font-bold text-blue-300">
                {activeEvent === 'CLOUD_COVER' ? 'Solar ↓ 42%' : activeEvent === 'GRID_SURGE' ? 'Load ↑ 32A' : activeEvent === 'OVERHEAT_FAULT' ? 'Temp ↑ 68°C' : 'Volts 51.2V'}
              </span>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-purple-500/30 text-center">
              <span className="text-[9px] text-slate-500 block">3. AI PREDICTION</span>
              <span className="font-bold text-purple-300">
                {activeEvent === 'OVERHEAT_FAULT' ? 'MOSFET Trip Threat' : 'Depletion ~38m'}
              </span>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-teal-500/30 text-center">
              <span className="text-[9px] text-slate-500 block">4. AI ACTION</span>
              <span className="font-bold text-teal-300">
                {activeEvent === 'OVERHEAT_FAULT' ? 'Tripped Relay 1' : 'Shed Pump Load'}
              </span>
            </div>

            {/* Step 5 */}
            <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/50 text-center">
              <span className="text-[9px] text-emerald-400 block">5. RESULT</span>
              <span className="font-bold text-emerald-300">Grid Stabilized ✓</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* Primary AI Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/10 space-y-1.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase font-bold">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Microgrid Health Index
          </span>
          <div className="text-xl font-bold text-emerald-400">98.6% Nominal</div>
          <p className="text-[11px] text-slate-400">All 3 regional microgrids Operating with optimal thermal headroom.</p>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/10 space-y-1.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase font-bold">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Automated Load Advisory
          </span>
          <div className="text-sm font-bold text-slate-200">
            {faultSite ? `Shed non-essential loads on ${faultSite.name}` : warningSite ? `Throttle heavy loads on ${warningSite.name}` : 'Priority Loads 100% Protected'}
          </div>
          <p className="text-[11px] text-slate-400">Primary healthcare clinic & school circuits prioritised.</p>
        </div>

        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-white/10 space-y-1.5">
          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 uppercase font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Autonomy Status
          </span>
          <div className="text-sm font-bold text-teal-300">ESP32 On-Chip Ring Buffer Active</div>
          <p className="text-[11px] text-slate-400">Local MCU interlocks ready for offline rural grid protection.</p>
        </div>
      </div>
    </div>
  );
};
