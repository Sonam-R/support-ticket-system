# Database

Database assets are managed via Prisma in the `prisma/` directory.

| Asset | Location |
|-------|----------|
| Schema | `prisma/schema.prisma` |
| Migrations | `prisma/migrations/` |
| Seed script | `prisma/seed.js` |

## Commands

```bash
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate    # Run migrations (development)
npm run prisma:seed        # Seed database
```

See [README.md](../README.md) for full database setup instructions.
