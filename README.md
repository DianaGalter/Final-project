# ShopVerse E-Commerce Platform

MERN-based e-commerce system with three separate applications:

| App | Port | Description |
|-----|------|-------------|
| `server` | 5000 | Centralized REST API + Socket.IO |
| `storefront` | 3000 | Public customer-facing Next.js app |
| `crm` | 3001 | Admin dashboard (MUI + Next.js) |

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

## Quick Start

### 1. Backend

```bash
cd server
cp .env.example .env   # if needed
npm install
npm run seed           # seeds products + admin user
npm run dev
```

**Admin credentials (after seed):**
- Email: set `ADMIN_EMAIL` in `server/.env` (and `NEXT_PUBLIC_ADMIN_EMAIL` in `crm/.env.local` for the login form default)
- Password: `admin123`
- 2FA is enabled (code sent via email; configure SMTP in `.env` or check server logs)

### 2. Storefront

```bash
cd storefront
npm install
npm run dev -- -p 3000
```

### 3. CRM

```bash
cd crm
npm install
npm run dev -- -p 3001
```

## Architecture

- **REST API only** — frontends never talk to each other
- **Feature-based folders** under `src/features/` and `src/shared/`
- **Redux Toolkit** for global state on both frontends
- **JWT auth**, bcrypt passwords, admin 2FA, password reset, Google OAuth (optional)
- **Guest cart** with DB persistence, merge on login, Socket.IO inventory updates

## API Overview

| Route | Access |
|-------|--------|
| `POST /api/auth/register` | Public |
| `POST /api/auth/login` | Public |
| `POST /api/auth/verify-2fa` | Admin 2FA |
| `GET /api/products` | Public |
| `GET/POST /api/cart` | Guest + Auth |
| `POST /api/cart/merge` | Auth |
| `POST /api/orders` | Auth |
| `GET /api/stats/dashboard` | Admin |
| `PUT /api/orders/:id/status` | Admin |

## Environment Variables

See `server/.env.example`, `storefront/.env.local`, and `crm/.env.local`.

For Google OAuth, set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` in server `.env`.

For email (2FA, password reset), configure `EMAIL_*` variables.

## Specification Compliance (PDF)

This project implements the course specification document (*אפיון פרויקט גמר - סוף קורס*):

| Requirement | Status |
|-------------|--------|
| 3 separate apps (API, Storefront, CRM) | Done |
| REST API, JWT, bcrypt, CORS, rate limit, validation | Done |
| Socket.IO real-time inventory | Done |
| Google OAuth, Nodemailer (2FA, reset, welcome, order confirmation, shipped) | Done |
| Guest cart + DB sync + merge | Done |
| Multi-step checkout (shipping + mock payment) | Done |
| Storefront: carousel, quick-view popup, profile, orders | Done |
| CRM: MUI, 2FA, dashboard stats, users/products/orders CRUD | Done |
| Feature folders: `components`, `services`, `utils`, `slices` | Done |
| SEO: dynamic metadata, `robots.txt`, `sitemap.xml`, favicon | Done |

**Note:** The PDF table lists shadcn/ui under CRM, but section 3(c) specifies **MUI for CRM** and the storefront uses shadcn-style components — matching the logical split in the spec body.

## Project Structure

```
Project/
├── server/          # Express + MongoDB + Socket.IO
├── storefront/      # Next.js + shadcn-style UI + Redux
└── crm/             # Next.js + MUI + Redux
```
