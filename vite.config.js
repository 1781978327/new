import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copy } from 'fs-extra';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    copyPublicDir: true,
    minify: false,
    chunkSizeWarningLimit: 1000,
  },
  base: '/threejs-game/',
  publicDir: 'public',
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.fbx', '**/*.obj', '**/*.mtl', '**/*.jpg', '**/*.png', '**/*.mp3', '**/*.wav'],
  plugins: [
    {
      name: 'copy-assets',
      async buildStart() {
        try {
          const resourceDirs = ['images', 'data', 'js'];
          for (const dir of resourceDirs) {
            if (await import('fs').then(fs => fs.existsSync(dir))) {
              await copy(dir, `dist/${dir}`);
              console.log(`Copied ${dir} to dist/${dir}`);
            }
          }
        } catch (error) {
          console.error('Error copying assets:', error);
        }
      }
    }
  ]
}); 