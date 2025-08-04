# ☕ QuickBean – Cafe Ordering SaaS Demo

QuickBean is a modern full-stack SaaS application built to simplify in-venue ordering for cafes and hospitality venues. It demonstrates a real-time digital checkout and kitchen workflow, using WebSockets, a structured admin dashboard, and fake-powered payments.

## 🧠 Tech Stack

### Backend

* Framework: NestJS
* Language: TypeScript
* Database: PostgreSQL via TypeORM
* Authentication: PassportJS with JWT
* WebSockets: @nestjs/websockets, socket.io
* Logging: Winston
* Storage: Vercel Blob
* Hosting: Fly.io

### Frontend

Both the Admin and Checkout apps are built using:

* Framework: React 19
* UI Library: Mantine
* Icons: Lucide React
* State Management: Redux Toolkit
* WebSocket Client: socket.io-client
* Routing: React Dom Router
* Deployment: Vercel

## 📁 Project Structure (Monorepo)

``` bash
/quickbean
├── /api.quickbean
│   ├── Models          # Common domain typescript models
│   └── src             # The API - deployed using `fly deploy`
├── /checkout.react     # The checkout deployed on git push
└── /quickbean.admin    # The admin port
```

## ✨ Features

### ✅ Admin Dashboard

* One-time passcode (OTP) login flow
* Venue settings management
* Product creation/editing with modifier support
* Checkout editor with live preview
* Kitchen Display System (KDS) for order flow
* Sales dashboard (currently faked stats for demo)

![Order Ready](/assets/Order%20ready%20for%20pickup.png "Live communication from Kitchen to checkout")
Live communication from Kitchen to checkout

### ✅ Checkout App

* Intuitive category-based menu (e.g. Hot Drinks, Cold Drinks, Food)
* Add to cart and proceed to payment via Stripe
* Real-time order status updates using WebSockets
* Mobile-friendly and touch-optimized UI
* Built to WCAG 2.1AA

![Checkout Menu](/assets/checkout_menu.png)

## 🚀 Live Demo - Downtown Coffee Bar

Checkout: https://quickbeancheckout.vercel.app/downtown-coffee-bar/dcb-checkout/menu

Admin: https://quickbeanadmin.vercel.app/downtown-coffee-bar/home

API swagger documentation: https://api-quickbeans.fly.dev/api

## 📌 Roadmap

* Multi-venue support
* Dynamic order routing to kitchen stations
* Real-time analytics and reporting
* Support for Apple/Google Pay
* Offline kiosk mode

![Dashboard stats](/assets/dashboard_stats.png)