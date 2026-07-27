# Smart Restaurant Management System — Demo Script

**Estimated Time:** 90 seconds

## 1. The Customer Menu & Real-time Availability (0:00 - 0:15)
- **Action:** Open the Customer Menu (`/menu/[restaurantId]`).
- **Narration:** "Here is the customer view. They scan a QR code at their table and see the digital menu."
- **Action:** Open the Staff Dashboard (`/dashboard/menu`) in a split screen or separate window. Toggle the availability of an item (e.g., *Butter Naan*) to "Out of Stock".
- **Narration:** "If the kitchen runs out of an item, staff can instantly mark it unavailable. Notice how it updates live on the customer's screen without a refresh."

## 2. Order Placement & Kanban Workflow (0:15 - 0:40)
- **Action:** On the Customer screen, add a few available items to the cart and click "Place Order".
- **Narration:** "The customer places their order..."
- **Action:** Switch to the Staff Dashboard -> Orders view (`/dashboard/orders`). Show the new order in the 'Placed' column.
- **Narration:** "...and it immediately appears on the kitchen's Kanban board."
- **Action:** Drag or advance the order from 'Placed' to 'Confirmed', then to 'Preparing'.
- **Action:** Show the Customer screen updating its progress tracker live.
- **Narration:** "As staff advance the order, the customer sees live progress updates."

## 3. Wait-Time Alerts (0:40 - 0:55)
- **Action:** Navigate to the Dashboard Home (`/dashboard`).
- **Narration:** "On the main dashboard, the system monitors order completion times. If a table waits significantly longer than average, an alert is triggered automatically."
- **Action:** Point out the Long Wait Alerts section.

## 4. AI Ops Assistant & Demand Forecasting (0:55 - 1:20)
- **Action:** Navigate to the AI section (`/dashboard/ai`). Open the Ops Assistant tab.
- **Action:** Type a query like: *"What sold best tonight?"* or *"Which tables are running long?"*
- **Narration:** "Managers can query their restaurant's data using natural language via the Gemini Ops Assistant."
- **Action:** Switch to the Forecasting tab.
- **Narration:** "Gemini also provides Demand Forecasting based on historical data to help the kitchen prep efficiently."

## 5. Billing (1:20 - 1:30)
- **Action:** Navigate to the Billing section (`/dashboard/billing`) or the specific order's bill view.
- **Narration:** "Finally, when the meal is done, an itemized bill with tax calculation is instantly generated for the customer. This completes the end-to-end digital dine-in experience."
