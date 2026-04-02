# Vercel Deployment Guide

This guide explains how to deploy the Daphne's Root API server to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com)
- A PostgreSQL database (e.g., from AWS RDS, DigitalOcean, Railway, or Supabase)
- The repository connected to Vercel via GitHub

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

### 4. Deployment Configuration

The project already includes a `vercel.json` configuration that:

- Uses `pnpm` as the package manager
- Builds with `pnpm run build`
- Runs the compiled Express server
- Routes all requests to the API server

### 5. Deploy

Simply push your changes to the main branch in GitHub. Vercel will automatically:

1. Install dependencies with `pnpm install --frozen-lockfile`
2. Run the build command: `pnpm run build`
3. Deploy the built API server

## Verification

After deployment:

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app/`)
2. Check the health endpoint: `GET https://your-project.vercel.app/api/healthz`
3. Expected response: `{ "status": "ok" }`

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

# Run the API server
pnpm --filter @workspace/api-server run dev

# The server will be available at http://localhost:3000
```

## Troubleshooting

### Build Fails on Vercel

- Check the Vercel build logs
- Ensure `pnpm-lock.yaml` is committed to git
- Verify `DATABASE_URL` is set in environment variables

### "Emit skipped" Errors

These have been fixed in the latest code by:
- Adding explicit type annotations to route handlers
- Using proper namespace imports for `pino-http`

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Ensure your database is accessible from Vercel's servers (whitelist Vercel IPs)
- Check database credentials

## Additional Resources

- [Vercel Node.js Documentation](https://vercel.com/docs/functions/serverless-functions/node-js)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Express.js Guide](https://expressjs.com)

## Next Steps

1. Add more API routes in `artifacts/api-server/src/routes/`
2. Define database schema in `lib/db/src/schema/`
3. Update OpenAPI spec in `lib/api-spec/openapi.yaml`
4. Regenerate API clients: `pnpm --filter @workspace/api-spec run codegen`
5. Deploy updated code
