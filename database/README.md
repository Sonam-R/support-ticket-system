# Database

PostgreSQL database assets for the Support Ticket Management System.

## Contents

| Folder / File | Description |
|---------------|-------------|
| [setup-notes.md](./setup-notes.md) | Environment, commands, Docker, and seed accounts |
| [schema-or-migrations/](./schema-or-migrations/) | Pointer to Prisma schema and migrations |
| [seed-data/](./seed-data/) | Pointer to Prisma seed script |

## Prisma (source of truth)

Schema, migrations, and seed live in [`../prisma/`](../prisma/):

| Asset | Path |
|-------|------|
| Schema | `prisma/schema.prisma` |
| Migrations | `prisma/migrations/` |
| Seed | `prisma/seed.js` |

## Quick Start

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

See [setup-notes.md](./setup-notes.md) and [README.md](../README.md) for full instructions.
