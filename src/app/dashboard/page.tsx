import { redirect } from "next/navigation";

export default function DashboardPage() {
  // We haven't built the full analytics dashboard yet (Phase 9).
  // For now, redirect logged-in staff directly to the Kitchen Orders kanban board.
  redirect("/staff/orders");
}
