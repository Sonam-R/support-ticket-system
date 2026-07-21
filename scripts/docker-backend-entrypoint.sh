#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

USER_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
new PrismaClient()
  .user.count()
  .then((count) => {
    console.log(count);
    process.exit(0);
  })
  .catch(() => process.exit(1));
")

if [ "$USER_COUNT" = "0" ]; then
  echo "Database is empty — running seed..."
  node prisma/seed.js
else
  echo "Database already has users — skipping seed."
fi

echo "Starting backend server..."
exec "$@"
