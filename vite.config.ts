import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

import manifest from './manifest.json';
import packageJson from './package.json';

function extensionManifest(): Plugin {
  return {
    name: 'extension-manifest',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify({...manifest, version: packageJson.version}, null, 2),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), extensionManifest()],
  resolve: {tsconfigPaths: true},
  build: {
    target: 'chrome120',
    modulePreload: false,
    rolldownOptions: {
      input: {popup: 'popup.html', background: 'src/background/index.ts'},
      output: {
        entryFileNames: chunk =>
          chunk.name === 'background' ? 'background.js' : 'assets/[name]-[hash].js',
      },
    },
  },
});
