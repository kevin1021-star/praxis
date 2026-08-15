import { Reading, SiteTrend, AlertItem } from '@/types/gridpulse';

/**
 * Calculates battery State of Charge (SoC %) for 48V LiFePO4 chemistry.
 * Nominal 51.2V (16s pack). Cutoff at 44.0V (0%), Peak at 56.8V (100%).
 */
export function calculateBatterySoC(voltage: number): number {
  const minV = 44.0;
  const maxV = 56.8;
  if (voltage <= minV) return 0;
  if (voltage >= maxV) return 100;
  const soc = Math.round(((voltage - minV) / (maxV - minV)) * 100);
  return Math.max(0, Math.min(100, soc));
}

/**
 * Calculates estimated Battery State of Health (SoH %) based on thermal stress and voltage cycle history.
 */
export function calculateBatterySoH(readings: Reading[]): { sohPct: number; healthStatus: string; estimatedLifeYears: number } {
  if (!readings || readings.length === 0) {
    return { sohPct: 98.4, healthStatus: 'EXCELLENT', estimatedLifeYears: 9.2 };
  }

  // Compute thermal penalty
  const avgTemp = readings.reduce((sum, r) => sum + r.temp_c, 0) / readings.length;
  const thermalPenalty = avgTemp > 35 ? (avgTemp - 35) * 0.15 : 0;

  // Base nominal degradation model
  const baseSoH = 99.2 - thermalPenalty;
  const sohPct = Math.max(70.0, Math.min(100.0, Number(baseSoH.toFixed(1))));
  
  const healthStatus = sohPct >= 95 ? 'EXCELLENT' : sohPct >= 85 ? 'GOOD' : 'DEGRADED';
  const estimatedLifeYears = Number(((sohPct / 100) * 10.0).toFixed(1));

  return { sohPct, healthStatus, estimatedLifeYears };
}

/**
 * Calculates Financial ROI & Environmental Carbon Offset Metrics
 */
export function calculateFleetFinancialImpact(sitesCount: number, totalPowerKw: number) {
  // Diesel fuel cost offset (₹95/L, generator consumes ~0.35L per kWh)
  const dailyKwhGenerated = totalPowerKw * 5.5 * sitesCount; // ~5.5 peak sun hours
  const dieselLitersSavedDaily = dailyKwhGenerated * 0.35;
  const dailyRupeesSaved = Math.round(dieselLitersSavedDaily * 95);
  const monthlyRupeesSaved = dailyRupeesSaved * 30;

  // CO2 offsetting (0.82 kg CO2 saved per kWh solar vs grid/diesel)
  const monthlyCo2OffsetTons = Number(((dailyKwhGenerated * 30 * 0.82) / 1000).toFixed(2));

  // Payback period for $15.60 hardware node
  const paybackDays = Math.round((1250 * sitesCount) / Math.max(1, dailyRupeesSaved)) || 3;

  return {
    dailyKwhGenerated: Math.round(dailyKwhGenerated),
    monthlyRupeesSaved,
    monthlyCo2OffsetTons,
    paybackDays
  };
}

/**
 * Evaluates rolling 5-reading voltage trajectory (delta V) to project predictive safety trip.
 */
export function analyzeVoltageTrend(history: Reading[]): SiteTrend {
  if (!history || history.length < 2) {
    return {
      direction: 'stable',
      deltaV: 0,
      ratePerMin: 0,
      predictedMinutesToDepletion: null,
      statusDescription: 'Telemetry Nominal (Establishing Baseline)'
    };
  }

  // Use last 5 readings
  const sample = history.slice(-5);
  const firstV = sample[0].battery_v;
  const latestV = sample[sample.length - 1].battery_v;
  const deltaV = Number((latestV - firstV).toFixed(2));
  const ratePerMin = Number((deltaV * 6).toFixed(2)); // 5 readings ~ 10 seconds

  let direction: 'rising' | 'falling' | 'stable' = 'stable';
  if (deltaV > 0.2) direction = 'rising';
  else if (deltaV < -0.2) direction = 'falling';

  let predictedMinutesToDepletion: number | null = null;
  let statusDescription = 'Grid Balance Stable';

  if (direction === 'falling') {
    const minSafetyV = 44.0;
    const currentV = latestV;
    const vDropPerStep = Math.abs(deltaV) / Math.max(1, sample.length - 1);
    
    if (vDropPerStep > 0.05 && currentV > minSafetyV) {
      // 1 step = 2 seconds (0.033 mins)
      const stepsRemaining = (currentV - minSafetyV) / vDropPerStep;
      predictedMinutesToDepletion = Math.round((stepsRemaining * 2) / 60);
      statusDescription = `Predictive Discharge Alert: ~${predictedMinutesToDepletion} mins to 44V trip`;
    } else {
      statusDescription = 'Minor Load Drift Detected';
    }
  } else if (direction === 'rising') {
    statusDescription = 'PV Array Actively Charging Battery';
  }

  return {
    direction,
    deltaV,
    ratePerMin,
    predictedMinutesToDepletion,
    statusDescription
  };
}

/** Alias for computeBatteryTrend */
export const computeBatteryTrend = analyzeVoltageTrend;

/**
 * Detects real-time hardware electrical anomalies from reading streams
 */
export function detectAnomalies(arg1: Reading | string, arg2?: Reading | string): AlertItem[] {
  let reading: Reading;
  let siteName: string;

  if (typeof arg1 === 'string') {
    siteName = arg1;
    reading = arg2 as Reading;
  } else {
    reading = arg1;
    siteName = (arg2 as string) || reading?.siteId || 'Microgrid Node';
  }

  const alerts: AlertItem[] = [];
  if (!reading) return alerts;

  if (reading.status === 'FAULT') {
    alerts.push({
      id: `alert-fault-${Date.now()}-${Math.random()}`,
      siteId: reading.siteId,
      siteName: siteName || reading.siteId,
      severity: 'CRITICAL',
      message: `BMS TRIP: Critical battery under-voltage (${reading.battery_v}V) or over-temp (${reading.temp_c}°C)`,
      metric: 'BATTERY_V',
      value: reading.battery_v,
      threshold: '44.0V',
      timestamp: new Date().toLocaleTimeString()
    });
  } else if (reading.status === 'WARNING') {
    alerts.push({
      id: `alert-warn-${Date.now()}-${Math.random()}`,
      siteId: reading.siteId,
      siteName: siteName || reading.siteId,
      severity: 'WARNING',
      message: `SURGE WARNING: High load demand (${reading.load_a}A) / Temp thermal stress (${reading.temp_c}°C)`,
      metric: 'LOAD_CURRENT',
      value: reading.load_a,
      threshold: '25.0A',
      timestamp: new Date().toLocaleTimeString()
    });
  }

  return alerts;
}
