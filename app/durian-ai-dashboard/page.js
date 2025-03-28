"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function DurianAIDashboard() {
  console.log("🚀 DurianAIDashboard component loaded");

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
      <h1 className="text-2xl font-bold">📊 รายงานจาก AI ทุเรียน</h1>
      <Button onClick={fetchAIReport} disabled={loading}>
        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
        โหลดข้อมูลใหม่
      </Button>

      {data && (
        <Card>
          <CardContent className="p-4">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
