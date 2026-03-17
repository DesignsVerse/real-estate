# Deploying to Vercel

This project is a pnpm monorepo with a React frontend and an Express API backend.
The recommended approach for Vercel is to deploy them as **two separate Vercel projects**.

---

## Option 1: Two Separate Vercel Projects (Recommended)

### Step 1 — Deploy the API (Express backend)

1. In your Vercel dashboard, click **Add New Project**
2. Import this repository
3. Set **Root Directory** to `artifacts/api-server`
4. Set **Build Command**: `pnpm --filter @workspace/api-server run build`
5. Set **Output Directory**: `dist`
6. Set **Install Command**: `pnpm install`
7. Add these **Environment Variables**:
   - `DATABASE_URL` — your PostgreSQL connection string (e.g., from Neon, Supabase, or Railway)
   - `NODE_ENV` — `production`
8. Deploy. Note the URL (e.g., `https://your-api.vercel.app`)

> **Note:** Vercel's serverless functions have a 10-second timeout by default. For long queries, use a server-optimized host like Railway or Render for the Express API instead.

### Step 2 — Deploy the Frontend (React/Vite)

1. In your Vercel dashboard, click **Add New Project** again
2. Import the same repository
3. Set **Root Directory** to `artifacts/real-estate`
4. Set **Build Command**: `pnpm --filter @workspace/real-estate run build`
5. Set **Output Directory**: `dist`
6. Set **Install Command**: `pnpm install`
7. Add these **Environment Variables**:
   - `VITE_API_URL` — the URL from Step 1 (e.g., `https://your-api.vercel.app`)
8. Deploy

---

## Option 2: Full-Stack on Railway (Easiest for Express)

Railway handles monorepos and long-running servers natively:

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Add a **PostgreSQL** plugin (it auto-sets `DATABASE_URL`)
4. Set the **Start Command**: `node artifacts/api-server/dist/index.cjs`
5. Set the **Build Command**: `pnpm install && pnpm --filter @workspace/api-server run build`
6. For the frontend, deploy `artifacts/real-estate` to Vercel as described in Step 2 above

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NODE_ENV` | Yes | Set to `production` |
| `CLOUDINARY_CLOUD_NAME` | Optional | For image uploads via Cloudinary |
| `CLOUDINARY_API_KEY` | Optional | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Optional | Cloudinary API secret |
| `RESEND_API_KEY` | Optional | For email notifications via Resend |

---

## Database Setup

Before your first deploy, run the Drizzle migration to create tables:

```bash
pnpm --filter @workspace/db run push
```

Make sure `DATABASE_URL` is set in your local `.env` or CI environment.

To seed sample data:
```bash
pnpm --filter @workspace/scripts run seed
```

---

## Local Development

```bash
# Install dependencies
pnpm install

# Push DB schema
pnpm --filter @workspace/db run push

# Seed sample data (optional)
pnpm --filter @workspace/scripts run seed

# Start all services
pnpm --filter @workspace/api-server run dev   # API at :8080
pnpm --filter @workspace/real-estate run dev   # Frontend at :20263
```
