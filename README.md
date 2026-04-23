# 🏌️‍♂️ Golf Reward & Charity Platform

A full-stack web application that combines **golf performance tracking**, **monthly reward draws**, and **charity contributions** into a single engaging platform.

---

## 🚀 Live Demo

🔗 https://your-vercel-link.vercel.app

---

## 📌 Overview

This platform allows users to:

* Subscribe to access premium features
* Track their latest golf scores (Stableford format)
* Participate in monthly draw-based rewards
* Contribute a portion of their subscription to charity

The system focuses on **real-world usability**, **clean UX**, and **functional backend logic**.

---

## ✨ Core Features

### 🔐 Authentication & User System

* Secure login/signup using Supabase
* Protected dashboard access

### 💳 Subscription System (Simulated)

* Monthly & yearly plans
* Subscription activation logic
* Renewal date tracking
* Feature access control

> Note: Payment is simulated due to sandbox limitations.

---

### ⛳ Score Management (Rolling 5 System)

* Users can enter golf scores (1–45 range)
* Only latest 5 scores retained
* Oldest score automatically replaced
* Duplicate date entries prevented

---

### 🎲 Draw Engine

* Generate monthly draw (5 random numbers)
* Stored in database
* Prize pool dynamically calculated based on subscribers

---

### 🏆 Winnings System

* Matches user scores with draw results
* Displays:

  * 3 Match → Entry Tier
  * 4 Match → High Tier
  * 5 Match → Jackpot
* Real-time result evaluation

---

### ❤️ Charity Integration

* Users select a charity
* Percentage of subscription contributes to charity
* Displayed on dashboard

---

## 🧱 Tech Stack

* **Frontend:** Next.js (App Router), React
* **Backend:** Supabase (Database + Auth)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Deployment:** Vercel

---

## 📂 Project Structure

```
/app
  /dashboard
  /draws
  /winnings
  /subscribe
/components
  ScoreEntry.tsx
/utils
  supabase.ts
```

---

## ⚙️ Setup Instructions

1. Clone repository:

```bash
git clone https://github.com/your-username/golf-platform.git
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev -- --webpack
```

4. Configure environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 🧠 Key Highlights

* Focused on **complete system flow**, not just UI
* Implemented **data integrity logic** (rolling scores, validation)
* Designed for **scalability and real-world use cases**
* Clean, modern, non-traditional UI

---

## ⚠️ Limitations

* Payment system is simulated (no real gateway integration)
* Admin panel is not fully separated (core logic implemented)

---

## 📈 Future Improvements

* Full payment integration (Stripe / Razorpay)
* Dedicated admin dashboard
* Automated monthly draw scheduler
* Email notifications system

---

## 👤 Author

**Trushant Rathod**
📧 [trushantrathod@gmail.com](mailto:trushantrathod@gmail.com)

---

## 📄 License

This project is created for educational and evaluation purposes.
