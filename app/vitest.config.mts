import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default defineConfig(configEnv => mergeConfig(
  viteConfig(configEnv),
  defineConfig({
    test: {      
      coverage: {
        provider: 'v8',
        enabled: true,
        exclude: [
          'src/interfaces/**',          
          'src/plugins/**',
          'src/router/**',
          'src/App.vue',
          'src/main.ts',
          '.eslintrc.cjs',
        ]
      },
      reporters: ['verbose'],
      environment: 'jsdom',
      exclude: [
        ...configDefaults.exclude, 
        'e2e/**',
      ],
      root: fileURLToPath(new URL('./', import.meta.url)),
      server: {
        deps: {
          inline: ['vuetify'],
        },
      }
    }
  })
));
