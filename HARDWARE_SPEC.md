# 🔌 GridPulse Hardware Architecture & Circuit Specification

This document details the **physical hardware engineering, sensor interfacing, microcontroller pinout mapping, and circuit schematic** for the **GridPulse Real-Time Microgrid Monitoring Node (Problem Statement 4)**.

---

## 🛠️ Hardware Bill of Materials (BOM) & Cost Estimate

| Component Description | Model / Part No. | Spec Rating | Unit Cost (USD) | Function in Microgrid |
| :--- | :--- | :--- | :---: | :--- |
| **Microcontroller Core** | ESP32-S3-WROOM-1 | Dual Core 240MHz, 8MB PSRAM, WiFi + BLE | \$4.50 | Telemetry acquisition, ADC conversion, Wireless MQTT/HTTP Gateway. |
| **DC Voltage Sensor** | INA219 / Voltage Divider | Up to 60V DC, 12-bit ADC | \$2.20 | Reads 48V LiFePO4 battery pack voltage ($V_{BAT}$) and PV Array Voltage ($V_{PV}$). |
| **AC Load Current Sensor** | ACS712-30A / CT Clamp | 30A AC/DC, Hall Effect | \$1.80 | Measures AC community load current demand ($I_{LOAD}$). |
| **Solar Irradiance Sensor** | TEMT6000 / Photodiode LDR | 0–1000 $W/m^2$ light spectrum | \$1.20 | Detects solar radiation intensity on panel array. |
| **Thermal Sensor** | DS18B20 Waterproof | -55°C to +125°C, 1-Wire Digital | \$1.50 | Measures BMS battery cell & inverter power MOSFET temperatures ($T_{FET}$). |
| **Solid State Relays** | 4-Channel 5V Optocoupled | 250V AC / 10A per channel | \$3.80 | Bi-directional remote load shedding & emergency low-voltage disconnection. |
| **Status LEDs & Buzzer** | 5mm LED + Active Buzzer | 5V DC | \$0.60 | On-site visual/audible alert for rural technicians. |
| **Total Hardware Node BOM Cost** | — | — | **~\$15.60** | Low-cost deployment for off-grid rural microgrids. |

---

## ⚡ Microcontroller Pinout & Wiring Map

```
  +-----------------------------------------------------------------------+
  |                        ESP32-S3 MICROCONTROLLER                       |
  |                                                                       |
  |  [3.3V] ---------------------> VCC for INA219 & DS18B20 Sensors       |
  |  [5.0V] ---------------------> VCC for Relays & ACS712 Current Sensor |
  |  [GND]  ---------------------> Common Ground Reference                |
  |                                                                       |
  |  [GPIO 34 / ADC1_CH6] <------ Battery Voltage Divider Signal (0-3.3V)  |
  |  [GPIO 35 / ADC1_CH7] <------ ACS712 Current Sensor Analog Output     |
  |  [GPIO 32 / ADC1_CH4] <------ Solar Irradiance LDR Voltage Input      |
  |  [GPIO 04 / 1-Wire]   <------ DS18B20 Temperature Digital Data Bus    |
  |                                                                       |
  |  [GPIO 26 / Digital OUT] ---> Relay 1: Main Grid Inverter Relay       |
  |  [GPIO 27 / Digital OUT] ---> Relay 2: Non-Essential Load Shedding    |
  |  [GPIO 12 / Digital OUT] ---> Red LED (Hardware Fault Trip)           |
  |  [GPIO 13 / Digital OUT] ---> Green LED (System Power/WiFi OK)        |
  +-----------------------------------------------------------------------+
```

---

## 📡 Hardware-Software Serial Communication Payload

The ESP32 firmware reads sensors every **2000 ms** and transmits formatted JSON telemetry packets over HTTP/WebSocket to the GridPulse Web OS:

```json
{
  "node_id": "esp32-node-village-a",
  "firmware_version": "v2.4.1-ota",
  "status": "NORMAL",
  "telemetry": {
    "battery_v": 51.8,
    "load_a": 15.2,
    "irradiance_raw": 850,
    "temp_c": 31.4,
    "pv_voltage": 128.4,
    "pv_current": 16.2,
    "ac_out_v": 230.1,
    "ac_freq": 50.0,
    "cell_delta_mv": 12
  },
  "hardware_relays": {
    "relay_1_main_inverter": true,
    "relay_2_load_shedding": true
  },
  "diagnostics": {
    "rssi_dbm": -64,
    "free_heap_bytes": 184520,
    "uptime_seconds": 1224900
  }
}
```

---

## 🛡️ Physical Protection Interlocks (Fail-Safe Protections)

1. **Hardware Under-Voltage Cutoff Interlock**: If $V_{BAT} < 44.0V$, the ESP32 firmware immediately opens Relay 2 (Load Shedding) without waiting for cloud commands, preserving battery life.
2. **Thermal Over-Temperature Trip**: If $T_{FET} > 65.0^\circ C$, Relay 1 trips to disconnect the inverter and prevent FET burnout.
