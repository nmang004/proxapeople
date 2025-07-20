/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/tests/setup.ts'],
    include: [
      'client/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'server/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'shared/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'client/tests/',
        'server/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.{git,cache,output,temp}/**'
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@/components': path.resolve(__dirname, './client/src/components'),
      '@/shared': path.resolve(__dirname, './client/src/shared'),
      '@/features': path.resolve(__dirname, './client/src/features'),
      '@/app': path.resolve(__dirname, './client/src/app'),
      '@/lib': path.resolve(__dirname, './client/src/lib'),
      '@/hooks': path.resolve(__dirname, './client/src/hooks'),
      '@assets': path.resolve(__dirname, './client/src/assets')
    }
  }
})