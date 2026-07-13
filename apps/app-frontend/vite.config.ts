import { resolve } from 'path'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

import vue from '@vitejs/plugin-vue'

const projectRootDir = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(projectRootDir, 'src'),
      },
    ],
  },
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 1987,
    strictPort: true,
  },
  build: {
    target: 'chrome64',
    // don't minify for debug builds
    minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: process.env.NODE_ENV !== 'production',
    commonjsOptions: {
      esmExternals: true,
    },
  },
})
