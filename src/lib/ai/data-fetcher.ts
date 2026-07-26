import { createClient } from '@/lib/supabase/server';

export async function fetchOpsContext() {
  const supabase = await createClient();

  // Fetch active orders (not billed)
  const { data: activeOrders } = await supabase
    .from('orders')
    .select(`
      id,
      table_id,
      status,
      placed_at,
      total_amount,
      tables(table_number),
      order_items(
        quantity,
        menu_items(name, price)
      )
    `)
    .neq('status', 'billed');

  // Fetch today's completed orders
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todaysCompletedOrders } = await supabase
    .from('orders')
    .select(`
      id,
      total_amount,
      billed_at,
      order_items(
        quantity,
        menu_items(name)
      )
    `)
    .eq('status', 'billed')
    .gte('billed_at', today.toISOString());

  // Structure the data to pass to Gemini
  const context = {
    currentTime: new Date().toISOString(),
    activeOrders: (activeOrders as any[])?.map(order => ({
      orderId: order.id,
      tableNumber: order.tables?.table_number,
      status: order.status,
      placedAt: order.placed_at,
      totalAmount: order.total_amount,
      items: (order.order_items as any[])?.map(item => ({
        name: item.menu_items?.name,
        quantity: item.quantity
      }))
    })),
    todaysSales: {
      totalOrders: todaysCompletedOrders?.length || 0,
      totalRevenue: (todaysCompletedOrders as any[])?.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0) || 0,
      recentCompletedOrders: (todaysCompletedOrders as any[])?.slice(0, 10).map(o => ({
        id: o.id,
        amount: o.total_amount,
        items: (o.order_items as any[])?.map(item => ({
          name: item.menu_items?.name,
          quantity: item.quantity
        }))
      }))
    }
  };

  return context;
}
