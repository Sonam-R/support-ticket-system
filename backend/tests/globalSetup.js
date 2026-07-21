const path = require('path');
const { execSync } = require('child_process');
const { config } = require('dotenv');

module.exports = async () => {
  const projectRoot = path.resolve(__dirname, '../..');
  config({ path: path.join(projectRoot, '.env.test') });

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in .env.test');
  }

  execSync('npx prisma db push --skip-generate --accept-data-loss', {
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
  });
};
