"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ForecastItem = {
  dishName: string;
  avgPerDay: number;
  predicted: number;
  confidence: "High" | "Medium" | "Low";
  reasoning: string;
};

type ForecastData = {
  forecast: ForecastItem[];
  insight: string;
};

export function ForecastPanel() {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/forecast");
      if (!res.ok) throw new Error("Failed to generate forecast");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">High</Badge>;
      case "medium":
        return <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">Medium</Badge>;
      case "low":
        return <Badge variant="destructive">Low</Badge>;
      default:
        return <Badge variant="outline">{confidence}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <TrendingUp className="h-6 w-6 text-amber-500" />
              AI Demand Forecast
            </CardTitle>
            <CardDescription className="mt-1">
              Based on the last 7 days of order data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchForecast} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !data && (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 text-slate-500">
            <RefreshCcw className="h-8 w-8 animate-spin text-amber-500" />
            <p>Analyzing historical data and generating forecast...</p>
          </div>
        )}
        
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            <p className="font-medium">Error generating forecast</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {data && data.forecast.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
            <p>{data.insight}</p>
          </div>
        )}

        {data && data.forecast.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 font-semibold text-slate-700">Dinner Service Tonight (6 PM — 11 PM)</h3>
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dish</th>
                      <th className="px-4 py-3 font-medium">Avg/Day</th>
                      <th className="px-4 py-3 font-medium">Predicted</th>
                      <th className="px-4 py-3 font-medium">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {data.forecast.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50" title={item.reasoning}>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.dishName}</td>
                        <td className="px-4 py-3 text-slate-600">{item.avgPerDay}</td>
                        <td className="px-4 py-3 font-semibold text-amber-600">{item.predicted} servings</td>
                        <td className="px-4 py-3">{getConfidenceBadge(item.confidence)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-4 rounded-lg bg-indigo-50 p-4 text-indigo-900">
              <Sparkles className="h-6 w-6 flex-shrink-0 text-indigo-500" />
              <div>
                <p className="font-semibold text-indigo-800">AI Insight</p>
                <p className="text-sm mt-1">{data.insight}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
