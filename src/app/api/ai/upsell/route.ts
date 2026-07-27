import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiModel } from "@/lib/ai/gemini-client";
import type { MenuItem } from "@/lib/types/database";

export async function POST(request: Request) {
  try {
    const { restaurantId, cartItems } = await request.json();

    if (!restaurantId || !Array.isArray(cartItems)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Fetch available menu items
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .neq("availability_status", "out");

    const menuItems = data as MenuItem[] | null;

    if (error || !menuItems) {
      console.error("Supabase error fetching menu items:", error);
      return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
    }

    // 2. Filter out items already in the cart
    const cartItemIds = new Set(cartItems.map((item: any) => item.id));
    const availableItemsForUpsell = menuItems.filter(
      (item) => !cartItemIds.has(item.id)
    );

    if (availableItemsForUpsell.length === 0) {
      return NextResponse.json({ recommendation: null });
    }

    // 3. Prompt Gemini
    const prompt = `
      You are an expert AI restaurant assistant designed to increase Average Order Value through smart upselling.
      
      Current Cart:
      ${cartItems.map((item: any) => `- ${item.quantity}x ${item.name}`).join("\n")}

      Available Menu Items to Recommend:
      ${availableItemsForUpsell
        .map((item) => `- ID: ${item.id} | Name: ${item.name} | Price: ${item.price} | Desc: ${item.description || "none"}`)
        .join("\n")}

      Task: Pick exactly ONE item from the "Available Menu Items" that perfectly complements the "Current Cart". 
      For example, if they have a burger, suggest a drink or fries. If they have a main course, suggest a dessert.

      Return a JSON object with this exact structure:
      {
        "recommendedItemId": "the UUID of the item you picked",
        "reason": "A short, enticing 1-sentence reason why they should add it (e.g. 'A cold beverage pairs perfectly with your spicy burger!')"
      }
    `;

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    const parsedResponse = JSON.parse(responseText);

    // Verify the recommended item exists in our filtered list
    const recommendedItem = availableItemsForUpsell.find(
      (item) => item.id === parsedResponse.recommendedItemId
    );

    if (!recommendedItem) {
       return NextResponse.json({ recommendation: null });
    }

    return NextResponse.json({
      recommendation: {
        item: recommendedItem,
        reason: parsedResponse.reason,
      },
    });
  } catch (error) {
    console.error("AI Upsell error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
