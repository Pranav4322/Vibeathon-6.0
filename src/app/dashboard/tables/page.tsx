import { EmptyState } from "@/components/ui/empty-state";

export default function TablesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tables</h1>
      <p className="mt-2 text-slate-500">Manage restaurant tables and seating.</p>
      <div className="mt-8">
        <EmptyState
          title="Table Management"
          description="Table management features are coming in a future phase."
        />
      </div>
    </div>
  );
}
