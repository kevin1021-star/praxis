'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Site, Reading, AlertItem, HardwareLog } from '@/types/gridpulse';
import { computeBatteryTrend, detectAnomalies } from '@/lib/analytics';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, Firestore } from 'firebase/firestore';

interface DemoDataStep {
  step: number;
  [key: string]: unknown;
}

interface DemoDataFile {
  sites: Site[];
  readings: DemoDataStep[];
}

interface GridPulseContextType {
  sites: Site[];
  selectedSiteId: string;
  setSelectedSiteId: (id: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  currentStep: number;
  alerts: AlertItem[];
  hardwareLogs: HardwareLog[];
  triggerHardwareEvent: (eventType: 'GRID_SURGE' | 'CLOUD_COVER' | 'OVERHEAT_FAULT' | 'RECOVERY_RESET') => void;
  resetDemoSimulation: () => void;
  lastUpdatedTime: string;
}

const GridPulseContext = createContext<GridPulseContextType | undefined>(undefined);

const INITIAL_SITES: Site[] = [
  {
    id: 'village-a',
    name: 'Village A Microgrid',
    location: 'Kiphire Sector 4, Nagaland',
    lat: 25.8942,
    lng: 94.7731,
    capacity_kw: 25.0,
    battery_capacity_kwh: 48.0,
    controller_model: 'ESP32-S3-GridCore Node v2.4',
    inverter_model: 'Victron MultiPlus-II 48V/5kVA',
    firmware_ver: 'v2.4.1-ota',
    installed_date: '2024-03-15',
    readingsHistory: []
  },
  {
    id: 'village-b',
    name: 'Village B Microgrid',
    location: 'Mawlynnong West, Meghalaya',
    lat: 25.2014,
    lng: 91.9161,
    capacity_kw: 18.5,
    battery_capacity_kwh: 36.0,
    controller_model: 'ESP32-S3-GridCore Node v2.4',
    inverter_model: 'Growatt SPF 5000ES 48V',
    firmware_ver: 'v2.4.1-ota',
    installed_date: '2024-05-20',
    readingsHistory: []
  },
  {
    id: 'community-hub-1',
    name: 'Community Solar Hub 1',
    location: 'Ziro Valley Cluster, Arunachal Pradesh',
    lat: 27.5937,
    lng: 93.8385,
    capacity_kw: 40.0,
    battery_capacity_kwh: 96.0,
    controller_model: 'ESP32-S3-GridCore Dual-redundant',
    inverter_model: 'SMA Sunny Island 8.0H 48V',
    firmware_ver: 'v2.5.0-pro',
    installed_date: '2023-11-10',
    readingsHistory: []
  }
];

export const GridPulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>(INITIAL_SITES);
  const [selectedSiteId, setSelectedSiteId] = useState<string>('village-a');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [hardwareLogs, setHardwareLogs] = useState<HardwareLog[]>([]);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  const [demoData, setDemoData] = useState<DemoDataFile | null>(null);

  // Load local JSON demo dataset
  useEffect(() => {
    fetch('/data/demo_readings.json')
      .then((res) => res.json())
      .then((data: DemoDataFile) => {
        setDemoData(data);
      })
      .catch((err) => console.error('Failed to load demo readings dataset:', err));
  }, []);

  // Helper to add monospaced hardware diagnostic log
  const addLog = useCallback((siteId: string, siteName: string, level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR', message: string) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(Math.floor(Math.random() * 900 + 100));
    setHardwareLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        siteId,
        siteName,
        level,
        message
      },
      ...prev.slice(0, 49) // Keep last 50 log entries
    ]);
  }, []);

  // DEMO MODE REPLAY TIMER
  useEffect(() => {
    if (!isDemoMode || !isPlaying || !demoData || !demoData.readings.length) return;

    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        const nextStepIdx = (prevStep + 1) % demoData.readings.length;
        const stepData = demoData.readings[nextStepIdx];
        const timeNow = new Date().toLocaleTimeString();
        setLastUpdatedTime(timeNow);

        setSites((prevSites) => {
          return prevSites.map((site) => {
            const rawReading = stepData[site.id] as Omit<Reading, 'id' | 'siteId' | 'timestamp'> | undefined;
            if (!rawReading) return site;

            const newReading: Reading = {
              ...rawReading,
              id: `reading-${site.id}-${nextStepIdx}-${Date.now()}`,
              siteId: site.id,
              timestamp: timeNow
            };

            const existingHistory = site.readingsHistory || [];
            const updatedHistory = [...existingHistory, newReading].slice(-40);
            const computedTrend = computeBatteryTrend(updatedHistory);

            // Anomaly Detection
            const newAlerts = detectAnomalies(newReading, site.name);
            if (newAlerts.length > 0) {
              setAlerts((prevAlerts) => {
                const combined = [...newAlerts, ...prevAlerts];
                // Deduplicate by metric + siteId
                const seen = new Set<string>();
                return combined.filter((item) => {
                  const key = `${item.siteId}-${item.metric}-${item.severity}`;
                  if (seen.has(key)) return false;
                  seen.add(key);
                  return true;
                }).slice(0, 20);
              });

              newAlerts.forEach((a) => {
                addLog(site.id, site.name, a.severity === 'CRITICAL' ? 'ERROR' : 'WARN', a.message);
              });
            } else {
              if (nextStepIdx % 3 === 0) {
                addLog(site.id, site.name, 'INFO', `Telemetry ACK packet received (batt=${newReading.battery_v}V, load=${newReading.load_a}A, temp=${newReading.temp_c}°C)`);
              }
            }

            return {
              ...site,
              latestReading: newReading,
              readingsHistory: updatedHistory,
              trend: computedTrend
            };
          });
        });

        return nextStepIdx;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isDemoMode, isPlaying, demoData, addLog]);

  // LIVE FIRESTORE LISTENER (When Demo Mode is toggled off)
  useEffect(() => {
    const firestore: Firestore | null = db;
    if (isDemoMode || !firestore) return;

    // Listen to sites collection
    const sitesQuery = query(collection(firestore, 'sites'));
    const unsubscribeSites = onSnapshot(sitesQuery, (snapshot) => {
      if (snapshot.empty) return;
      
      snapshot.docs.forEach((docSnap) => {
        const siteData = docSnap.data() as Site;
        const siteId = docSnap.id;

        // Subcollection listener for readings
        const readingsQuery = query(
          collection(firestore, 'sites', siteId, 'readings'),
          orderBy('timestamp', 'desc'),
          limit(30)
        );

        onSnapshot(readingsQuery, (rSnap) => {
          const readingsList: Reading[] = rSnap.docs.map((rDoc) => {
            const rData = rDoc.data();
            const ts = rData.timestamp?.toDate ? rData.timestamp.toDate().toLocaleTimeString() : new Date().toLocaleTimeString();
            return {
              id: rDoc.id,
              siteId,
              status: rData.status || 'NORMAL',
              battery_v: rData.battery_v || 51.2,
              load_a: rData.load_a || 15.0,
              irradiance_raw: rData.irradiance_raw || 800,
              temp_c: rData.temp_c || 30.0,
              pv_voltage: rData.pv_voltage || 120.0,
              pv_current: rData.pv_current || 12.0,
              ac_out_v: rData.ac_out_v || 230.0,
              ac_freq: rData.ac_freq || 50.0,
              cell_delta_mv: rData.cell_delta_mv || 10,
              bms_status: rData.bms_status || 'FLOAT_CHARGE',
              rssi_dbm: rData.rssi_dbm || -65,
              ping_ms: rData.ping_ms || 25,
              timestamp: ts
            };
          }).reverse();

          setSites((prevSites) => {
            return prevSites.map((s) => {
              if (s.id !== siteId) return s;
              const latest = readingsList[readingsList.length - 1];
              return {
                ...s,
                ...siteData,
                latestReading: latest || s.latestReading,
                readingsHistory: readingsList.length > 0 ? readingsList : s.readingsHistory,
                trend: computeBatteryTrend(readingsList)
              };
            });
          });
        });
      });
    });

    return () => unsubscribeSites();
  }, [isDemoMode]);

  // MANUAL HARDWARE SIMULATION EVENT OVERRIDES
  const triggerHardwareEvent = (eventType: 'GRID_SURGE' | 'CLOUD_COVER' | 'OVERHEAT_FAULT' | 'RECOVERY_RESET') => {
    setSites((prevSites) =>
      prevSites.map((site) => {
        if (site.id !== selectedSiteId && eventType !== 'RECOVERY_RESET') return site;

        let modReading: Partial<Reading> = {};
        let logMsg = '';
        let logLevel: 'INFO' | 'WARN' | 'ERROR' = 'WARN';

        switch (eventType) {
          case 'GRID_SURGE':
            modReading = {
              status: 'WARNING',
              load_a: 54.2,
              battery_v: 46.5,
              temp_c: 48.2,
              bms_status: 'DISCHARGING'
            };
            logMsg = 'MANUAL INJECTION: Industrial pump load surge (+35A demand peak)';
            break;
          case 'CLOUD_COVER':
            modReading = {
              irradiance_raw: 140,
              pv_voltage: 45.2,
              pv_current: 1.2
            };
            logMsg = 'MANUAL INJECTION: Rapid solar irradiance drop (<150 W/m² heavy clouds)';
            logLevel = 'INFO';
            break;
          case 'OVERHEAT_FAULT':
            modReading = {
              status: 'FAULT',
              temp_c: 69.5,
              battery_v: 41.8,
              load_a: 58.0,
              bms_status: 'BMS_TRIPPED',
              cell_delta_mv: 165
            };
            logMsg = 'MANUAL INJECTION: Over-temperature & Cell Under-voltage HARDWARE FAULT INJECTED';
            logLevel = 'ERROR';
            break;
          case 'RECOVERY_RESET':
            modReading = {
              status: 'NORMAL',
              battery_v: 52.4,
              load_a: 14.5,
              irradiance_raw: 850,
              temp_c: 30.2,
              bms_status: 'FLOAT_CHARGE',
              cell_delta_mv: 12
            };
            logMsg = 'SYSTEM COMMAND: BMS Fault Reset & Grid Load Shedding Restored Normal';
            logLevel = 'INFO';
            break;
        }

        const timeNow = new Date().toLocaleTimeString();
        const updatedLatest: Reading = {
          ...(site.latestReading || {
            id: 'init',
            siteId: site.id,
            status: 'NORMAL',
            battery_v: 51.2,
            load_a: 15,
            irradiance_raw: 800,
            temp_c: 30,
            pv_voltage: 120,
            pv_current: 12,
            ac_out_v: 230,
            ac_freq: 50,
            cell_delta_mv: 10,
            bms_status: 'FLOAT_CHARGE',
            rssi_dbm: -64,
            ping_ms: 20,
            timestamp: timeNow
          }),
          ...modReading,
          timestamp: timeNow
        };

        addLog(site.id, site.name, logLevel, logMsg);
        const updatedHistory = [...(site.readingsHistory || []), updatedLatest].slice(-40);

        return {
          ...site,
          latestReading: updatedLatest,
          readingsHistory: updatedHistory,
          trend: computeBatteryTrend(updatedHistory)
        };
      })
    );
  };

  const resetDemoSimulation = () => {
    setCurrentStep(0);
    setAlerts([]);
    addLog(selectedSiteId, 'System', 'INFO', 'Demo simulation timeline reset to Step 1 baseline.');
  };

  return (
    <GridPulseContext.Provider
      value={{
        sites,
        selectedSiteId,
        setSelectedSiteId,
        isDemoMode,
        setIsDemoMode,
        isPlaying,
        setIsPlaying,
        currentStep,
        alerts,
        hardwareLogs,
        triggerHardwareEvent,
        resetDemoSimulation,
        lastUpdatedTime
      }}
    >
      {children}
    </GridPulseContext.Provider>
  );
};

export const useGridPulse = () => {
  const context = useContext(GridPulseContext);
  if (!context) throw new Error('useGridPulse must be used within a GridPulseProvider');
  return context;
};
