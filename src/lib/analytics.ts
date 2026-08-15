import { Reading, SiteTrend, AlertItem } from '@/types/gridpulse';

/**
 * Calculate SoC % for a standard 48V LiFePO4 battery pack (16S) based on terminal voltage.
 */
export function calculateBatterySoC(voltage: number): number {
  if (voltage >= 54.0) return 100;
  if (voltage >= 52.8) return Math.round(90 + ((voltage - 52.8) / (54.0 - 52.8)) * 10);
  if (voltage >= 51.2) return Math.round(70 + ((voltage - 51.2) / (52.8 - 51.2)) * 20);
  if (voltage >= 49.6) return Math.round(40 + ((voltage - 49.6) / (51.2 - 49.6)) * 30);
  if (voltage >= 48.0) return Math.round(20 + ((voltage - 48.0) / (49.6 - 48.0)) * 20);
  if (voltage >= 44.0) return Math.round(((voltage - 44.0) / (48.0 - 44.0)) * 20);
  return 0;
}

/**
 * Computes voltage trend over the last 5 readings.
 */
export function computeBatteryTrend(readings: Reading[]): SiteTrend {
  if (!readings || readings.length < 2) {
    return {
      direction: 'stable',
      deltaV: 0,
      ratePerMin: 0,
      predictedMinutesToDepletion: null,
      statusDescription: 'Telemetry baseline initializing'
    };
  }

  // Take up to last 5 readings
  const last5 = readings.slice(-5);
  const oldest = last5[0];
  const newest = last5[last5.length - 1];

  const deltaV = Number((newest.battery_v - oldest.battery_v).toFixed(2));
  
  // Assume each reading step in demo/live is ~2-10 seconds interval
  const estimatedTimeSpanMin = Math.max(0.5, (last5.length - 1) * 0.2); // ~1 min span for 5 steps
  const ratePerMin = Number((deltaV / estimatedTimeSpanMin).toFixed(2));

  let direction: 'rising' | 'falling' | 'stable' = 'stable';
  if (deltaV > 0.25) direction = 'rising';
  else if (deltaV < -0.25) direction = 'falling';

  let predictedMinutesToDepletion: number | null = null;
  let statusDescription = 'Battery pack voltage nominal';

  if (direction === 'falling') {
    const cutoffVoltage = 44.0;
    const remainingVolts = Math.max(0, newest.battery_v - cutoffVoltage);
    const dischargeRate = Math.abs(ratePerMin);
    
    if (dischargeRate > 0.05 && remainingVolts > 0) {
      predictedMinutesToDepletion = Math.round(remainingVolts / dischargeRate);
      statusDescription = `Discharging rapidly: ~${predictedMinutesToDepletion} mins to cutoff (44.0V)`;
    } else {
      statusDescription = 'Discharging under heavy grid load';
    }
  } else if (direction === 'rising') {
    statusDescription = `Charging smoothly (+${Math.abs(ratePerMin)} V/min)`;
  }

  return {
    direction,
    deltaV,
    ratePerMin,
    predictedMinutesToDepletion,
    statusDescription
  };
}

/**
 * Analyzes telemetry reading and returns generated alerts.
 */
export function detectAnomalies(reading: Reading, siteName: string): AlertItem[] {
  const alerts: AlertItem[] = [];
  const dateStr = typeof reading.timestamp === 'string' 
    ? reading.timestamp 
    : new Date().toLocaleTimeString();

  if (reading.battery_v < 44.0) {
    alerts.push({
      id: `alert-bv-crit-${reading.id || Math.random()}`,
      siteId: reading.siteId,
      siteName,
      severity: 'CRITICAL',
      message: `Critical under-voltage trip detected (${reading.battery_v.toFixed(1)}V < 44.0V cutoff limit)`,
      metric: 'Battery Voltage',
      value: `${reading.battery_v.toFixed(1)} V`,
      threshold: '< 44.0 V',
      timestamp: dateStr
    });
  } else if (reading.battery_v < 48.0) {
    alerts.push({
      id: `alert-bv-warn-${reading.id || Math.random()}`,
      siteId: reading.siteId,
      siteName,
      severity: 'WARNING',
      message: `Battery pack voltage reserve low (${reading.battery_v.toFixed(1)}V)`,
      metric: 'Battery Voltage',
      value: `${reading.battery_v.toFixed(1)} V`,
      threshold: '< 48.0 V',
      timestamp: dateStr
    });
  }

  if (reading.temp_c > 65.0) {
    alerts.push({
      id: `alert-temp-crit-${reading.id || Math.random()}`,
      siteId: reading.siteId,
      siteName,
      severity: 'CRITICAL',
      message: `Thermal shutdown threshold exceeded (${reading.temp_c.toFixed(1)}°C > 65.0°C)`,
      metric: 'BMS/FET Temperature',
      value: `${reading.temp_c.toFixed(1)} °C`,
      threshold: '> 65.0 °C',
      timestamp: dateStr
    });
  } else if (reading.temp_c > 55.0) {
    alerts.push({
      id: `alert-temp-warn-${reading.id || Math.random()}`,
      siteId: reading.siteId,
      siteName,
      severity: 'WARNING',
      message: `Elevated hardware thermal stress (${reading.temp_c.toFixed(1)}°C)`,
      metric: 'BMS/FET Temperature',
      value: `${reading.temp_c.toFixed(1)} °C`,
      threshold: '> 55.0 °C',
      timestamp: dateStr
    });
  }

  if (reading.cell_delta_mv > 100) {
    alerts.push({
      id: `alert-cell-warn-${reading.id || Math.random()}`,
      siteId: reading.siteId,
      siteName,
      severity: 'WARNING',
      message: `LiFePO4 Cell voltage delta drift (${reading.cell_delta_mv} mV imbalance)`,
      metric: 'Cell Imbalance',
      value: `${reading.cell_delta_mv} mV`,
      threshold: '> 100 mV',
      timestamp: dateStr
    });
  }

  return alerts;
}
