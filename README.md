# ⚡ GridPulse — Real-Time Renewable Energy Microgrid Monitoring System

> **Smart India Hackathon 2026 Project** | **Problem Statement 4 (Hardware Category)**  
> **Built by Team Praxis**

GridPulse is a real-time monitoring and predictive management system for solar microgrids built specifically for off-grid and rural installations. Our team built this project to solve critical reliability issues in remote microgrids by combining physical ESP32 sensor hardware, local MCU safety interlocks, and a real-time Next.js web dashboard.

---

## 🌟 What Problem Does GridPulse Solve?

In many rural villages across India, solar microgrids operate without continuous telemetry monitoring. When a battery drains or inverter MOSFETs overheat, the system trips unexpectedly—shutting down power for primary healthcare centers, schools, and streetlights.

GridPulse solves this with **3-Tier Real-Time Intelligence**:
1. **Edge Hardware Autonomy:** ESP32 microcontroller continuously reads DC/AC electrical data and executes safety cutoffs locally (within 10ms) even if the rural internet goes down.
2. **Predictive Discharge Trajectory:** Calculates rolling voltage drop ($\Delta V/\text{min}$) to predict exact minutes remaining before a critical battery trip, giving operators time to shed non-essential loads.
3. **Bi-Directional Downlink Control:** Allows central operators to remotely toggle on-site relays for load management and dispatch field repair tickets via WhatsApp & Push Notifications.

---

## 🛠️ Tech Stack & Hardware Components

### **Software Stack**
* **Frontend & Framework:** Next.js 16 (App Router), TypeScript, Tailwind CSS
* **Data Visualization & Animations:** Recharts, Framer Motion, HTML5 Canvas
* **Real-time Database:** Firebase Firestore JS SDK (Live WebSocket stream with simulated fallback)

### **Hardware Components (BOM ~₹1,250 / $15.60 per node)**
* **MCU:** ESP32-S3 Dual-Core 240MHz (WiFi + BLE)
* **DC Voltage Sensor:** INA219 / Resistor Voltage Divider (0-60V DC range)
* **AC Current Sensor:** ACS712-30A Hall-Effect Probe
* **BMS Thermal Sensor:** DS18B20 1-Wire Waterproof Probe
* **Solar Irradiance:** LDR Photodiode Module
* **Actuators:** 4-Channel 5V Optocoupled Relay Board

---

## 📁 Repository Structure

```
├── firmware/
│   └── esp32_microgrid_sensor_node.ino   # C++ ESP32 Microcontroller Firmware
├── HARDWARE_SPEC.md                      # Hardware BOM breakdown & GPIO pinout wiring diagram
├── public/
│   ├── sih_pitch_deck.html                # Official 6-Slide Presentation Deck
│   └── data/demo_readings.json           # 30-Step Chronological Hardware Simulation Dataset
├── src/
│   ├── app/                              # Next.js 16 App Router pages
│   ├── components/                       # UI components (Power Flow Map, Sparklines, GIS Map)
│   ├── context/                          # State management & hardware simulation harness
│   ├── lib/                              # Predictive analytics & Firebase SDK config
│   └── types/                            # TypeScript interfaces
└── package.json
```

---

## 🚀 How to Run Locally

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kevin1021-star/praxis.git
   cd praxis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [`http://localhost:3000`](http://localhost:3000) to view the live dashboard.

---

## 🔌 Hardware Setup & Firmware Upload

1. Open `firmware/esp32_microgrid_sensor_node.ino` in Arduino IDE or PlatformIO.
2. Select target board: **ESP32-S3 Dev Module**.
3. Install required libraries: `Adafruit_INA219`, `OneWire`, `DallasTemperature`, `ArduinoJson`.
4. Update WiFi SSID/Password and flash to your ESP32 board over USB-C.

---

## 👥 Team Praxis
Built with ❤️ for **Smart India Hackathon 2026 (PS 4)**.

* **Repository:** [https://github.com/kevin1021-star/praxis](https://github.com/kevin1021-star/praxis)
* **License:** MIT License
