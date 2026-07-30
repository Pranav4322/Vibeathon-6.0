"use server";

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function generateUpsellForOrder(orderId: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Skipping AI upselling.");
    return null;
  }

  try {
    const supabase = await createClient();

    // Fetch order items and menu items
    const { data: orderItems, error: itemsErr } = await supabase
      .from("order_items")
      .select(`
        quantity,
        menu_items ( name, course_category )
      `)
      .eq("order_id", orderId);

    if (itemsErr || !orderItems || orderItems.length === 0) return null;

    // Fetch full menu to recommend from
    const { data: menu, error: menuErr } = await supabase
      .from("menu_items")
      .select("name, course_category")
      .eq("is_available", true);

    if (menuErr || !menu || menu.length === 0) return null;

    // Format for Gemini
    const currentOrderText = orderItems
      .map((item: any) => `${item.quantity}x ${item.menu_items?.name} (${item.menu_items?.course_category})`)
      .join(", ");

    const availableDessertsAndDrinks = menu
      .filter((m: any) => m.course_category === "dessert" || m.course_category === "beverage")
      .map((m: any) => m.name)
      .join(", ");

    if (!availableDessertsAndDrinks) return null; // Nothing to upsell

    const prompt = `
You are a smart, polite restaurant AI waiter. The customer has currently ordered: ${currentOrderText}. 
They have just been served their food.
Recommend one complementary dessert or drink from this available list: ${availableDessertsAndDrinks}.
Keep your recommendation strictly to ONE short, friendly sentence. (e.g., "Ready for dessert? Tap here to add a sizzling Brownie to your order!")
Do not use emojis. Do not greet them. Just provide the short sentence.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const recommendation = response.text?.trim() || null;
    return recommendation;
  } catch (error) {
    console.error("AI Upsell Generation failed:", error);
    return null;
  }
}
