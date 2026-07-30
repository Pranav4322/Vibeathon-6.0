"use server";

import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";

// Configure web-push with VAPID keys
// This requires NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env.local
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:admin@vibeathon.com",
    vapidPublicKey,
    vapidPrivateKey
  );
} else {
  console.warn("Web Push VAPID keys are missing. Push notifications will fail.");
}

export async function savePushSubscription(orderId: string, subscription: any) {
  if (!orderId || !subscription) return { success: false, error: "Missing data" };

  try {
    const supabase = await createClient();
    
    // We cast to 'any' because push_subscriptions isn't in database.ts yet
    const { error } = await (supabase as any).from("push_subscriptions").upsert(
      {
        order_id: orderId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      { onConflict: "order_id, endpoint" }
    );

    if (error) {
      console.error("Error saving push subscription:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Failed to save push subscription:", err);
    return { success: false, error: err.message };
  }
}

export async function sendPushNotificationToOrder(
  orderId: string,
  payload: { title: string; body: string; url?: string; actions?: any[] }
) {
  try {
    const supabase = await createClient();

    // Get all subscriptions for this order
    const { data: subs, error } = await (supabase as any)
      .from("push_subscriptions")
      .select("*")
      .eq("order_id", orderId);

    if (error || !subs || subs.length === 0) {
      console.log(`No push subscriptions found for order ${orderId}`);
      return { success: false, message: "No subscribers" };
    }

    const notifications = subs.map((sub: any) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      return webpush
        .sendNotification(pushSubscription, JSON.stringify(payload))
        .catch(async (err) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log("Subscription has expired or is no longer valid:", err);
            await (supabase as any)
              .from("push_subscriptions")
              .delete()
              .eq("id", sub.id);
          } else {
            console.error("Error sending push notification:", err);
          }
        });
    });

    await Promise.all(notifications);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to send push notification:", error);
    return { success: false, error: error.message };
  }
}
