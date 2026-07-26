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
    <Card className="w-full max-w-md mx-auto shadow-lg backdrop-blur-sm bg-white/95 border-amber-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Reserve a Table</CardTitle>
        <CardDescription className="text-center">
          Join our waitlist and get real-time updates.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Your Name</Label>
            <Input id="customerName" name="customerName" required placeholder="John Doe" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input id="customerPhone" name="customerPhone" type="tel" required placeholder="+1 234 567 8900" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="partySize">Party Size</Label>
            <div className="flex items-center gap-4">
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => setPartySize(Math.max(1, partySize - 1))}
              >
                -
              </Button>
              <span className="text-xl font-medium w-8 text-center">{partySize}</span>
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={() => setPartySize(Math.min(20, partySize + 1))}
              >
                +
              </Button>
              <input type="hidden" name="partySize" value={partySize} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all" 
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
