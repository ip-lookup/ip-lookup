import type { IpLocationApiInputSettings } from '@ip-lookup/core'
import { resolve } from 'node:path'
import { createBrowserIndex } from '@ip-lookup/core/browserIndex'
import { update } from '@ip-lookup/core/db'
import replace from '@rollup/plugin-replace'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es', 'cjs', 'iife'],
      fileName: (format, entryName) => {
        switch (format) {
          case 'es':
            return `${entryName}.mjs`
          case 'cjs':
            return `${entryName}.cjs`
          case 'iife':
            return `${entryName}.min.js`
          default:
            return `${entryName}.js`
        }
      },
      name: 'IpLookup',
    },
    sourcemap: true,
    rollupOptions: {
      plugins: [
        replace({
          preventAssignment: true,
          __CDN_URL__: '"https://cdn.jsdelivr.net/npm/@ip-lookup/country"',
          __DATA_TYPE__: '"country"',
        }),
      ],
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
    dts(),
    {
      name: 'createBrowserIndex',
      async buildStart() {
        const settings: IpLocationApiInputSettings = {
          dataDir: resolve('../../data/country'),
          tmpDataDir: resolve('../../tmp/country'),
          fields: ['country'],
          silent: true,
        }
        await update(settings)
        await createBrowserIndex('country', settings, resolve('./indexes'))
      },
    },
  ],
})
