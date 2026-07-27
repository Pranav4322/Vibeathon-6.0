# 🍽️ Smart Restaurant Management System

**Team Name:** [Insert Team Name Here]
**Hosted Application Link:** [Insert Hosted Link Here]

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

## AI Usage

This project leverages Google's Gemini AI to enhance restaurant operations:
- **Demand Forecasting:** Predicts dish demand based on historical order data, helping the kitchen prep the right amounts and reduce waste.
- **Ops Assistant:** A conversational agent for staff to query operational data in natural language (e.g., "What sold best last night?", "Which tables are running long?").

## Hackathon Tier Features & User Stories

| Tier         | Features                                                        | User Stories |
| ------------ | --------------------------------------------------------------- | ------------ |
| **Bronze**   | Menu display, basic ordering, table management                  | As a customer, I can view the digital menu and place an order. As staff, I can manage table statuses. |
| **Silver**   | Real-time order tracking, staff dashboard, role-based access     | As a customer, I can track my order status live. As staff, I can manage orders through a kanban board. |
| **Gold**     | Smart reservations, notifications, analytics, billing           | As a customer, I can join a waitlist and get notified when my table is ready. As staff, I can generate bills. |
| **Platinum** | AI demand forecasting, realtime dish availability               | As a manager, I can see AI predictions for tonight's service. As staff, I can mark items out of stock instantly. |
| **Bonus**    | Gemini ops assistant, wait-time alerts, bidirectional realtime   | As a manager, I can chat with an AI about sales data. As staff, I see alerts when tables exceed average wait times. |

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

## Scalability Notes

To ensure the Smart Restaurant Management System can handle high traffic and multiple locations, the architecture is designed with the following scalability principles:

- **Supabase Realtime Scaling:** Uses connection multiplexing to efficiently handle many concurrent WebSocket connections per restaurant, minimizing overhead and staying within channel limits.
- **Multi-location Sharding Strategy:** `restaurant_id` serves as a natural partition key across all major tables (orders, menu items, tables), allowing for horizontal database sharding as the platform expands to new branches.
- **CDN and Edge Caching:** Static assets, frontend pages, and unchanged API responses are distributed globally via Vercel's Edge Network, reducing latency for customers browsing menus.
- **Database Indexing:** Critical query paths (e.g., active orders by status, wait times by table) are heavily indexed in PostgreSQL to ensure fast reads even with millions of historical records.
- **Serverless Compute:** API routes and Server Actions run on Vercel's serverless infrastructure, automatically scaling horizontally to handle spikes in traffic during peak dining hours.

## License

MIT
