  # نسيج (Naseeg) — Landing Page & E-Commerce Order Management Platform

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.2-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_%26_Realtime-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
  [![Bosta](https://img.shields.io/badge/Logistics-Bosta_Integration-FF5722)](https://bosta.co/)
  [![Flextock](https://img.shields.io/badge/Logistics-Flextock_Integration-0052CC)](https://flextock.com/)
  [![Vercel](https://img.shields.io/badge/Deployment-Vercel_Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com/)

  A modern, high-converting Arabic (RTL) sensory storybook landing page and headless e-commerce order management system for **Naseeg (نسيج)**. The project features a customer-facing interactive landing page, an admin control dashboard, serverless backend integrations for automated logistics dispatches (Bosta & Flextock), email notifications (Resend), and real-time database synchronization via Supabase.

  ---

  ## 📋 Table of Contents

  - [Overview](#-overview)
  - [Key Features](#-key-features)
    - [Customer-Facing Landing Page](#1-customer-facing-landing-page)
    - [Admin Control Portal](#2-admin-control-portal)
    - [Logistics & Shipping Integrations](#3-logistics--shipping-integrations)
    - [Data Architecture & Real-Time Sync](#4-data-architecture--real-time-sync)
  - [Tech Stack](#-tech-stack)
  - [Architecture & Bundle Optimization](#-architecture--bundle-optimization)
  - [Project File Structure](#-project-file-structure)
  - [Environment Variables](#-environment-variables)
  - [Database Setup & Schema](#-database-setup--schema)
  - [Serverless API Routes](#-serverless-api-routes)
  - [Local Development](#-local-development)
  - [Deployment (Vercel)](#-deployment-vercel)
  - [Scripts](#-scripts)

  ---

  ## 🌟 Overview

  **Naseeg (نسيج)** is designed to showcase interactive sensory children's books in the Egyptian and Arab market. The platform combines visual presentation with a streamlined checkout flow and back-office order fulfillment tools.

  ### Core Objectives:

  1. **High-Converting Customer Experience**: Deliver an intuitive Arabic Right-to-Left (RTL) interface with micro-interactions, sensory product showcases, dynamic pricing calculation, and instant order placement.
  2. **Automated Logistics**: Eliminate manual order entry by connecting directly with Egyptian shipping providers (**Bosta** and **Flextock**).
  3. **Real-time Order Management**: Provide store managers with a protected admin panel to track inventory, view sales metrics, manage shipping fees per governorate, and process orders in real time.
  4. **Resilient Data Layer**: Operate with Supabase PostgreSQL as the primary data store while maintaining an automatic fallback to browser `localStorage` in offline or degraded connectivity environments.

  ---

  ## ✨ Key Features

  ### 1. Customer-Facing Landing Page

  - **Arabic (RTL) Native UI**: Designed specifically for right-to-left layout alignment, Arabic typography (`Tajawal` Google Font), and Egyptian localized content.
  - **Hero & Interactive Visuals**: Engaging animated hero section featuring ambient fireflies background effects (`Fireflies.tsx`) and quick action call-to-actions (CTAs).
  - **Sensory Features Showcase**: Highlighted product sensory elements (textures, sound elements, visual contrast) with interactive cards (`SensoryFeatures.tsx`).
  - **Product Gallery & Lightbox**: Dynamic product slide gallery with image previews, discount tags, price before/after, and full-screen lightbox viewing (`Product.tsx`).
  - **Upcoming Products Teaser**: Section highlighting upcoming book releases (`UpcomingProducts.tsx`).
  - **Smart Checkout & Order Form (`Order.tsx`)**:
    - Dynamic governorate select covering 26+ Egyptian governorates with live shipping cost computation.
    - Bosta district auto-detection and selector integration.
    - Egyptian mobile phone validation (supporting `010`, `011`, `012`, `015` formats).
    - Form validation powered by `react-hook-form` and `zod`.
    - Automatic order generation with custom order numbers (e.g., `NSG-2025-0001`).
    - Instant WhatsApp confirmation redirect link (`wa.me/201055745507`).

  ### 2. Admin Control Portal (`/admin`)

  - **Protected Access**: Client-side password authorization gate with session persistence (`VITE_ADMIN_PASSWORD`).
  - **Dashboard Analytics (`DashboardPage.tsx`)**:
    - Revenue summary and total order count statistics.
    - Order status distribution breakdowns (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Shipping Error).
    - Recent order activity feed.
  - **Orders Management (`OrdersPage.tsx`)**:
    - Search orders by customer name, phone number, address, or order code.
    - Filter orders by status tabs.
    - One-click order fulfillment triggers to push orders to **Bosta** or **Flextock**.
    - Direct links to shipping tracking URLs.
    - In-line order status editing, note updates, and order deletion.
  - **Product Catalog Editor (`ProductsPage.tsx`)**:
    - Update product titles, highlighted titles, badge text, price before/after, and currency.
    - Toggle promotional offer banners and product availability.
    - Manage product features list and product slide image URLs.
  - **Shipping Settings Manager (`SettingsPage.tsx`)**:
    - Configure global default shipping fees.
    - Set specific shipping costs per Egyptian governorate (Cairo, Giza, Alexandria, Delta, Upper Egypt, etc.).

  ### 3. Logistics & Shipping Integrations

  - **Bosta Shipping API v2 (`/api/bosta.ts`)**:
    - Server-side delivery creation with Cash on Delivery (COD) payload formatting.
    - Built-in mapping table translating Arabic governorate names to Bosta English city IDs (`Cairo`, `Giza`, `Alexandria`, etc.).
    - Automatic updates of tracking numbers, tracking URLs, and order statuses in Supabase upon successful shipment creation.
  - **Flextock Fulfillment API (`/api/flextock.ts`)**:
    - JWT authentication flow with Flextock servers.
    - External order sync with SKU codes and line item breakdown.
    - Automated background order status sync endpoint (`action=sync`).
  - **Email Notifications (`/api/order-alert.ts`)**:
    - Instant email alerts sent to the store admin (`naseeg.stories@gmail.com`) via **Resend API** upon every new customer order.

  ### 4. Data Architecture & Real-Time Sync

  - **Supabase Postgres**: Production database hosting `products`, `orders`, `order_items`, and `shipping_settings`.
  - **Realtime Subscriptions**: Automatic UI state update via Supabase `postgres_changes` listener when orders or products change in the database.
  - **Offline / Local Storage Fallback**: Seamless fallback to local storage if Supabase credentials are not supplied or if network connection fails.

  ---

  ## 🛠 Tech Stack

  | Domain                 | Technology / Library                    | Purpose                                                     |
  | :--------------------- | :-------------------------------------- | :---------------------------------------------------------- |
  | **Core Framework**     | React 19.2 + Vite 7.3                   | Component framework & lightning-fast dev bundler            |
  | **Language**           | TypeScript 5.8                          | Type safety and autocompletion across codebase              |
  | **Styling**            | Tailwind CSS v4.2 + `@tailwindcss/vite` | Modern utility-first styling with native Vite integration   |
  | **Animations**         | Framer Motion 12.40                     | Micro-interactions, scroll animations, and page transitions |
  | **UI Primitives**      | Radix UI primitives                     | Accessible dialogs, drop-downs, tabs, and popovers          |
  | **Icons & Toasts**     | Lucide React + Sonner                   | Clean vector icons and RTL toast notifications              |
  | **Forms & Validation** | React Hook Form + Zod                   | Schema-validated form handling and state management         |
  | **Database**           | Supabase JS v2.106                      | Cloud PostgreSQL database & realtime subscriptions          |
  | **Serverless API**     | Vercel Node Functions                   | Secure proxying of Bosta, Flextock, and Resend API keys     |
  | **Email Service**      | Resend API v6.12                        | HTML order alerts sent directly to store admins             |
  | **Code Formatting**    | ESLint 9 + Prettier 3                   | Code quality enforcement and styling consistency            |

  ---

  ## ⚡ Architecture & Bundle Optimization

  To ensure optimal page load times for landing page visitors, the application incorporates chunk splitting:

  - **Lazy Loaded Landing Page Sections**: Below-the-fold sections (`Product`, `UpcomingProducts`, `Order`) are lazily imported using `React.lazy` and `Suspense`.
  - **Isolated Admin Chunk**: The entire `/admin` portal codebase is isolated into a separate Rollup chunk (`admin`) via `vite.config.ts`, ensuring landing page visitors never download admin code.
  - **Vendor Splitting**:
    - `vendor-motion`: Framer motion library
    - `vendor-supabase`: Supabase JS client
    - `vendor-react`: React & React Router DOM core
    - `vendor-form`: React Hook Form & Zod
    - `vendor-ui`: UI utilities (Lucide, Sonner, Tailwind Merge, CLSX)
  - **Local Dev API Middleware**: Custom `vite-plugin-dev-api.ts` plugin allows testing Vercel serverless `/api/*` routes directly during `npm run dev` without requiring extra server runners.

  ---

  ## 📁 Project File Structure

  ```
  naseeg-landing/
  ├── api/                        # Vercel Serverless Functions
  │   ├── bosta.ts                # Bosta Shipping API integration endpoint
  │   ├── flextock.ts             # Flextock Fulfillment API integration endpoint
  │   └── order-alert.ts          # Resend HTML email notification endpoint
  ├── public/                     # Static assets (favicons, public media)
  ├── src/
  │   ├── admin/                  # Protected Admin Dashboard Portal
  │   │   ├── components/         # Admin components (Nav, Gates, Badges, Uploads)
  │   │   ├── config/             # Navigation config
  │   │   ├── layout/             # Admin layout wrapper
  │   │   └── pages/              # DashboardPage, OrdersPage, ProductsPage, SettingsPage, LoginPage
  │   ├── assets/                 # Brand images and visual media assets
  │   ├── components/
  │   │   ├── layout/             # Header, Footer
  │   │   ├── sections/           # Hero, Product, SensoryFeatures, UpcomingProducts, Order, Fireflies
  │   │   ├── shared/             # Reusable UI wrappers
  │   │   └── ui/                 # Shared UI primitives (Buttons, Cards, Dialogs, Inputs)
  │   ├── hooks/                  # Custom React hooks (use-mobile, useStore)
  │   ├── lib/                    # Core business logic & state management
  │   │   ├── analytics.ts        # Event tracking utilities
  │   │   ├── auth.ts             # Admin authentication gate helper
  │   │   ├── bosta-cities.ts     # Bosta governorate to city ID mapping
  │   │   ├── governorates.ts     # Egyptian governorates list & shipping presets
  │   │   ├── order-form-validation.ts # Zod validation schema for checkout
  │   │   ├── phone-validation.ts # Egyptian mobile phone format validator
  │   │   ├── store.ts            # External Store state manager (hybrid LocalStorage + Supabase)
  │   │   ├── supabase.ts         # Supabase client initializer
  │   │   ├── supabase-data.ts    # Supabase CRUD operations & realtime subscriptions
  │   │   └── types.ts            # TypeScript interfaces (Order, Product, Shipping, etc.)
  │   ├── pages/                  # Main customer LandingPage.tsx
  │   ├── providers/              # React Context StoreProvider
  │   ├── services/               # Client wrappers for Bosta & Flextock API routes
  │   ├── App.tsx                 # Application router & code splitting setup
  │   ├── index.css               # Global styles, fonts, Tailwind imports
  │   └── main.tsx                # Application entry point
  ├── supabase/                   # Database Migrations & SQL Schemas
  │   ├── schema.sql              # Core SQL table schemas, RLS policies & triggers
  │   └── migration_flextock.sql  # Flextock & Bosta database schema extensions
  ├── .env.example                # Template for environment variables
  ├── index.html                  # HTML template with meta tags & Tajawal Google Font
  ├── package.json                # Project dependencies and npm scripts
  ├── tsconfig.json               # TypeScript compiler config
  ├── vercel.json                 # Vercel deployment routing configuration
  ├── vite-plugin-dev-api.ts      # Custom Vite dev middleware for /api serverless testing
  └── vite.config.ts              # Vite configuration & Rollup manual chunks setup
  ```

  ---

  ## 🔑 Environment Variables

  To configure local development and production deployments, copy `.env.example` to `.env`:

  ```bash
  cp .env.example .env
  ```

  ### Configuration Matrix:

  | Variable                        | Scope            | Description                                             | Example / Default          |
  | :------------------------------ | :--------------- | :------------------------------------------------------ | :------------------------- |
  | `VITE_SUPABASE_URL`             | Client & Server  | Supabase project URL                                    | `https://xxxx.supabase.co` |
  | `VITE_SUPABASE_PUBLISHABLE_KEY` | Client & Server  | Supabase anon/publishable API key                       | `eyJhbGciOi...`            |
  | `SUPABASE_SERVICE_ROLE_KEY`     | Server-Side Only | Optional elevated Supabase key for serverless endpoints | `eyJhbGciOi...`            |
  | `VITE_ADMIN_PASSWORD`           | Client Gate      | Admin portal login password                             | `naseeg2025`               |
  | `VITE_WHATSAPP_NUMBER`          | Client           | WhatsApp order follow-up contact number                 | `01055745507`              |
  | `RESEND_API_KEY`                | Server-Side Only | Resend API key for email notifications                  | `re_123456789...`          |
  | `BOSTA_API_KEY`                 | Server-Side Only | Bosta Logistics API key                                 | `f8c183ceb...`             |
  | `FLEXTOCK_USERNAME`             | Server-Side Only | Flextock merchant login username                        | `merchant_user`            |
  | `FLEXTOCK_PASSWORD`             | Server-Side Only | Flextock merchant login password                        | `merchant_pass`            |
  | `FLEXTOCK_API_KEY`              | Server-Side Only | Optional Flextock integration API key                   | `flextock_key...`          |

  ---

  ## 🗄 Database Setup & Schema

  1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
  2. Open the **SQL Editor** (`Dashboard → SQL → New Query`).
  3. Execute the contents of [`supabase/schema.sql`](file:///e:/computer%20and%20artificial%20intilgance/FreeLance%20work/naseeg%20Landing/supabase/schema.sql) to set up tables, default data triggers, and RLS policies.
  4. Execute [`supabase/migration_flextock.sql`](file:///e:/computer%20and%20artificial%20intilgance/FreeLance%20work/naseeg%20Landing/supabase/migration_flextock.sql) to add logistics tracking fields.

  ### Database Tables:

  ```mermaid
  erDiagram
      PRODUCTS {
          string id PK "main-product"
          string badge
          string title
          string title_highlight
          string description
          numeric price_before
          numeric price_after
          boolean offer_enabled
          string currency
          jsonb features
          jsonb slides
          string sku_code
          boolean active
          timestamptz updated_at
      }

      SHIPPING_SETTINGS {
          string id PK "default"
          numeric default_fee
          jsonb governorate_fees
          timestamptz updated_at
      }

      ORDERS {
          uuid id PK
          string order_number UNIQUE
          string customer_name
          string phone
          string governorate
          string address
          string notes
          integer quantity
          numeric unit_price
          numeric shipping_fee
          numeric subtotal
          numeric total
          string email
          string city
          string area
          string payment_method
          string status
          boolean bosta_order_sent
          string bosta_status
          boolean flextock_order_sent
          string flextock_status
          string tracking_number
          string tracking_url
          timestamptz created_at
          timestamptz updated_at
      }

      ORDER_ITEMS {
          uuid id PK
          uuid order_id FK
          string book_id FK
          string title
          string sku_code
          integer quantity
          numeric price
      }

      ORDERS ||--|{ ORDER_ITEMS : contains
      PRODUCTS ||--o{ ORDER_ITEMS : referenced_by
  ```

  ---

  ## 📡 Serverless API Routes

  The backend API routes located in the `/api` folder deploy automatically as Vercel Serverless Functions in production, and are emulated locally by `devApiPlugin` during `npm run dev`:

  ### 1. `/api/bosta`

  - **Method**: `POST` / `GET`
  - **Actions**:
    - `action=create`: Creates a delivery order in Bosta, updates shipping status in Supabase, and returns tracking code.
    - `action=districts&cityId=<CITY_ID>`: Fetches sub-districts from Bosta API for fine-grained address selection.

  ### 2. `/api/flextock`

  - **Method**: `POST`
  - **Actions**:
    - `action=create`: Authenticates with Flextock and pushes line-item order details.
    - `action=sync`: Queries Flextock for updated tracking/delivery status on active orders and updates local Supabase order states.

  ### 3. `/api/order-alert`

  - **Method**: `POST`
  - **Payload**: `{ order: OrderRecord }`
  - **Description**: Formats an HTML notification email containing customer details, ordered quantities, price calculations, and admin direct link, sending it via Resend API to `naseeg.stories@gmail.com`.

  ---

  ## 💻 Local Development

  ### Prerequisites:

  - **Node.js**: `v18.0.0` or higher
  - **Package Manager**: `npm` (or `bun` / `pnpm`)

  ### Step-by-Step Installation:

  1. **Clone the Repository**:

    ```bash
    git clone https://github.com/FadyAdel04/magical-forest-adventures.git
    cd naseeg-landing
    ```

  2. **Install Dependencies**:

    ```bash
    npm install
    ```

  3. **Set Up Environment Variables**:
    Copy `.env.example` to `.env` and fill in your Supabase credentials:

    ```bash
    cp .env.example .env
    ```

  4. **Start Development Server**:

    ```bash
    npm run dev
    ```

    Open your browser at `http://localhost:5173`. Both the main landing page and `/api/*` serverless backend endpoints are live.

  5. **Access Admin Dashboard**:
    Navigate to `http://localhost:5173/admin/login` and sign in using your configured `VITE_ADMIN_PASSWORD` (default: `naseeg2025`).

  ---

  ## 🚀 Deployment (Vercel)

  This repository is optimized for one-click deployment on **Vercel**.

  ### Step-by-Step Deployment:

  1. Push your repository to GitHub / GitLab / Bitbucket.
  2. Import the repository into the [Vercel Dashboard](https://vercel.com/new).
  3. Select **Vite** as the Framework Preset.
  4. **Build Command**: `npm run build`
  5. **Output Directory**: `dist`
  6. Add Environment Variables in **Project Settings → Environment Variables**:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_PUBLISHABLE_KEY`
    - `VITE_ADMIN_PASSWORD`
    - `RESEND_API_KEY`
    - `BOSTA_API_KEY`
    - `FLEXTOCK_USERNAME`
    - `FLEXTOCK_PASSWORD`
  7. Click **Deploy**. Vercel will automatically build the static bundle and deploy the API routes in `/api` as Serverless Edge/Node Functions.

  ---

  ## 📜 Scripts

  | Script            | Command                | Description                                                    |
  | :---------------- | :--------------------- | :------------------------------------------------------------- |
  | `npm run dev`     | `vite`                 | Launch local development server with API emulation             |
  | `npm run build`   | `tsc -b && vite build` | Type-check TypeScript and build production bundle into `dist/` |
  | `npm run preview` | `vite preview`         | Preview production build locally                               |
  | `npm run lint`    | `eslint .`             | Run ESLint static code analysis                                |
  | `npm run format`  | `prettier --write .`   | Format all source files using Prettier                         |

  ---

  <p center align="center">
    Crafted with ❤️ for <b>Naseeg (نسيج)</b> — Premium Arabic Sensory Stories
  </p>
