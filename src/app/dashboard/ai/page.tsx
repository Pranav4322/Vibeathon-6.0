import { ForecastPanel } from "@/components/ai/forecast-panel";
import { OpsAssistant } from "@/components/ai/ops-assistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AIPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Assistant & Forecasting</h1>
      <p className="mt-2 text-slate-500">Gemini-powered operations assistant and demand forecasting.</p>
      
      <Tabs defaultValue="assistant" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="assistant">Ops Assistant</TabsTrigger>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
        </TabsList>
        <TabsContent value="assistant" className="mt-6">
          <OpsAssistant />
        </TabsContent>
        <TabsContent value="forecast" className="mt-6">
          <ForecastPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
