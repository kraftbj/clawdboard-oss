# Contributing to clawdboard

Thanks for your interest in contributing! Here's how to get started.

## Local Setup

1. **Fork and clone** the repo
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in the values:
   - **DATABASE_URL** — Create a free database at [neon.tech](https://neon.tech)
   - **AUTH_SECRET** — Run `openssl rand -base64 32`
   - **AUTH_GITHUB_ID / AUTH_GITHUB_SECRET** — Create a [GitHub OAuth App](https://github.com/settings/developers) with callback URL `http://localhost:3001/api/auth/callback/github`

4. **Push the database schema:**
   ```bash
   export DATABASE_URL="your-connection-string"
   npx drizzle-kit push
   ```

5. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app runs on [localhost:3001](http://localhost:3001).

6. **Create the materialized view** (needed for rank snapshots):
   ```
   GET http://localhost:3001/api/cron/refresh
   ```

## Project Structure

```
src/
  app/          # Next.js App Router pages and API routes
  components/   # React components
  lib/          # Shared utilities (db, auth, env, sync)
  actions/      # Server actions
cli/            # CLI package (npm: clawdboard)
plugin/         # Claude Code plugin
```

## Making Changes

1. Create a branch from `main`
2. Make your changes
3. Run `npm run lint` and `npm run build` to check for errors
4. Open a PR with a clear description of what you changed and why

## CLI Development

The CLI lives in `cli/`. To work on it:

```bash
cd cli
npm install
npm run dev    # runs with tsx
npm test       # runs vitest
```

## Guidelines

- Keep PRs focused — one feature or fix per PR
- Follow existing code style (TypeScript, Tailwind CSS v4)
- Don't commit `.env*` files or secrets
- Test your changes locally before opening a PR
