"use client";

import { useState } from "react";
import { joinWaitlist } from "@/lib/actions/reservation-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ReservationFormProps {
  restaurantId: string;
  onSuccess: (reservation: any) => void;
}

export function ReservationForm({ restaurantId, onSuccess }: ReservationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append("restaurantId", restaurantId);
    
    const result = await joinWaitlist(formData);
    
    setLoading(false);
    
    if (result.error) {
      setError(result.error);
    } else if (result.success && (result as any).reservation) {
      onSuccess((result as any).reservation);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl backdrop-blur-md bg-slate-900/80 border-white/10 text-slate-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">Reserve a Table</CardTitle>
        <CardDescription className="text-center text-slate-400">
          Join our waitlist and get real-time updates.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-slate-300">Your Name</Label>
            <Input id="customerName" name="customerName" required placeholder="John Doe" className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-amber-500" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-slate-300">Phone Number</Label>
            <Input id="customerPhone" name="customerPhone" type="tel" required placeholder="+1 234 567 8900" className="bg-slate-950 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-amber-500" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="partySize" className="text-slate-300">Party Size</Label>
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="border-white/10 bg-slate-950 text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
              >
                -
              </Button>
              <span className="text-xl font-medium w-8 text-center text-white">{partySize}</span>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                className="border-white/10 bg-slate-950 text-white hover:bg-slate-800 hover:text-white"
                onClick={() => setPartySize(Math.min(20, partySize + 1))}
              >
                +
              </Button>
              <input type="hidden" name="partySize" value={partySize} />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all" 
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
