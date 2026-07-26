import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/ai/gemini-client';
import { FORECAST_PROMPT } from '@/lib/ai/forecast-prompt';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch order items from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        placed_at,
        order_items (
          menu_item_id,
          quantity,
          menu_items (
            name
          )
        )
      `)
      .gte('placed_at', sevenDaysAgo.toISOString());
      
    if (error) throw error;
    
    // Aggregate the data
    const aggregated: Record<string, { count: number, daysSeen: Set<string> }> = {};
    
    (orders || []).forEach((order: any) => {
      const dateStr = new Date(order.placed_at).toDateString();
      order.order_items?.forEach((item: any) => {
        const name = item.menu_items?.name;
        if (name) {
          if (!aggregated[name]) {
            aggregated[name] = { count: 0, daysSeen: new Set() };
          }
          aggregated[name].count += item.quantity;
          aggregated[name].daysSeen.add(dateStr);
        }
      });
    });
    
    const summary = Object.entries(aggregated).map(([name, data]) => ({
      dishName: name,
      totalOrdersLast7Days: data.count,
      avgOrdersPerDay: Math.round(data.count / 7)
    }));
    
    if (summary.length === 0) {
        return NextResponse.json({
            forecast: [],
            insight: "Not enough data to generate a forecast. Please wait until more orders are placed."
        });
    }

    const dataContext = JSON.stringify(summary, null, 2);
    const prompt = `${FORECAST_PROMPT}\n\nHere is the recent order data:\n${dataContext}`;
    
    const result = await geminiModel.generateContent(prompt);
    let text = result.response.text();
    
    // Clean up potential markdown formatting from the response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
    
  } catch (error) {
    console.error('Forecast error:', error);
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 });
  }
}
