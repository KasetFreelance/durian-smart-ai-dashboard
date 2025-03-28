
// pages/api/durian-ai.js
import { runDurianAI } from "@/lib/durian_ai_analysis";

export default async function handler(req, res) {
  try {
    const result = await runDurianAI();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error running Durian AI:", error);
    res.status(500).json({ error: "ไม่สามารถวิเคราะห์ข้อมูลได้" });
  }
}
