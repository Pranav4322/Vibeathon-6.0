import Link from "next/link";
import { ArrowRight, ChefHat, BarChart3, Clock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-amber-500/30">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
            <ChefHat className="h-6 w-6 text-slate-950" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Vibeathon</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-2"
          >
            Staff Login
          </Link>
          <Link
            href="/menu/a1b2c3d4-e5f6-7890-abcd-ef1234567890?table=3"
            className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 border border-white/10"
          >
            Demo Menu
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center pb-24 pt-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-400 mb-8 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="mr-2 h-4 w-4" />
            Powered by Gemini AI
          </div>
        </div>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 bg-gradient-to-br from-white via-white to-slate-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both leading-[1.1]">
          The future of dine-in <br /> restaurant operations.
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
          A full-stack, real-time platform that digitizes the in-restaurant experience end-to-end — from customer ordering to kitchen management and AI-powered operational insights.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
          <Link
            href="/menu/a1b2c3d4-e5f6-7890-abcd-ef1234567890?table=3"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-bold text-slate-950 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
          >
            Try Customer Menu
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30"
          >
            Staff Dashboard
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-32 text-left animate-in fade-in duration-1000 delay-700 fill-mode-both">
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/20">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 transition-transform group-hover:scale-110">
              <Clock className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-time Operations</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Live order tracking, instant dish availability updates, and synchronized kanban boards for the kitchen. Everything happens in real-time.
            </p>
          </div>
          
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 transition-transform group-hover:scale-110 relative z-10">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 relative z-10">Gemini AI Integration</h3>
            <p className="text-slate-400 text-sm leading-relaxed relative z-10">
              Chat with your restaurant's data using the Ops Assistant, and get smart demand forecasting for your inventory.
            </p>
          </div>
          
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-white/20">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 transition-transform group-hover:scale-110">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Smart Analytics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automated table wait-time alerts, dynamic billing calculations, and rich dashboards to monitor your daily revenue.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500 bg-slate-950">
        <p>© 2026 The Spice Garden Demo. Vibeathon 6.0 Hackathon.</p>
      </footer>
    </div>
  );
}
