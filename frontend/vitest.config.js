import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['src/**/*.test.{js,jsx}'],
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      globals: true,
      testTimeout: 15000,
    },
  }),
);
