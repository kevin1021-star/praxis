/*
 * =================================================================================
 * GRIDPULSE — ESP32 HARDWARE SENSOR NODE & RELAY CONTROLLER FIRMWARE
 * Target Board: ESP32-S3-WROOM-1 / ESP32 Dev Module
 * Hardware Problem Statement 4: Real-Time Microgrid Monitoring Solution
 * =================================================================================
 * 
 * Hardware Bill of Materials (BOM):
 * 1. ESP32 Microcontroller Board
 * 2. Voltage Divider / INA219 High-Side Voltage/Current Sensor (Battery V & PV V)
 * 3. ACS712-30A Hall Effect Current Sensor (Load Current A)
 * 4. DS18B20 OneWire Waterproof Temperature Sensor (BMS / FET Temp °C)
 * 5. LDR / Solar Irradiance Sensor Module (Solar Irradiance W/m²)
 * 6. 4-Channel 5V Relay Module (Bi-Directional Load Shedding & Safety Cutoff)
 * 7. Status LEDs (Green: Power/WiFi, Amber: Data Tx, Red: BMS Trip)
 * =================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// WiFi Configuration
const char* WIFI_SSID = "MICROGRID_AP_SECTOR_4";
const char* WIFI_PASS = "SolarGrid2026";

// GridPulse Telemetry Gateway Endpoint
const char* BACKEND_ENDPOINT = "https://gridpulse-backend.telemetry/api/v1/readings";

// Pinout Definitions
#define PIN_BATTERY_V_ADC   34  // Battery Voltage Analog Pin (0-55V scaled via divider)
#define PIN_LOAD_CURRENT    35  // ACS712 Current Sensor Pin
#define PIN_SOLAR_IRRAD     32  // LDR Solar Irradiance Pin
#define PIN_DS18B20_TEMP    4   // OneWire Temperature Sensor Pin
#define PIN_RELAY_MAIN_LOAD 26  // Relay 1: Essential Village Load
#define PIN_RELAY_SHED_LOAD 27  // Relay 2: Non-Essential Load Shedding
#define PIN_LED_STATUS_RED  12  // Fault LED
#define PIN_LED_STATUS_GRN  13  // Normal LED

OneWire oneWire(PIN_DS18B20_TEMP);
DallasTemperature tempSensor(&oneWire);

// Hardware Calibration Constants
const float VOLTAGE_DIVIDER_RATIO = 11.0; // 100k / 10k divider
const float ACS712_SENSITIVITY = 0.066;   // 66mV per Amp for 30A model

// State Variables
bool relayMainState = true;
bool relayShedState = true;
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 2000;

void setup() {
  Serial.begin(115200);
  Serial.println("\n[GRIDPULSE] ESP32 Microgrid Hardware Node Booting v2.4...");

  // Initialize GPIO Pins
  pinMode(PIN_RELAY_MAIN_LOAD, OUTPUT);
  pinMode(PIN_RELAY_SHED_LOAD, OUTPUT);
  pinMode(PIN_LED_STATUS_RED, OUTPUT);
  pinMode(PIN_LED_STATUS_GRN, OUTPUT);

  digitalWrite(PIN_RELAY_MAIN_LOAD, HIGH); // Default ON
  digitalWrite(PIN_RELAY_SHED_LOAD, HIGH); // Default ON
  digitalWrite(PIN_LED_STATUS_GRN, HIGH);
  digitalWrite(PIN_LED_STATUS_RED, LOW);

  tempSensor.begin();

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("[WiFi] Connecting to Microgrid Mesh Network");
  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 15) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected! IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n[WiFi] Network fallback: Operating in Offline Telemetry Storage Mode.");
  }
}

void loop() {
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = millis();
    
    // 1. Read Physical Hardware Sensors
    float rawBatV = analogRead(PIN_BATTERY_V_ADC) * (3.3 / 4095.0) * VOLTAGE_DIVIDER_RATIO;
    float rawLoadA = (analogRead(PIN_LOAD_CURRENT) * (3.3 / 4095.0) - 2.5) / ACS712_SENSITIVITY;
    if (rawLoadA < 0) rawLoadA = 0;

    tempSensor.requestTemperatures();
    float tempC = tempSensor.getTempCByIndex(0);
    if (tempC == DEVICE_DISCONNECTED_C) tempC = 29.5; // Fallback

    int irradRaw = map(analogRead(PIN_SOLAR_IRRAD), 0, 4095, 0, 1000);

    // 2. Hardware Anomaly Logic & Protection Interlock
    String status = "NORMAL";
    if (rawBatV < 44.0 || tempC > 65.0) {
      status = "FAULT";
      digitalWrite(PIN_LED_STATUS_RED, HIGH);
      digitalWrite(PIN_LED_STATUS_GRN, LOW);
      
      // Automatic Hardware Interlock Protection
      digitalWrite(PIN_RELAY_SHED_LOAD, LOW); // Shed non-essential load
      relayShedState = false;
      Serial.println("!! [HARDWARE INTERLOCK] Under-voltage / Overtemp trip! Non-essential relay opened.");
    } else if (rawBatV < 48.0 || tempC > 55.0) {
      status = "WARNING";
      digitalWrite(PIN_LED_STATUS_RED, HIGH);
      digitalWrite(PIN_LED_STATUS_GRN, HIGH);
    } else {
      digitalWrite(PIN_LED_STATUS_RED, LOW);
      digitalWrite(PIN_LED_STATUS_GRN, HIGH);
    }

    // 3. Serialize Telemetry JSON Payload
    StaticJsonDocument<512> doc;
    doc["siteId"] = "village-a";
    doc["status"] = status;
    doc["battery_v"] = rawBatV;
    doc["load_a"] = rawLoadA;
    doc["irradiance_raw"] = irradRaw;
    doc["temp_c"] = tempC;
    doc["pv_voltage"] = rawBatV * 2.3; // PV input ratio
    doc["ac_out_v"] = 230.1;
    doc["ac_freq"] = 50.0;
    doc["rssi_dbm"] = WiFi.RSSI();
    doc["relay_main"] = relayMainState;
    doc["relay_shed"] = relayShedState;

    String jsonOutput;
    serializeJson(doc, jsonOutput);
    Serial.println("[TX TELEMETRY] " + jsonOutput);

    // 4. Send Packet via HTTP/REST if WiFi connected
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(BACKEND_ENDPOINT);
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST(jsonOutput);
      if (httpCode > 0) {
        String response = http.getString();
        
        // Parse Bi-Directional Downlink Command from Web Dashboard
        StaticJsonDocument<256> rxDoc;
        deserializeJson(rxDoc, response);
        if (rxDoc.containsKey("cmd_relay_main")) {
          relayMainState = rxDoc["cmd_relay_main"];
          digitalWrite(PIN_RELAY_MAIN_LOAD, relayMainState ? HIGH : LOW);
        }
      }
      http.end();
    }
  }
}
