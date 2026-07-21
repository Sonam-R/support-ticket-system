# Seed Data

Demo data is seeded via Prisma in the project root `prisma/` directory.

| Asset | Location |
|-------|----------|
| Seed script | [`../../prisma/seed.js`](../../prisma/seed.js) |

## Run Seed

```bash
npm run prisma:seed
```

Docker auto-seeds when the database has no users (see `scripts/docker-backend-entrypoint.sh`).

## Seed Contents

- 8 users (1 Admin, 3 Support Agents, 4 Viewers)
- 5 sample tickets with comments and history
- Default password: `Password123`

See [`../setup-notes.md`](../setup-notes.md) for account details.
