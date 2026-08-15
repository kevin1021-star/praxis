export type SiteStatus = 'NORMAL' | 'WARNING' | 'FAULT';

export interface Reading {
  id: string;
  siteId: string;
  status: SiteStatus;
  battery_v: number;
  load_a: number;
  irradiance_raw: number;
  temp_c: number;
  timestamp: string | number;
  
  // Extended hardware telemetry fields
  pv_voltage: number;
  pv_current: number;
  ac_out_v: number;
  ac_freq: number;
  cell_delta_mv: number;
  bms_status: 'FLOAT_CHARGE' | 'BULK_CHARGE' | 'DISCHARGING' | 'THERMAL_THROTTLE' | 'BMS_TRIPPED';
  rssi_dbm: number;
  ping_ms: number;
}

export interface SiteTrend {
  direction: 'rising' | 'falling' | 'stable';
  deltaV: number;
  ratePerMin: number;
  predictedMinutesToDepletion?: number | null;
  statusDescription: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  capacity_kw: number;
  battery_capacity_kwh: number;
  controller_model: string;
  inverter_model: string;
  firmware_ver: string;
  installed_date: string;
  latestReading?: Reading;
  readingsHistory?: Reading[];
  trend?: SiteTrend;
}

export interface AlertItem {
  id: string;
  siteId: string;
  siteName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  metric: string;
  value: string | number;
  threshold: string;
  timestamp: string;
}

export interface HardwareLog {
  id: string;
  timestamp: string;
  siteId: string;
  siteName: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  message: string;
}
