# 🍽️ Smart Restaurant Management System

A full-stack, real-time restaurant management platform that digitizes the in-restaurant experience end-to-end — from customer ordering to kitchen management, billing, and AI-powered operational insights.

> **This is NOT a food delivery clone.** It's a system built for dine-in restaurant operations.

## Problem Statement

Restaurants rely on manual processes causing operational inefficiencies:

- Customers can't see real-time dish availability
- Long wait times with no visibility into queue position
- Delayed communication between customers, staff, and kitchen
- Manual billing and inventory management
- Lack of actionable operational insights

This system solves all of the above with a digitized, real-time, AI-enhanced workflow.

## Order State Machine

Based on research into real POS systems (Petpooja, Toast), orders follow a strict state machine:

```
placed → confirmed → preparing → ready → served → billed
```

- **`placed`** — Customer-initiated (via the digital menu)
- **All other transitions** — Staff-initiated (via the kitchen/staff dashboard)
- **Each transition** triggers a Supabase Realtime event, updating all connected clients instantly

## Tech Stack

| Layer       | Technology                                                                 |
| ----------- | -------------------------------------------------------------------------- |
| Framework   | Next.js 15 (App Router) — serves as both frontend & backend               |
| Styling     | Tailwind CSS v4 + shadcn/ui                                               |
| Database    | Supabase (Postgres + Realtime + Auth + Row Level Security)                 |
| AI          | Google Gemini API (demand forecasting + ops assistant)                      |
| Deployment  | Vercel                                                                     |

## Hackathon Tier Features

| Tier         | Features                                                        |
| ------------ | --------------------------------------------------------------- |
| **Bronze**   | Menu display, basic ordering, table management                  |
| **Silver**   | Real-time order tracking, staff dashboard, role-based access     |
| **Gold**     | Smart reservations, notifications, analytics, billing           |
| **Platinum** | AI demand forecasting, realtime dish availability               |
| **Bonus**    | Gemini ops assistant, wait-time alerts, bidirectional realtime   |

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- A [Supabase](https://supabase.com) project
- A [Google Gemini API key](https://ai.google.dev)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd vibeathon

# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.local.example .env.local

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## License

MIT
