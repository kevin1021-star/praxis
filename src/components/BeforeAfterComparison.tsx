'use client';

import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export const BeforeAfterComparison: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 border border-white/10 space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto font-mono">
        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          TRANSFORMATIONAL IMPACT ANALYSIS
        </span>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          WITHOUT GRIDPULSE vs. WITH GRIDPULSE
        </h2>
        <p className="text-xs text-slate-400">
          Why traditional passive monitoring dashboards fail in rural off-grid microgrids
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
        
        {/* WITHOUT GRIDPULSE */}
        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-3 border-b border-red-500/20 pb-3">
            <XCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-red-300 uppercase">Without GridPulse (Legacy Passive Monitoring)</h3>
              <span className="text-[11px] text-red-400/80">Reactive, Read-Only & Internet-Dependent</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span><strong>Unannounced 3:00 AM Blackouts:</strong> Battery drains completely without warning, shutting down healthcare clinic vaccine fridges.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span><strong>Catastrophic Cell Damage:</strong> Over-discharge below 38.0V degrades LiFePO4 cells, ruining ₹50,000+ battery packs prematurely.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span><strong>Cloud Blackout Blindness:</strong> Rural network outages stop cloud monitoring completely, leaving hardware unprotected.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span><strong>High Operational Cost:</strong> Requires manual physical technician site visits to reset tripped breakers.</span>
            </li>
          </ul>
        </div>

        {/* WITH GRIDPULSE */}
        <div className="bg-emerald-950/20 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl shadow-emerald-950/30">
          <div className="flex items-center space-x-3 border-b border-emerald-500/20 pb-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-300 uppercase">With GridPulse (Predictive AI Autonomous OS)</h3>
              <span className="text-[11px] text-emerald-400/80">Proactive, Bi-Directional & Edge Autonomous</span>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-200">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span><strong>45-Min Predictive Discharge Alerts:</strong> AI calculates rolling voltage drop trajectory (ΔV/min) and predicts depletion before blackout.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span><strong>Automated Load Shedding:</strong> Automatically switches relays on-site to disconnect water pumps while keeping clinic lights ON.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span><strong>On-Chip Edge Autonomy:</strong> ESP32 trips relays locally in 10ms without internet, saving hardware even during network cuts.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-400 mt-0.5">•</span>
              <span><strong>+40% Battery Lifespan Extension:</strong> Saves ₹50,000+ per site in premature battery replacement costs.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* WHY WE ARE DIFFERENT EXECUTIVE FEATURE COMPARISON MATRIX */}
      <div className="pt-4 font-mono">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          WHY GRIDPULSE IS DIFFERENT (FEATURE COMPARISON MATRIX)
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Feature Metric</th>
                <th className="p-3 text-red-400">Standard Solar Portal</th>
                <th className="p-3 text-emerald-400">GridPulse AI OS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/60 text-slate-300 text-[11px]">
              <tr>
                <td className="p-3 font-bold text-white">Discharge Prediction</td>
                <td className="p-3 text-red-400 font-semibold">❌ None (Only static voltage)</td>
                <td className="p-3 text-emerald-400 font-semibold">✓ Predictive ΔV/min Trajectory Engine</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Remote Relay Control</td>
                <td className="p-3 text-red-400 font-semibold">❌ Read-Only (No Downlink)</td>
                <td className="p-3 text-emerald-400 font-semibold">✓ Bi-Directional Remote Cloud Downlink Switch</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Offline Edge Protection</td>
                <td className="p-3 text-red-400 font-semibold">❌ Dies without Internet</td>
                <td className="p-3 text-emerald-400 font-semibold">✓ 10ms On-Chip Local Hardware Interlocks</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Field Mobile Dispatch</td>
                <td className="p-3 text-red-400 font-semibold">❌ Generic Email / SMS</td>
                <td className="p-3 text-emerald-400 font-semibold">✓ 1-Click WhatsApp + Push GPS Ticket Modal</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Hardware Cost</td>
                <td className="p-3 text-slate-400">₹15,000+ Industrial Gateway</td>
                <td className="p-3 text-emerald-400 font-semibold">₹1,250 ($15.60) Ultra-Low Cost ESP32 Node</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
