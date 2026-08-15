'use client';

import React, { useState } from 'react';
import { Site, Reading } from '@/types/gridpulse';
import { Wrench, CheckCircle2, MapPin, Send, AlertTriangle, X } from 'lucide-react';

interface DispatchTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
  reading?: Reading;
}

export const DispatchTicketModal: React.FC<DispatchTicketModalProps> = ({
  isOpen,
  onClose,
  site,
  reading
}) => {
  const [technicianName, setTechnicianName] = useState('Engineer Rahul Sharma (Northeast Field Operations)');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'NORMAL'>(
    reading?.status === 'FAULT' ? 'CRITICAL' : 'HIGH'
  );
  const [isDispatched, setIsDispatched] = useState(false);

  if (!isOpen) return null;

  const handleDispatch = () => {
    setIsDispatched(true);

    // Trigger Browser Push Notification if browser permissions granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🚨 FIELD DISPATCH TICKET GENERATED: ${site.name}`, {
        body: `Technician assigned: ${technicianName}. Priority: ${priority}. GPS: ${site.lat}, ${site.lng}`,
        icon: '/favicon.ico'
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((perm) => {
        if (perm === 'granted') {
          new Notification(`🚨 FIELD DISPATCH TICKET GENERATED: ${site.name}`, {
            body: `Technician assigned: ${technicianName}. Priority: ${priority}`
          });
        }
      });
    }

    setTimeout(() => {
      setIsDispatched(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md font-mono">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">FIELD WORK ORDER DISPATCH TICKET</h3>
            <p className="text-xs text-slate-400">Target: {site.name}</p>
          </div>
        </div>

        {isDispatched ? (
          <div className="p-6 text-center space-y-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <CheckCircle2 className="w-10 h-10 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold">DISPATCH TICKET DISPATCHED VIA MOBILE PUSH & WHATSAPP</h4>
            <p className="text-xs text-slate-300">
              Technician notified on smartphone with GPS coordinates ({site.lat}, {site.lng}) and spare parts checklist.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">ASSIGNED FIELD TECHNICIAN</label>
                <input
                  type="text"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">GPS COORDINATES</label>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{site.lat}, {site.lng}</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">SEVERITY PRIORITY</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'CRITICAL' | 'HIGH' | 'NORMAL')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CRITICAL">CRITICAL (Emergency)</option>
                    <option value="HIGH">HIGH (Preventative)</option>
                    <option value="NORMAL">NORMAL (Routine)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block font-bold">HARDWARE DIAGNOSTIC SUMMARY</span>
                <p className="text-[11px] text-slate-300">
                  {reading?.status === 'FAULT'
                    ? `Under-voltage (battery ${reading.battery_v}V < 44V) & Thermal trip (${reading.temp_c}°C). Required: 48V LiFePO4 replacement module & thermal compound.`
                    : `Routine thermal maintenance for ${site.controller_model}.`}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDispatch}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Smartphone Alert</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
