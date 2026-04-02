# Vercel Deployment Guide

This guide explains how to deploy the Daphne's Root API server to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com)
- A PostgreSQL database (e.g., from AWS RDS, DigitalOcean, Railway, or Supabase)
- The repository connected to Vercel via GitHub

## Deployment Architecture

The project uses Vercel's serverless function pattern:
- API routes are defined in the `api/` folder
- Vercel auto-detects and deploys TypeScript files as serverless functions
- The main handler is `api/index.ts` which exports an Express app
- All requests are routed through the Express app

## Deployment Steps

### 1. Set Up Your PostgreSQL Database

You'll need a PostgreSQL database to store game data. Choose one:

- **Railway**: Quick setup, good free tier - https://railway.app
- **Supabase**: PostgreSQL hosting - https://supabase.com
- **AWS RDS**: Production-grade
- **DigitalOcean**: Managed databases

Once provisioned, you'll have a `DATABASE_URL` connection string.

### 2. Connect Repository to Vercel

1. Push your repository to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Vercel will auto-detect the monorepo setup

### 3. Configure Environment Variables

In the Vercel dashboard:

1. Go to your project settings → **Environment Variables**
2. Add the following variables:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NODE_ENV` | `production` | `production` |

### 4. Deploy

Simply push your changes to the main branch in GitHub. Vercel will automatically:

1. Install dependencies with `pnpm`
2. Run TypeScript compilation
3. Deploy the `api/index.ts` as a serverless function
4. All routes are handled by the Express app

**That's it!** No additional configuration needed.

## Verification

After deployment:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app/`)
2. Expected response: `{ "status": "ok", "message": "API is running" }`
3. Check the health endpoint: `GET https://your-project.vercel.app/api/healthz`
4. Expected response: `{ "status": "ok" }`

## How It Works

The `api/index.ts` file exports an Express app that Vercel automatically wraps in a serverless function handler. All HTTP requests to your deployment are routed through this Express instance, allowing you to:

- Use Express middleware (CORS, logging, parsing, etc.)
- Define routes in `artifacts/api-server/src/routes/`
- Access the full Express ecosystem

## Running Database Migrations

The database schema is defined in `lib/db/src/schema/index.ts` and currently is empty (placeholder).

To run migrations once you've added tables:

```bash
pnpm -F @workspace/db run push
```

For production, use:

```bash
DATABASE_URL="your-production-db-url" pnpm -F @workspace/db run push
```

## Local Development

To test locally before deploying:

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL

# Run the API server from the monorepo root
pnpm --filter @workspace/api-server run dev

# The server will be available at http://localhost:3000
```

Or use Vercel CLI to test the serverless function locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally with serverless function emulation
vercel dev

# Server available at http://localhost:3000
```

## Troubleshooting

### "No Output Directory named public found"

This error means Vercel couldn't find a static output directory. This is expected and not an issue—the project uses serverless functions, not static hosting.

**Solution**: Make sure your `vercel.json` is correctly configured. The current `vercel.json` is correct and uses the `api/` folder pattern.

### Build Fails on Vercel

- Check the Vercel build logs in the dashboard
- Ensure `pnpm-lock.yaml` is committed to git
- Verify `DATABASE_URL` is set in environment variables
- Check that `api/index.ts` exists and is at the root level

### TypeScript Errors

If you see TypeScript errors:
- Ensure TypeScript is correctly configured: `api/tsconfig.json` and `tsconfig.base.json`
- Run `pnpm run typecheck` locally to verify compilation
- Check that all imported modules are available

### Database Connection Errors

- Verify `DATABASE_URL` is correct in Environment Variables
- Ensure your database is accessible from Vercel's servers
- Check database credentials and connection limits

## Project Structure

```
/
├── api/                           ← Vercel serverless entrypoint
│   ├── index.ts                   ← Main handler (Express app)
│   └── tsconfig.json              ← TypeScript config for API
├── artifacts/
│   ├── api-server/                ← Express server source
│   │   └── src/routes/            ← Route definitions
│   └── daphnes-root/              ← Frontend game
├── lib/
│   ├── api-spec/                  ← OpenAPI definition
│   ├── api-client-react/          ← Generated hooks
│   ├── api-zod/                   ← Generated schemas
│   └── db/                        ← Drizzle ORM + schema
├── vercel.json                    ← Deployment config
└── pnpm-workspace.yaml            ← Monorepo config
```

## Next Steps

1. **Verify deployment** works (test `/api/healthz` endpoint)
2. **Add more API routes** in `artifacts/api-server/src/routes/`
3. **Define database schema** in `lib/db/src/schema/`
4. **Update OpenAPI spec** in `lib/api-spec/openapi.yaml`
5. **Regenerate clients**: `pnpm --filter @workspace/api-spec run codegen`
6. **Deploy updated code** (just push to GitHub)

## Additional Resources

- [Vercel Node.js Documentation](https://vercel.com/docs/functions/serverless-functions/node-js)
- [Express.js Guide](https://expressjs.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Vercel CLI Docs](https://vercel.com/cli)
