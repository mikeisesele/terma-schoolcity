import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'https://schoolcity.test' } },
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      reportsDirectory: 'coverage',
      include: [
        'lib/data.ts',
        'lib/useSchools.ts',
        'lib/useVacancies.ts',
        'app/auth/callback/route.ts',
        'app/vacancies/post/page.tsx',
        'app/compare/page.tsx',
        'app/favourites/page.tsx',
        'app/find/_FindClient.tsx',
        'app/schools/[id]/_SchoolDetailClient.tsx',
      ],
      thresholds: {
        // Preserve the original 75/70 floor across the previously measured
        // data, auth, and vacancy scope.
        'lib/**': { lines: 75, functions: 75, statements: 75, branches: 70 },
        'app/auth/**': { lines: 75, functions: 75, statements: 75, branches: 70 },
        'app/vacancies/**': { lines: 75, functions: 75, statements: 75, branches: 70 },
        // New UI instrumentation starts with explicit per-surface ratchets.
        'app/compare/**': { lines: 100, functions: 100, statements: 100, branches: 50 },
        'app/favourites/**': { lines: 75, functions: 46, statements: 75, branches: 75 },
        'app/find/**': { lines: 75, functions: 31, statements: 57, branches: 53 },
        'app/schools/**': { lines: 47, functions: 30, statements: 37, branches: 34 },
      },
    },
  },
});
