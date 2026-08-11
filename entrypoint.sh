#!/usr/bin/env bash
set -e

echo "Waiting for Postgres..."
until nc -z postgres 5432; do
  sleep 5
done
echo "Postgres is up!"

cd packages/database

# ── Step 1: Migrate as superuser ──────────────────────────────────────────────
echo "Running Prisma migrations as superuser..."
unset DATABASE_URL
export DATABASE_URL="postgresql://postgres:${POSTGRES_PW}@postgres:5432/${POSTGRES_DB}"

npx prisma migrate dev --name added-changes --schema="prisma/schema.prisma"

# npx prisma migrate deploy --schema="prisma/schema.prisma"

# ── Step 2: Generate Prisma client ────────────────────────────────────────────
echo "Generating Prisma client..."
npx prisma generate --schema="prisma/schema.prisma"

# ── Step 3: Grant permissions AFTER tables exist ──────────────────────────────
echo "Granting table permissions to app_user..."
POSTGRES_PW=${POSTGRES_PW} \
POSTGRES_DB=${POSTGRES_DB} \
APP_USER_PW=${APP_USER_PW} \
  npx tsx scripts/grant-permissions.ts

cd ../..

# ── Step 4: Start app as app_user (RLS enforced) ──────────────────────────────
echo "Starting Node app as app_user..."
unset DATABASE_URL
export DATABASE_URL="postgresql://app_user:${APP_USER_PW}@postgres:5432/${POSTGRES_DB}"
echo "App DATABASE_URL: $DATABASE_URL"

cd apps/api
exec npm run dev