import { getFeedbackStats } from "@/lib/actions/feedback-actions";
import { createClient } from "@/lib/supabase/server";
import { Star, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const { data: restaurant } = await supabase.from("restaurants").select("id").limit(1).single();
  const restaurantId = (restaurant as { id: string } | null)?.id;

  if (!restaurantId) {
    return <div className="p-8">No restaurant found.</div>;
  }

  const { data: stats, error } = await getFeedbackStats(restaurantId);

  if (error || !stats) {
    return <div className="p-8 text-red-500">Failed to load feedback stats.</div>;
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-orange-500 text-orange-500" : "text-stone-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customer Feedback</h1>
        <p className="mt-2 text-slate-500">See what your customers are saying about their dining experience.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-sm font-medium text-stone-500 mb-2">Total Reviews</h3>
          <p className="text-3xl font-bold text-stone-900">{stats.count}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-sm font-medium text-stone-500 mb-2">Avg Food Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-stone-900">{stats.avgFood}</p>
            <Star className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-sm font-medium text-stone-500 mb-2">Avg Service Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-stone-900">{stats.avgService}</p>
            <Star className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
          <h3 className="text-sm font-medium text-stone-500 mb-2">Avg Ambiance Rating</h3>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-stone-900">{stats.avgAmbiance}</p>
            <Star className="w-6 h-6 fill-orange-500 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Reviews</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.recentReviews.length === 0 ? (
          <p className="text-stone-500 col-span-full">No feedback submitted yet.</p>
        ) : (
          stats.recentReviews.map((review: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-stone-800">{review.customer_name}</span>
                <span className="text-xs text-stone-400">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Food</span>
                  {renderStars(review.food_rating)}
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Service</span>
                  {renderStars(review.service_rating)}
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Ambiance</span>
                  {renderStars(review.ambiance_rating)}
                </div>
              </div>
              {review.review_text && (
                <div className="mt-auto pt-4 border-t border-stone-100 flex gap-2 text-stone-600 text-sm italic">
                  <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-stone-400" />
                  <p>"{review.review_text}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
