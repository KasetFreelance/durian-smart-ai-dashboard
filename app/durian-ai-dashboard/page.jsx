"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";

export default function DurianAIDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAIReport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/durian-ai");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("❌ Failed to fetch AI report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIReport();
  }, []);

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">📡 รายงานจาก AI ทุเรียน</h1>

      <Button onClick={fetchAIReport} disabled={loading}>
        {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
        อัปเดตข้อมูลล่าสุด
      </Button>

      {data ? (
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                🌤️ สภาพอากาศ & คำแนะนำ
              </h2>
              <ul className="list-disc pl-6">
                {data.weatherWarnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                🌳 ต้นไม้ที่ควรดูแล
              </h2>
              {data.treeAlerts.length === 0 ? (
                <p>✅ ทุกต้นได้รับการดูแลดีแล้ว</p>
              ) : (
                data.treeAlerts.map((tree, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-semibold text-red-700">
                      {tree.tree}
                    </h3>
                    <ul className="list-disc pl-6 text-red-600">
                      {tree.issues.map((issue, j) => (
                        <li key={j}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : loading ? null : (
        <p>❗ ไม่สามารถโหลดข้อมูล AI ได้</p>
      )}
    </div>
  );
}
