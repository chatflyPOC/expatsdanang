#!/usr/bin/env bash
#
# Applies one SQL migration to the project's Supabase database.
#
# DDL cannot go through the REST API, so migrations have until now been pasted
# into the dashboard's SQL editor by hand. This runs the same file through psql
# instead, inside a transaction with ON_ERROR_STOP, so a migration either lands
# whole or not at all.
#
# Needs SUPABASE_DB_URL in .env.local — the connection string from
# Supabase Dashboard → Project Settings → Database → Connection string → URI
# (session pooler). It contains the database password, so it stays in
# .env.local and is never echoed by this script.
#
# Usage: ./scripts/apply-migration.sh supabase/migrations/007_directory.sql

set -euo pipefail

FILE="${1:-}"
if [ -z "$FILE" ]; then
  echo "usage: $0 <path/to/migration.sql>" >&2
  exit 64
fi
if [ ! -f "$FILE" ]; then
  echo "no such file: $FILE" >&2
  exit 66
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "missing $ENV_FILE" >&2
  exit 69
fi

# Read the one variable rather than sourcing the whole file: .env.local holds
# API keys and a GCS private key with newlines that a shell `source` mangles.
# `|| true` because `set -e` would otherwise abort on grep's no-match exit
# status, skipping the instructions below.
DB_URL="$(grep -m1 '^SUPABASE_DB_URL=' "$ENV_FILE" | cut -d= -f2- | sed 's/^"//; s/"$//' || true)"

if [ -z "$DB_URL" ]; then
  cat >&2 <<'MSG'
SUPABASE_DB_URL is not set in .env.local.

Get it from Supabase Dashboard → Project Settings → Database →
Connection string → URI, then add one line to .env.local:

  SUPABASE_DB_URL=postgresql://postgres.<ref>:<password>@<host>:5432/postgres
MSG
  exit 78
fi

echo "Applying $(basename "$FILE")…"
psql "$DB_URL" -v ON_ERROR_STOP=1 --single-transaction -f "$FILE"
echo "Done."
