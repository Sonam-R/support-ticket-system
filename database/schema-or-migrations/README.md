# Schema & Migrations

Database schema and migration files are managed by Prisma in the project root `prisma/` directory.

| Asset | Location |
|-------|----------|
| Schema definition | [`../../prisma/schema.prisma`](../../prisma/schema.prisma) |
| Migration history | [`../../prisma/migrations/`](../../prisma/migrations/) |
| Migration lock | [`../../prisma/migrations/migration_lock.toml`](../../prisma/migrations/migration_lock.toml) |

## Commands

```bash
npm run prisma:generate       # Regenerate client after schema changes
npm run prisma:migrate          # Create/apply migrations (development)
npm run prisma:migrate:deploy   # Apply migrations (production/Docker)
```

See [`../setup-notes.md`](../setup-notes.md) for full setup instructions.
