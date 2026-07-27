"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/* ── Demo route constants ─────────────────────────────────────── */
const DEMO_MENU_HREF =
  "/menu/a1b2c3d4-e5f6-7890-abcd-ef1234567890?table=3";

/* ── Ticket data (mirrors the HTML file) ─────────────────────── */
const TICKETS = [
  {
    num: "#0142",
    status: "PLACED",
    statusCls: "st-placed",
    table: "TABLE 04 · 2 GUESTS",
    items: [
      ["Paneer Tikka", "x1"],
      ["Garlic Naan", "x2"],
    ],
    time: "00:12",
    tilt: -0.6,
  },
  {
    num: "#0141",
    status: "PREPARING",
    statusCls: "st-preparing",
    table: "TABLE 07 · 4 GUESTS",
    items: [
      ["Butter Chicken", "x1"],
      ["Jeera Rice", "x2"],
      ["Lassi", "x2"],
    ],
    time: "03:41",
    tilt: 0.6,
  },
  {
    num: "#0139",
    status: "READY",
    statusCls: "st-ready",
    table: "TABLE 02 · 3 GUESTS",
    items: [
      ["Veg Biryani", "x2"],
      ["Raita", "x1"],
    ],
    time: "06:58",
    tilt: -0.6,
  },
  {
    num: "#0140",
    status: "PREPARING",
    statusCls: "st-preparing",
    table: "TABLE 09 · 2 GUESTS",
    items: [["Masala Dosa", "x2"]],
    time: "02:05",
    tilt: 0.6,
  },
  {
    num: "#0138",
    status: "READY",
    statusCls: "st-ready",
    table: "TABLE 11 · 5 GUESTS",
    items: [
      ["Thali Combo", "x3"],
      ["Sweet Lassi", "x3"],
    ],
    time: "08:22",
    tilt: -0.6,
  },
] as const;

/* ── Ticket Card ──────────────────────────────────────────────── */
function Ticket({
  ticket,
}: {
  ticket: (typeof TICKETS)[number];
}) {
  const statusLabel: Record<string, string> = {
    "st-placed": "PLACED",
    "st-preparing": "PREPARING",
    "st-ready": "READY",
  };

  const statusStyle: Record<string, React.CSSProperties> = {
    "st-placed": {
      background: "rgba(242,169,59,0.30)",
      color: "#7A4D00",
    },
    "st-preparing": {
      background: "rgba(214,47,31,0.15)",
      color: "#A81E10",
    },
    "st-ready": {
      background: "rgba(30,158,90,0.17)",
      color: "#0F6E36",
    },
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#FFF7E6",
        color: "var(--vb-paper-ink)",
        border: "1px solid var(--vb-paper-line)",
        borderRadius: "10px",
        padding: "16px 18px 14px",
        boxShadow: "0 14px 30px -14px rgba(35,26,13,0.28)",
        transform: `rotate(${ticket.tilt}deg)`,
      }}
    >
      {/* Perforation holes */}
      <span
        style={{
          position: "absolute",
          top: -8,
          left: 16,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "var(--vb-bg)",
          border: "1px solid var(--vb-paper-line)",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: -8,
          right: 16,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "var(--vb-bg)",
          border: "1px solid var(--vb-paper-line)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 9,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {ticket.num}
        </span>
        <span
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 9px",
            borderRadius: 100,
            fontWeight: 600,
            ...statusStyle[ticket.statusCls],
          }}
        >
          {statusLabel[ticket.statusCls]}
        </span>
      </div>

      {/* Table info */}
      <div
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 11,
          color: "#6B5133",
          marginBottom: 10,
          letterSpacing: "0.03em",
        }}
      >
        {ticket.table}
      </div>

      {/* Items list */}
      <ul
        style={{
          listStyle: "none",
          margin: "0 0 10px",
          padding: 0,
          borderTop: "1px dashed var(--vb-paper-line)",
          borderBottom: "1px dashed var(--vb-paper-line)",
        }}
      >
        {ticket.items.map(([name, qty]) => (
          <li
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              padding: "5px 0",
              fontWeight: 500,
            }}
          >
            <span>{name}</span>
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                color: "#6B5133",
              }}
            >
              {qty}
            </span>
          </li>
        ))}
      </ul>

      {/* Timer */}
      <div
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 11,
          color: "#6B5133",
          textAlign: "right",
        }}
      >
        ⏱ {ticket.time}
      </div>
    </div>
  );
}

/* ── Scrolling Rail ───────────────────────────────────────────── */
function TicketRail() {
  const railRef = useRef<HTMLDivElement>(null);

  /* Pause animation on hover */
  const pause = () => {
    if (railRef.current) railRef.current.style.animationPlayState = "paused";
  };
  const resume = () => {
    if (railRef.current) railRef.current.style.animationPlayState = "running";
  };

  return (
    <div
      style={{
        position: "relative",
        height: 520,
        overflow: "hidden",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
      aria-hidden="true"
    >
      <div
        ref={railRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          animation: "railScroll 22s linear infinite",
        }}
      >
        {/* Doubled for seamless loop */}
        {[...TICKETS, ...TICKETS].map((t, i) => (
          <Ticket key={`${t.num}-${i}`} ticket={t} />
        ))}
      </div>
    </div>
  );
}

/* ── Feature Card ─────────────────────────────────────────────── */
function FeatureCard({
  accent,
  index,
  children,
}: {
  accent: string;
  index: string;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = parseInt(index) * 90;
          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      style={{
        background: "var(--vb-panel)",
        border: "1px solid var(--vb-panel-line)",
        borderRadius: "var(--vb-radius)",
        padding: "26px 24px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 26px -18px rgba(35,26,13,0.35)",
        opacity: 0,
        transform: "translateY(18px)",
        transition:
          "opacity 0.7s var(--vb-ease), transform 0.7s var(--vb-ease), border-color 0.3s var(--vb-ease), box-shadow 0.3s var(--vb-ease)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--vb-amber)";
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "0 16px 34px -16px rgba(214,47,31,0.24)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "var(--vb-panel-line)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "0 10px 26px -18px rgba(35,26,13,0.35)";
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: accent,
        }}
      />
      {children}
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div
      style={{
        margin: 0,
        background: "var(--vb-bg)",
        backgroundImage:
          "radial-gradient(ellipse 900px 500px at 85% -10%, rgba(242,169,59,0.20), transparent 60%), radial-gradient(ellipse 700px 500px at -10% 20%, rgba(214,47,31,0.10), transparent 55%)",
        color: "var(--vb-text-hi)",
        fontFamily: "var(--font-ibm-plex-sans), sans-serif",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(251,241,223,0.88)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--vb-panel-line)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.01em",
            }}
          >
            Vibeathon{" "}
            <span style={{ color: "var(--vb-flame)" }}>●</span>{" "}
            <small
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontWeight: 400,
                fontSize: 10.5,
                letterSpacing: "0.14em",
                color: "var(--vb-text-faint)",
                textTransform: "uppercase",
              }}
            >
              Smart Restaurant OS
            </small>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link
              href="/login"
              id="nav-staff-login"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-ibm-plex-sans), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                padding: "10px 18px",
                borderRadius: 9,
                textDecoration: "none",
                cursor: "pointer",
                border: "1px solid var(--vb-panel-line)",
                background: "transparent",
                color: "var(--vb-text-hi)",
                transition:
                  "transform 0.2s, background 0.25s, border-color 0.25s, color 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--vb-amber)";
                e.currentTarget.style.color = "var(--vb-amber)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--vb-panel-line)";
                e.currentTarget.style.color = "var(--vb-text-hi)";
              }}
            >
              Staff Login
            </Link>

            <Link
              href={DEMO_MENU_HREF}
              id="nav-demo-menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-ibm-plex-sans), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                padding: "10px 18px",
                borderRadius: 9,
                textDecoration: "none",
                cursor: "pointer",
                border: "1px solid transparent",
                background:
                  "linear-gradient(135deg, var(--vb-amber), var(--vb-flame))",
                color: "#1B0B00",
                transition: "transform 0.2s, filter 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.08)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              Demo Menu
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <header
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "88px 28px 60px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* Left: copy */}
        <div>
          {/* Eyebrow badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--vb-amber)",
              background: "rgba(255,199,44,0.12)",
              border: "1px solid rgba(255,199,44,0.35)",
              padding: "7px 13px",
              borderRadius: 100,
              marginBottom: 22,
            }}
          >
            {/* Pulse dot */}
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--vb-mint)",
                boxShadow: "0 0 0 0 rgba(62,189,107,.6)",
                animation: "vbPulse 1.8s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            Powered by Gemini AI
          </span>

          <h1
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(34px, 4.6vw, 54px)",
              lineHeight: 1.05,
              fontWeight: 700,
              margin: "0 0 22px",
              letterSpacing: "-0.01em",
            }}
          >
            The future of
            <br />
            <em
              style={{
                fontStyle: "normal",
                background:
                  "linear-gradient(135deg, var(--vb-amber), var(--vb-flame))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              dine-in
            </em>{" "}
            restaurant operations.
          </h1>

          <p
            style={{
              fontSize: 16.5,
              lineHeight: 1.65,
              color: "var(--vb-text-lo)",
              maxWidth: 480,
              margin: "0 0 32px",
            }}
          >
            A full-stack, real-time platform that digitizes the in-restaurant
            experience end-to-end — from customer ordering to kitchen
            management and AI-powered operational insights.
          </p>

          {/* CTAs */}
          <div
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 36 }}
          >
            <Link
              href={DEMO_MENU_HREF}
              id="hero-try-menu"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-ibm-plex-sans), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 22px",
                borderRadius: 9,
                textDecoration: "none",
                cursor: "pointer",
                border: "1px solid transparent",
                background:
                  "linear-gradient(135deg, var(--vb-amber), var(--vb-flame))",
                color: "#1B0B00",
                transition: "transform 0.2s, filter 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.08)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              Try Customer Menu →
            </Link>

            <Link
              href="/login"
              id="hero-staff-dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-ibm-plex-sans), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                padding: "12px 22px",
                borderRadius: 9,
                textDecoration: "none",
                cursor: "pointer",
                border: "1px solid var(--vb-flame)",
                background: "transparent",
                color: "var(--vb-flame)",
                transition: "background 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(218,41,28,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Staff Dashboard
            </Link>
          </div>

          {/* Social proof */}
          <div
            style={{
              display: "flex",
              gap: 26,
              flexWrap: "wrap",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 12,
              color: "var(--vb-text-faint)",
            }}
          >
            <div>
              <b
                style={{
                  color: "var(--vb-text-hi)",
                  fontSize: 15,
                  display: "block",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                }}
              >
                &lt;40s
              </b>
              ticket-to-kitchen sync
            </div>
            <div>
              <b
                style={{
                  color: "var(--vb-text-hi)",
                  fontSize: 15,
                  display: "block",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                }}
              >
                100%
              </b>
              live inventory accuracy
            </div>
            <div>
              <b
                style={{
                  color: "var(--vb-text-hi)",
                  fontSize: 15,
                  display: "block",
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                }}
              >
                0
              </b>
              manual order calls
            </div>
          </div>
        </div>

        {/* Right: animated ticket rail */}
        <TicketRail />
      </header>

      {/* ── Features Section ────────────────────────────────── */}
      <section
        id="features"
        style={{
          padding: "70px 0",
          maxWidth: 1180,
          margin: "0 auto",
          paddingLeft: 28,
          paddingRight: 28,
        }}
      >
        {/* Section header */}
        <div style={{ marginBottom: 40, maxWidth: 560 }}>
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--vb-flame)",
              marginBottom: 12,
              display: "block",
            }}
          >
            On the pass
          </span>
          <h2
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(24px, 3vw, 32px)",
              margin: "0 0 10px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            Every order, tracked from fire to fork.
          </h2>
          <p
            style={{
              color: "var(--vb-text-lo)",
              margin: 0,
              lineHeight: 1.6,
              fontSize: 15,
            }}
          >
            Three tickets. One synchronized system. No manual handoffs between
            the counter, the kitchen, and the till.
          </p>
        </div>

        {/* Feature cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {/* Card 1 — Operations */}
          <FeatureCard accent="var(--vb-amber)" index="0">
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 12,
                color: "var(--vb-text-faint)",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 16,
              }}
            >
              TICKET <b style={{ color: "var(--vb-amber)" }}>01</b> / OPERATIONS
            </span>
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 10px",
              }}
            >
              Real-time Operations
            </h3>
            <p
              style={{
                color: "var(--vb-text-lo)",
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Live order tracking, instant dish availability updates, and
              synchronized kanban boards for the kitchen. Everything happens
              in real-time.
            </p>
          </FeatureCard>

          {/* Card 2 — AI */}
          <FeatureCard accent="var(--vb-flame)" index="1">
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 12,
                color: "var(--vb-text-faint)",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 16,
              }}
            >
              TICKET <b style={{ color: "var(--vb-amber)" }}>02</b> / INTELLIGENCE
            </span>
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 10px",
              }}
            >
              Gemini AI Integration
            </h3>
            <p
              style={{
                color: "var(--vb-text-lo)",
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Chat with your restaurant&apos;s data using the Ops Assistant,
              and get smart demand forecasting for your inventory.
            </p>
          </FeatureCard>

          {/* Card 3 — Analytics */}
          <FeatureCard accent="var(--vb-mint)" index="2">
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 12,
                color: "var(--vb-text-faint)",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 16,
              }}
            >
              TICKET <b style={{ color: "var(--vb-amber)" }}>03</b> / INSIGHT
            </span>
            <h3
              style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize: 18,
                fontWeight: 600,
                margin: "0 0 10px",
              }}
            >
              Smart Analytics
            </h3>
            <p
              style={{
                color: "var(--vb-text-lo)",
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Automated table wait-time alerts, dynamic billing calculations,
              and rich dashboards to monitor your daily revenue.
            </p>
          </FeatureCard>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--vb-panel-line)",
          padding: "26px 0",
          marginTop: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "0 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--vb-text-faint)",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            © 2026 The Spice Garden Demo. Vibeathon 6.0 Hackathon.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--vb-text-faint)",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
            }}
          >
            Built for the floor, the pass, and the till.
          </p>
        </div>
      </footer>

      {/* ── Responsive styles injected via style tag ─────────── */}
      <style>{`
        @media (max-width: 920px) {
          header {
            grid-template-columns: 1fr !important;
            padding-top: 56px !important;
          }
          [data-rail-frame] {
            height: 400px !important;
          }
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
