# ⚡ GridPulse — Real-Time Renewable Energy Microgrid Monitoring OS

> **Smart India Hackathon 2026 Submission** | **Problem Statement 4 (Hardware PS)**  
> **Team Name:** Apex Focus | **Category:** Hardware / IoT Smart Automation

GridPulse is a production-grade, real-time monitoring and predictive analytics platform for off-grid solar microgrid installations. Built to solve rural microgrid reliability issues, GridPulse integrates physical ESP32 sensor hardware, on-chip fail-safe protection interlocks, predictive battery health algorithms, and a real-time web operations OS.

---

## 🌟 Key Features

* **3-Tier Hardware-to-Cloud Architecture:** Connects physical ESP32-S3 sensor nodes reading DC voltage ($V_{BAT}$), AC load current ($I_{LOAD}$), BMS thermal stress ($T_{FET}$), and solar irradiance ($W/m^2$).
* **Predictive Battery Depletion Engine:** Computes rolling 5-reading voltage drift ($\Delta V/\text{min}$) and estimates exact remaining runtime before 44.0V safety cutoff.
* **Bi-Directional Remote Hardware Control:** Web operators can send cloud downlink commands to physically switch optocoupled relays on site for load shedding.
* **Dual Playback Engine:** Seamlessly switch between live Firestore WebSocket feeds and an offline 30-step hardware simulation replay.
* **Smartphone Emergency Alerts (PS 4 Bonus Tip):** 1-Click WhatsApp prefilled alert generator + Mobile Web Push Technician Dispatch Work Orders with GPS coordinates.
* **Institutional ESG Reporting:** Filterable telemetry audit table with 1-click CSV export.

---

## 📁 Repository Structure

```
├── firmware/
│   └── esp32_microgrid_sensor_node.ino   # Physical C++ ESP32 Microcontroller Firmware
├── HARDWARE_SPEC.md                      # Circuit schematic, BOM cost ($15.60), & GPIO pinout map
├── SIH_2026_IDEA_SUBMISSION_PITCH_DECK.md # Official 6-slide SIH submission slide deck
├── GRIDPULSE_FULL_PRESENTATION_&_DEFENSE_GUIDE.md # Live 3-minute pitch script & judges Q&A defense
├── public/
│   ├── sih_pitch_deck.html                # 16:9 Presentation slide document (Save as PDF Ctrl+P)
│   └── data/demo_readings.json           # 30-step hardware simulation dataset
├── src/
│   ├── app/                              # Next.js 16 App Router pages
│   ├── components/                       # UI components (Flow diagram, Gauges, Map, Relays)
│   ├── context/                          # GridPulse state management & demo replay engine
│   ├── lib/                              # Firebase & predictive analytics algorithms
│   └── types/                            # TypeScript data interfaces
└── package.json
```

---

## 🚀 Quick Start Guide

### 1. Run Web OS Locally
```bash
# Clone repository
git clone <your-repo-url>
cd sih-dashboard

# Install dependencies
npm install

# Run dev server
npm run dev
# Open http://localhost:3000
```

### 2. View / Export Official SIH Presentation Deck
Open `http://localhost:3000/sih_pitch_deck.html` in your browser and click **"Print / Save as PDF"** (`Ctrl + P`).

---

## 🔌 Hardware Specs (BOM Cost ~₹1,250 / $15.60)
* **MCU:** ESP32-S3 Dual-Core 240MHz (WiFi/BLE)
* **DC Voltage:** INA219 / Voltage Divider (0-60V DC)
* **AC Current:** ACS712-30A Hall Effect Sensor
* **Temperature:** DS18B20 1-Wire Digital Probe
* **Solar Irradiance:** TEMT6000 / Photodiode Module
* **Actuators:** 4-Channel 5V Optocoupled Relay Board

---

## 📄 License
MIT License. Developed by **Team Apex Focus** for Smart India Hackathon 2026.
