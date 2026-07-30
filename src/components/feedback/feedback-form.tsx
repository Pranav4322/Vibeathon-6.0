"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitFeedback } from "@/lib/actions/feedback-actions";

interface FeedbackFormProps {
  restaurantId: string;
  orderId: string;
  onSuccess?: () => void;
}

export function FeedbackForm({ restaurantId, orderId, onSuccess }: FeedbackFormProps) {
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [ambianceRating, setAmbianceRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (foodRating === 0 || serviceRating === 0 || ambianceRating === 0) {
      toast.error("Please rate all categories before submitting.");
      return;
    }

    setIsSubmitting(true);
    const res = await submitFeedback({
      restaurantId,
      orderId,
      foodRating,
      serviceRating,
      ambianceRating,
      reviewText,
    });

    setIsSubmitting(false);

    if (res.success) {
      toast.success("Thank you for your feedback!");
      onSuccess?.();
    } else {
      toast.error(res.error || "Failed to submit feedback");
    }
  };

  const renderStars = (rating: number, setRating: (val: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                star <= rating ? "fill-orange-500 text-orange-500" : "text-stone-300"
              } hover:text-orange-400`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-semibold mb-6 text-stone-900 text-center">How was your experience?</h3>
      
      <div className="space-y-5 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-stone-700">Food</span>
          {renderStars(foodRating, setFoodRating)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-stone-700">Service</span>
          {renderStars(serviceRating, setServiceRating)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-stone-700">Ambiance</span>
          {renderStars(ambianceRating, setAmbianceRating)}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Any other comments? (Optional)
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Tell us what you loved or how we can improve..."
          className="w-full resize-none h-24 p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-orange-600 text-white hover:bg-orange-700 rounded-xl py-6 text-lg font-medium"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
}
