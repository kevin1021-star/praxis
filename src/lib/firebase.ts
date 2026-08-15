import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp, 
  Firestore 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-gridpulse.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-gridpulse',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-gridpulse.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456'
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn('Firebase initialization skipped or fallback mode active:', e);
}

export { app, db };

/**
 * Seed Firestore with mock microgrid sites and starting telemetry readings.
 * Called manually from the top navigation bar or programmatically.
 */
export async function seedFirestoreData() {
  if (!db) {
    console.warn('Firestore instance not available. Check Firebase environment credentials.');
    return { success: false, message: 'Firebase credentials not configured.' };
  }

  const initialSites = [
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
      installed_date: '2024-03-15'
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
      installed_date: '2024-05-20'
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
      installed_date: '2023-11-10'
    }
  ];

  try {
    for (const site of initialSites) {
      const siteRef = doc(db, 'sites', site.id);
      await setDoc(siteRef, site, { merge: true });

      const readingsCol = collection(db, 'sites', site.id, 'readings');
      await addDoc(readingsCol, {
        status: 'NORMAL',
        battery_v: site.id === 'village-a' ? 51.8 : site.id === 'village-b' ? 52.4 : 53.5,
        load_a: site.id === 'village-a' ? 18.5 : site.id === 'village-b' ? 12.2 : 31.0,
        irradiance_raw: 820,
        temp_c: 31.5,
        pv_voltage: 128.4,
        pv_current: 16.2,
        ac_out_v: 230.1,
        ac_freq: 50.0,
        cell_delta_mv: 12,
        bms_status: 'FLOAT_CHARGE',
        rssi_dbm: -64,
        ping_ms: 22,
        timestamp: serverTimestamp()
      });
    }
    return { success: true, message: 'Successfully seeded 3 sites and initial readings to Firestore!' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error seeding Firestore:', errorMsg);
    return { success: false, message: `Failed to seed Firestore: ${errorMsg}` };
  }
}
