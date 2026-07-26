import { ForecastPanel } from "@/components/ai/forecast-panel";

export default function AIPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Assistant & Forecasting</h1>
      <p className="mt-2 text-slate-500">Gemini-powered operations assistant and demand forecasting.</p>
      
      <div className="mt-8 grid gap-8 md:grid-cols-1">
        <ForecastPanel />
      </div>
    </div>
  );
}
