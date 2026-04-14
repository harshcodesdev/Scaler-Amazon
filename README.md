# Amazon Storefront

A full-featured e-commerce web application built with **Next.js 16**, **Tailwind CSS 4**, and **Prisma ORM** — designed to feel like a real online shopping platform with product discovery, cart management, order tracking, and user accounts.

---

## What's Inside

### User Accounts
- **Sign-up with email verification** — register with a name, email, phone, and password. An OTP is sent to your inbox before the account is activated.
- **Secure sign-in** — password hashing with bcrypt and JWT-based session tokens. No cookies, no hardcoded credentials.
- **Profile dashboard** — manage your personal info, addresses, and view order history.
- **Wishlist** — save products for later and access them across sessions.

### Shopping Experience
- **Product detail pages** — full product info with images, pricing, stock, highlights, color/size options, EMI calculations, and active bank offers.
- **Smart search** — server-side full-text search across titles, categories, and descriptions with real-time results and filter sorting.
- **Category browsing** — home page organizes products into visual category grids with auto-rotating carousel.
- **Recommendations** — dynamically generated product suggestions tied to your browsing and search patterns.

### Orders & Logistics
- **Cart to checkout** — add items, review totals, and place orders with a shipping address.
- **Order tracking** — visual step-by-step progress (Ordered → Shipped → Out for Delivery → Delivered).
- **Return and exchange** — request returns with a reason and track the request status.
- **Email notifications** — automated purchase confirmation emails with OTP for account verification.

---

## How It Works

### Authentication Flow
```
User submits registration form
        │
        ▼
  OTP generated (6 digits, 10-min expiry)
        │
        ▼
  Email sent with the code
        │
        ▼
  User enters OTP on the verification page
        │
        ▼
  Server verifies code, creates user account
        │
        ▼
  JWT token issued and stored in localStorage
        │
        ▼
  All future requests include the JWT for auth
```

### Search Architecture
```
User types a query in the search bar
        │
        ▼
  Frontend stores search intent
        │
        ▼
  GET /api/products?search=... (server-rendered)
        │
        ▼
  Prisma queries PostgreSQL (ILIKE matches on title, category, description)
        │
        ▼
  Results returned as JSON, UI scrolls to the results container
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts      ← OTP registration flow
│   │   │   ├── signin/route.ts      ← Password check + JWT issue
│   │   │   └── verify/route.ts      ← OTP check + account creation + JWT
│   │   ├── orders/
│   │   │   ├── route.ts             ← Create an order
│   │   │   ├── list/route.ts        ← Fetch user's orders
│   │   │   ├── [id]/route.ts        ← Single order detail
│   │   │   └── [id]/return/route.ts ← Return/exchange request
│   │   └── products/
│   │       ├── route.ts             ← List + search products
│   │       └── [id]/route.ts        ← Single product
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/page.tsx
│   ├── orders/[id]/page.tsx
│   ├── product/[id]/page.tsx
│   ├── profile/page.tsx
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── wishlist/page.tsx
├── components/
│   ├── home/
│   │   └── CategoryGridCard.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── SidebarMenu.tsx
│   │   └── LocationModal.tsx
│   └── product/
│       ├── ProductCard.tsx
│       └── ProductCardSkeleton.tsx
├── context/
│   ├── AuthContext.tsx    ← JWT storage + user state
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── ToastContext.tsx
└── lib/
    ├── formatPrice.ts     ← INR currency formatting
    ├── jwt.ts             ← Sign and verify JWTs
    ├── mailer.ts          ← Nodemailer email sending
    ├── notifications.ts
    └── prisma.ts          ← Prisma client singleton

prisma/
├── schema.prisma          ← Database schema (User, Product, Order, etc.)
├── seed.ts                ← Sample product data
└── migrations/            ← Prisma migration history

.env.example               ← Required environment variables
```

---

## Routes

| Route | Description | Auth Required |
|---|---|---|
| `/` | Home page with categories and deals | No |
| `/product/[id]` | Product detail page | No |
| `/cart` | Shopping cart | No |
| `/checkout` | Order placement flow | Yes |
| `/profile` | Account dashboard | Yes |
| `/orders` | Order history | Yes |
| `/orders/[id]` | Order detail + return | Yes |
| `/wishlist` | Saved items | Yes |
| `/signin` | Sign in page | No |
| `/signup` | Registration page | No |

---

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Register and send OTP email |
| `/api/auth/verify` | POST | Verify OTP, create account, return JWT |
| `/api/auth/signin` | POST | Sign in with email/password, return JWT |
| `/api/products` | GET | List products with optional search and filters |
| `/api/products/[id]` | GET | Fetch a single product |
| `/api/orders` | POST | Create a new order |
| `/api/orders/list` | GET | Get orders for the authenticated user |
| `/api/orders/[id]` | GET | Get order detail and tracking |
| `/api/orders/[id]/return` | POST | Submit a return or exchange request |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL=postgres://user:password@host:5432/db
DIRECT_URL=postgres://user:password@host:5432/db
JWT_SECRET=any-long-random-string-at-least-32-chars
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Run the dev server

```bash
npm run dev
```

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Styling | Tailwind CSS 4.0 |
| Database | Prisma ORM + PostgreSQL |
| Auth | JWT via `jose` + bcrypt |
| Email | Resend |
| Validation | Server-side in API routes |
| Deployment | Vercel |

---

Built by **HarshDeep**