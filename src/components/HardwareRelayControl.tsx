'use client';

import React, { useState } from 'react';
import { Power, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import { Site } from '@/types/gridpulse';

interface HardwareRelayControlProps {
  site: Site;
  onLogHardwareCommand?: (msg: string) => void;
}

export const HardwareRelayControl: React.FC<HardwareRelayControlProps> = ({ site, onLogHardwareCommand }) => {
  const [relay1Main, setRelay1Main] = useState<boolean>(true);
  const [relay2Shed, setRelay2Shed] = useState<boolean>(true);
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const toggleRelay1 = () => {
    const newState = !relay1Main;
    setRelay1Main(newState);
    const msg = `TX DOWNLINK COMMAND: Set Relay 1 (Main Inverter) to ${newState ? 'CLOSED (ON)' : 'OPEN (TRIPPED)'}`;
    setCommandFeedback(msg);
    if (onLogHardwareCommand) onLogHardwareCommand(msg);
    setTimeout(() => setCommandFeedback(null), 3500);
  };

  const toggleRelay2 = () => {
    const newState = !relay2Shed;
    setRelay2Shed(newState);
    const msg = `TX DOWNLINK COMMAND: Set Relay 2 (Load Shedding) to ${newState ? 'CLOSED (ENGAGED)' : 'OPEN (SHED)'}`;
    setCommandFeedback(msg);
    if (onLogHardwareCommand) onLogHardwareCommand(msg);
    setTimeout(() => setCommandFeedback(null), 3500);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Power className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">BI-DIRECTIONAL HARDWARE RELAY CONTROL</h3>
        </div>
        <span className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
          ESP32 GPIO ACTIVE
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Transmit bi-directional control signals to physical ESP32 optocoupled relays on target node ({site.controller_model}):
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Relay 1: Main Inverter */}
        <div className={`p-4 rounded-xl border transition-all ${
          relay1Main 
            ? 'bg-slate-950/80 border-emerald-500/40' 
            : 'bg-red-950/30 border-red-500/60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">RELAY 1: MAIN INVERTER</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              relay1Main ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {relay1Main ? 'CLOSED (ON)' : 'OPEN (OFF)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mb-3">GPIO 26 &rarr; Inverter Relay Contactor</span>
          
          <button
            onClick={toggleRelay1}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
              relay1Main
                ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {relay1Main ? 'Disconnect Main Inverter' : 'Reconnect Main Inverter'}
          </button>
        </div>

        {/* Relay 2: Load Shedding */}
        <div className={`p-4 rounded-xl border transition-all ${
          relay2Shed 
            ? 'bg-slate-950/80 border-amber-500/40' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-200">RELAY 2: LOAD SHEDDING</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              relay2Shed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}>
              {relay2Shed ? 'CONNECTED' : 'LOAD SHED'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mb-3">GPIO 27 &rarr; Non-Essential Village Feeder</span>

          <button
            onClick={toggleRelay2}
            className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
              relay2Shed
                ? 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/40'
                : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
            }`}
          >
            {relay2Shed ? 'Shed Non-Essential Load' : 'Restore Full Grid Load'}
          </button>
        </div>
      </div>

      {commandFeedback && (
        <div className="p-2.5 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{commandFeedback}</span>
        </div>
      )}
    </div>
  );
};
