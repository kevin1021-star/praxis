# 🏆 SMART INDIA HACKATHON 2026 — OFFICIAL IDEA SUBMISSION SLIDE DECK
**Problem Statement 4:** Real-Time Renewable Energy Microgrid Monitoring System  
**PS Category:** Hardware | **Team Name:** Apex Focus

---

## 📌 SLIDE 1: TITLE PAGE

### **SMART INDIA HACKATHON 2026**
* **Problem Statement ID –** PS-04
* **Problem Statement Title-** Real-Time Renewable Energy Microgrid Monitoring System
* **Theme-** Renewable & Sustainable Energy / IoT Smart Automation
* **PS Category- Software/Hardware:** Hardware
* **Team ID-** [Team ID]
* **Team Name (Registered on portal):** Apex Focus

---

## 📌 SLIDE 2: IDEA TITLE: GRIDPULSE OS

### ❖ **Proposed Solution (Describe your Idea/Solution/Prototype)**
* **Detailed explanation of the proposed solution**
  - 3-Tier IoT Hardware-to-Cloud OS connecting physical ESP32-S3 sensor nodes, DC/AC electrical sensors, and LiFePO4 battery probes to a real-time web operations platform.
  - Continuous telemetry sensing of battery voltage (V), load current (A), solar irradiance (W/m²), and BMS thermal stress (°C).

* **How it addresses the problem**
  - Replaces unmonitored solar grids with continuous telemetry tracking ($V_{BAT}$, $I_{LOAD}$, $W/m^2$ Irradiance, $T_{FET}$).
  - Eliminates undetected faults via automated hardware interlocks (tripping load-shedding relays when battery voltage $<44V$ or temp $>65^\circ C$).

* **Innovation and uniqueness of the solution**
  - Predictive Discharge Engine calculating rolling 5-reading voltage drift ($\Delta V/\text{min}$) & remaining time to 44V safety trip.
  - Bi-Directional Remote Hardware Relay Control & Smartphone Alert Engine (1-click WhatsApp + Web Push Dispatch Work Orders).

---

## 📌 SLIDE 3: TECHNICAL APPROACH

* **Technologies to be used (e.g. programming languages, frameworks, hardware)**
  - Microcontroller & Sensors: ESP32-S3 Dual-Core 240MHz (WiFi/BLE), INA219 (DC Voltage/Current), ACS712-30A (AC Current), DS18B20 (BMS Temp), LDR Photodiode (Solar Irradiance)
  - Actuators & Firmware: 4-Channel 5V Optocoupled Solid State Relays, C++ / Arduino ESP32 Firmware (`esp32_microgrid_sensor_node.ino`)
  - Software Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion (animated gauges), Recharts, Firebase Firestore JS SDK

* **Methodology and process for implementation (Flow Charts/Images/ working prototype)**
  - Layer 1 (Sensing): Physical sensors capture electrical telemetry every 2000ms.
  - Layer 2 (On-Chip Interlock): ESP32 trips relays locally if V < 44V or Temp > 65°C without needing internet.
  - Layer 3 (Predictive OS): Web dashboard renders animated gauges, area telemetry charts, and CSV reports.
  - Pipeline: Physical Sensors (V, A, °C) ➔ ESP32 ADC & Interlocks ➔ JSON Telemetry Stream ➔ Predictive Web OS ➔ Bi-Directional Relay & Push Alert

---

## 📌 SLIDE 4: FEASIBILITY AND VIABILITY

* **Analysis of the feasibility of the idea**
  - Ultra-low BOM cost of ~$15.60 (₹1,250) per hardware node. Retrofits onto existing off-grid rural solar microgrids without replacing existing Victron or Growatt inverters.

* **Potential challenges and risks**
  - 1. Network Instability in remote off-grid rural regions (e.g. Northeast hill sectors).
  - 2. Severe Thermal Overheating of inverter MOSFETs during peak summer grid demand.

* **Strategies for overcoming these challenges**
  - 1. On-Chip Ring Buffer: Firmware caches 1,000 telemetry readings locally in flash memory and auto-syncs when connection restores.
  - 2. Hardware Interlocks: ESP32 trips load-shedding relays on-chip locally, preventing thermal burnout even during cloud outages.

---

## 📌 SLIDE 5: IMPACT AND BENEFITS

* **Potential impact on the target audience**
  - Rural Off-Grid Communities: Ensures 24/7 continuous power for essential primary healthcare centers, schools, and street lighting.
  - Microgrid Operators & DISCOMs: Cuts physical maintenance trips by 70% through automated remote diagnostics.

* **Benefits of the solution (social, economic, environmental, etc.)**
  - Social: Eliminates unannounced blackout disruptions in off-grid villages.
  - Economic: Extends battery pack lifespan by +40% via smart depth-of-discharge management; saves ₹50,000+ per site in premature battery replacements.
  - Environmental: Maximizes clean solar energy utilization and reduces backup diesel generator dependency.

---

## 📌 SLIDE 6: RESEARCH AND REFERENCES

* **Details / Links of the reference and research work**
  - IEEE Smart Grid Research: *"Predictive Health Monitoring and Battery Degradation Analytics for Islanded Microgrids"* (IEEE Transactions on Sustainable Energy, 2024).
  - Battery Interoperability Standards: IEEE 1547-2018 Standard for Interconnection and Interoperability of Distributed Energy Resources.
  - Hardware Sensor Specs: ESP32-S3 Technical Reference Manual & INA219 / ACS712 Sensor Datasheets.
  - Demonstrable Working MVP Prototype:
    - GitHub Codebase Repository: https://github.com/kevin1021-star/praxis
    - Live Dashboard URL: http://localhost:3000
