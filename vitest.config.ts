import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    environmentMatchGlobs: [['**/*.dom.test.tsx', 'jsdom']],
    include: ['tests/**/*.test.ts', 'tests/**/*.dom.test.tsx'],
    exclude: ['node_modules', 'e2e'],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
