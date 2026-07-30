"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, ChefHat, Clock, Sparkles } from "lucide-react";

type Ticket = {
  num: string;
  status: string;
  statusClass: string;
  table: string;
  items: Array<[string, string]>;
  time: string;
};

const tickets: Ticket[] = [
  {
    num: "#0142",
    status: "Placed",
    statusClass: "bg-amber-500/20 text-amber-700",
    table: "Table 04 · 2 guests",
    items: [["Paneer Tikka", "x1"], ["Garlic Naan", "x2"]],
    time: "00:12",
  },
  {
    num: "#0141",
    status: "Preparing",
    statusClass: "bg-orange-500/15 text-orange-700",
    table: "Table 07 · 4 guests",
    items: [["Butter Chicken", "x1"], ["Jeera Rice", "x2"], ["Lassi", "x2"]],
    time: "03:41",
  },
  {
    num: "#0139",
    status: "Ready",
    statusClass: "bg-emerald-500/15 text-emerald-700",
    table: "Table 02 · 3 guests",
    items: [["Veg Biryani", "x2"], ["Raita", "x1"]],
    time: "06:58",
  },
  {
    num: "#0140",
    status: "Preparing",
    statusClass: "bg-orange-500/15 text-orange-700",
    table: "Table 09 · 2 guests",
    items: [["Masala Dosa", "x2"]],
    time: "02:05",
  },
  {
    num: "#0138",
    status: "Ready",
    statusClass: "bg-emerald-500/15 text-emerald-700",
    table: "Table 11 · 5 guests",
    items: [["Thali Combo", "x3"], ["Sweet Lassi", "x3"]],
    time: "08:22",
  },
];

const features = [
  {
    title: "Real-time operations",
    description:
      "Live order tracking, instant dish availability updates, and synchronized kitchen boards. Everything stays aligned in real time.",
    icon: Clock,
    accent: "from-amber-500 to-orange-500",
    iconClass: "text-amber-600",
    bgClass: "bg-amber-500/15",
  },
  {
    title: "Gemini AI integration",
    description:
      "Chat with your restaurant data through the Ops Assistant and surface demand forecasts for smarter inventory decisions.",
    icon: Sparkles,
    accent: "from-orange-500 to-red-500",
    iconClass: "text-orange-600",
    bgClass: "bg-orange-500/15",
  },
  {
    title: "Smart analytics",
    description:
      "Track wait times, billing activity, and revenue health in one calm, insight-rich view for the whole service floor.",
    icon: BarChart3,
    accent: "from-emerald-500 to-lime-500",
    iconClass: "text-emerald-600",
    bgClass: "bg-emerald-500/15",
  },
];

export default function Home() {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-feature-card]"));
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.index ?? 0);
          setVisibleCards((prev) => (prev.includes(index) ? prev : [...prev, index]));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen bg-[#EDDFC0] text-[#231A0D] selection:bg-amber-500/30"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 900px 500px at 85% -10%, rgba(242,169,59,0.20), transparent 60%), radial-gradient(ellipse 700px 500px at -10% 20%, rgba(214,47,31,0.10), transparent 55%)",
      }}
    >
      <nav className="sticky top-0 z-40 border-b border-[#CBB37F]/70 bg-[rgba(251,241,223,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
              <ChefHat className="h-5 w-5 text-[#231A0D]" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Vibeathon</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9C8E75]">
                Smart Restaurant OS
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full border border-[#CBB37F] bg-transparent px-4 py-2 text-sm font-semibold text-[#231A0D] transition hover:border-amber-500 hover:text-amber-600"
            >
              Staff Login
            </Link>
            <Link
              href="/menu/a1b2c3d4-e5f6-7890-abcd-ef1234567890?table=3"
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-semibold text-[#1B0B00] transition hover:brightness-105"
            >
              Demo Menu
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto flex max-w-7xl flex-col px-4 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-10 lg:pt-20">
        <section className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <h1 className="max-w-3xl text-3.5rem leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The future of <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">dine-in</span> restaurant operations.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[#6B5D48] sm:text-lg sm:leading-8">
              A full-stack, real-time platform that digitizes the in-restaurant experience end-to-end — from customer ordering to kitchen management and AI-powered operational insights.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/menu/a1b2c3d4-e5f6-7890-abcd-ef1234567890?table=3"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-[#1B0B00] transition hover:translate-y-[-1px]"
              >
                Try Customer Menu
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-[#CBB37F] px-6 py-3 text-sm font-semibold text-[#231A0D] text-center transition hover:border-amber-500 hover:bg-white/40"
              >
                Staff Dashboard
              </Link>
            </div>

            <div className="mt-8 grid gap-4 text-sm font-medium text-[#9C8E75] sm:grid-cols-3 sm:gap-6">
              <div>
                <p className="text-lg font-semibold text-[#231A0D]">&lt;40s</p>
                ticket-to-kitchen sync
              </div>
              <div>
                <p className="text-lg font-semibold text-[#231A0D]">100%</p>
                live inventory accuracy
              </div>
              <div>
                <p className="text-lg font-semibold text-[#231A0D]">0</p>
                manual order calls
              </div>
            </div>
          </div>

          <div className="w-full rounded-[24px] border border-[#C7AE79]/70 bg-[#FFF7E6]/90 p-3 shadow-[0_14px_30px_-14px_rgba(35,26,13,0.28)] sm:p-4">
            <div className="hero-rail flex flex-col gap-4">
              {tickets.map((ticket, index) => (
                <div
                  key={ticket.num}
                  className="rounded-[14px] border border-[#C7AE79] bg-[#FFF7E6] p-4 shadow-[0_10px_24px_-16px_rgba(35,26,13,0.3)]"
                  style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.6}deg)` }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-[#231A0D]">{ticket.num}</span>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${ticket.statusClass}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-[#6B5133]">{ticket.table}</p>
                  <ul className="space-y-2 border-y border-dashed border-[#C7AE79] py-2">
                    {ticket.items.map(([name, count]) => (
                      <li key={`${ticket.num}-${name}`} className="flex justify-between text-sm text-[#231A0D]">
                        <span>{name}</span>
                        <span className="font-mono text-[#6B5133]">{count}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-right font-mono text-xs text-[#6B5133]">⏱ {ticket.time}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="mt-16 scroll-mt-24 sm:mt-20">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">On the pass</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Every order, tracked from fire to fork.
            </h2>
            <p className="mt-3 text-lg leading-8 text-[#6B5D48]">
              Three tickets. One synchronized system. No manual handoffs between the counter, the kitchen, and the till.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isVisible = visibleCards.includes(index);
              return (
                <div
                  key={feature.title}
                  data-feature-card
                  data-index={index}
                  className={`relative overflow-hidden rounded-[20px] border border-[#CBB37F] bg-[#F5EAD3] p-5 shadow-[0_12px_28px_-18px_rgba(35,26,13,0.35)] transition-all duration-700 sm:p-7 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                >
                  <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${feature.accent}`} />
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgClass}`}>
                    <Icon className={`h-7 w-7 ${feature.iconClass}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#231A0D]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#6B5D48]">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#CBB37F]/70 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 text-sm text-[#9C8E75] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p>© 2026 The Spice Garden Demo. Vibeathon 6.0 Hackathon.</p>
          <p>Built for the floor, the pass, and the till.</p>
        </div>
      </footer>
    </div>
  );
}
