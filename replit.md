# Real Estate Platform

## Overview

Full-stack Real Estate Platform with a public property website and a broker CRM dashboard.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/real-estate)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle for API)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── real-estate/        # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts         # Database seeding script
├── vercel.json             # Vercel deployment config
├── DEPLOY.md               # Full deployment guide
└── .env.example            # Environment variable template
```

## Database Schema

Tables: `properties`, `inquiries`, `visits`, `deals`

Schema files:
- `lib/db/src/schema/properties.ts`
- `lib/db/src/schema/inquiries.ts`
- `lib/db/src/schema/visits.ts`
- `lib/db/src/schema/deals.ts`

## API Routes

All routes are under `/api`:

- `GET/POST /api/properties` — List/create properties (with filters)
- `GET/PUT/DELETE /api/properties/:id` — Property detail CRUD
- `GET/POST /api/inquiries` — List/create inquiries
- `GET/PUT /api/inquiries/:id` — Inquiry CRUD
- `GET/POST /api/visits` — List/create visits
- `GET/PUT /api/visits/:id` — Visit CRUD
- `GET/POST /api/deals` — List/create deals
- `GET/PUT /api/deals/:id` — Deal CRUD
- `GET /api/analytics/dashboard` — Dashboard analytics

## Frontend Pages

### Public
- `/` — Home page with hero, search, featured properties
- `/properties` — Property listing with filters
- `/properties/:id` — Property detail with inquiry form
- `/contact` — Contact/inquiry form

### Broker Dashboard (protected)
- `/login` — Broker login (localStorage-based auth for POC)
- `/dashboard` — Analytics overview
- `/dashboard/properties` — Property CRUD
- `/dashboard/inquiries` — Lead management
- `/dashboard/visits` — Visit scheduling
- `/dashboard/deals` — Deal pipeline

## Deployment

See `DEPLOY.md` for full Vercel and Railway deployment guides.

### Quick Deploy to Vercel

1. Deploy `artifacts/api-server` as one Vercel project with `DATABASE_URL` env var
2. Deploy `artifacts/real-estate` as a second Vercel project with `VITE_API_URL` pointing to the API

## Development Commands

```bash
pnpm install                                        # Install all dependencies
pnpm --filter @workspace/db run push                # Push DB schema
pnpm --filter @workspace/scripts run seed           # Seed sample data
pnpm --filter @workspace/api-server run dev         # Start API server
pnpm --filter @workspace/real-estate run dev        # Start frontend
pnpm --filter @workspace/api-spec run codegen       # Regenerate API client
```
