
// durian_ai_analysis.js
// ระบบ AI วิเคราะห์การดูแลต้นทุเรียนอัตโนมัติ พร้อมเชื่อม API

import axios from "axios";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-zklfuipACwzZlbmH4ng_LWEShEQifuw",
  authDomain: "durian-smart-garden.firebaseapp.com",
  databaseURL: "https://durian-smart-garden-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "durian-smart-garden",
  storageBucket: "durian-smart-garden.firebasestorage.app",
  messagingSenderId: "402323324992",
  appId: "1:402323324992:web:6a20229e19bf3b3e335fa5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const LAT = 12.9001;
const LON = 101.7005;

async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_API_KEY}`;
  const res = await axios.get(url);
  const list = res.data.list.slice(0, 3);
  return list.map(item => ({
    day: new Date(item.dt * 1000).toLocaleDateString(),
    humidity: item.main.humidity,
    rain: item.rain?.["3h"] || 0,
    windSpeed: item.wind.speed,
  }));
}

async function fetchTrees() {
  const snapshot = await get(ref(db, "durian-trees"));
  const data = snapshot.val();
  return Object.entries(data).map(([id, tree]) => ({
    id,
    name: tree.name,
    lastWatered: tree.lastWateredDaysAgo,
    lastFertilized: tree.lastFertilizedDaysAgo,
    lastSprayed: tree.lastSprayedDaysAgo,
    insecticideGroupCount: tree.insecticideRepeatCount,
  }));
}

function analyzeWeather(forecast) {
  const today = forecast[0];
  const tomorrow = forecast[1];
  const warnings = [];

  if (today.humidity < 50 && tomorrow.rain === 0) {
    warnings.push("🌱 ความชื้นต่ำ ควรรดน้ำต้นไม้ภายใน 2 วัน");
  }
  if (today.rain > 0 || tomorrow.rain > 0) {
    warnings.push("🌧️ มีฝนตก งดฉีดยาหรือใส่ปุ๋ยวันนี้");
  }
  if (today.windSpeed > 30) {
    warnings.push("🌪️ ลมแรง! เตรียมป้องกันพายุ");
  }
  return warnings;
}

function analyzeTrees(trees, forecast) {
  const todayRain = forecast[0].rain;
  return trees.map(tree => {
    const issues = [];
    if (tree.lastWatered > 14) {
      issues.push("❗ ไม่ได้รับน้ำมากกว่า 14 วัน");
    }
    if (tree.insecticideGroupCount > 3) {
      issues.push("⚠️ ใช้สารกลุ่มเดิมเกิน 3 ครั้ง เสี่ยงแมลงดื้อยา");
    }
    if (tree.lastFertilized < 3 && todayRain > 0) {
      issues.push("💧 ใส่ปุ๋ยแล้ว แต่ฝนตก เสี่ยงปุ๋ยถูกชะล้าง");
    }
    return { tree: tree.name, issues };
  }).filter(t => t.issues.length > 0);
}

export async function runDurianAI() {
  const weather = await fetchWeather();
  const trees = await fetchTrees();
  const warnings = analyzeWeather(weather);
  const treeAlerts = analyzeTrees(trees, weather);
  return {
    weatherWarnings: warnings,
    treeAlerts,
  };
}
