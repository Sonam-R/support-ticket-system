# Database Setup Notes

PostgreSQL 17 with Prisma ORM. Schema, migrations, and seed are managed in the `prisma/` directory.

## Prerequisites

- PostgreSQL 17 running locally, or Docker Compose (`docker compose up --build`)
- Node.js 22 LTS (18+ supported)
- `.env` configured from `.env.example`

## Environment Variables

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/support_ticket_system
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=support_ticket_system
```

For tests, create `.env.test`:

```env
DATABASE_URL=postgresql://USER@localhost:5432/support_ticket_test
JWT_SECRET=test-jwt-secret
JWT_EXPIRES_IN=1h
```

## Setup Commands

```bash
npm install
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Apply migrations (development)
npm run prisma:seed        # Seed demo data
```

| Task | Command |
|------|---------|
| Generate client | `npm run prisma:generate` |
| Run migrations (dev) | `npm run prisma:migrate` |
| Run migrations (prod/Docker) | `npm run prisma:migrate:deploy` |
| Seed database | `npm run prisma:seed` |
| Reset database | `npm run prisma:reset` |

## Docker

Migrations run automatically on backend startup via `scripts/docker-backend-entrypoint.sh`. Seed runs when the database has zero users.

```bash
cp .env.example .env
docker compose up --build
```

## Seed Data

Default password for all seed users: `Password123`

| Role | Example email |
|------|---------------|
| Admin | `william.carter@supportdesk.com` |
| Support Agent | `sarah.mitchell@supportdesk.com` |
| Viewer | `emma.johnson@supportdesk.com` |

Seed script: [`../prisma/seed.js`](../prisma/seed.js)

## Asset Locations

| Asset | Path |
|-------|------|
| Schema | [`prisma/schema.prisma`](../prisma/schema.prisma) |
| Migrations | [`prisma/migrations/`](../prisma/migrations/) |
| Seed | [`prisma/seed.js`](../prisma/seed.js) |

See also [`data-model.md`](../data-model.md) for entity relationships.
