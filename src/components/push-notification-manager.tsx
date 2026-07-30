"use client";

import { useState, useEffect } from "react";
import { savePushSubscription } from "@/lib/actions/push-actions";
import { Button } from "@/components/ui/button";
import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";

// This requires NEXT_PUBLIC_VAPID_PUBLIC_KEY in .env.local
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager({ orderId }: { orderId: string }) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      
      // If we already have a subscription locally, ensure backend has it
      if (sub && orderId) {
        savePushSubscription(orderId, JSON.parse(JSON.stringify(sub)));
      }
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }

  async function subscribeToPush() {
    if (!vapidPublicKey) {
      toast.error("VAPID public key is missing. Check your environment variables.");
      return;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      setSubscription(sub);

      const res = await savePushSubscription(orderId, JSON.parse(JSON.stringify(sub)));
      if (res.success) {
        toast.success("Notifications enabled! We'll alert you when your order is ready.");
      } else {
        toast.error("Failed to save subscription: " + res.error);
      }
    } catch (error: any) {
      console.error("Failed to subscribe:", error);
      toast.error("Permission denied or error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <Bell className="w-4 h-4" /> Push notifications are not supported in this browser.
      </p>
    );
  }

  if (subscription) {
    return (
      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 text-sm font-medium">
        <BellRing className="w-4 h-4 animate-pulse" />
        Notifications enabled
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={subscribeToPush} 
      disabled={loading}
      className="w-full sm:w-auto"
    >
      <Bell className="w-4 h-4 mr-2" />
      {loading ? "Enabling..." : "Enable Notifications"}
    </Button>
  );
}
