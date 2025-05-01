import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false,
                drop_debugger: true
            }
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    'three': ['three'],
                    'ws': ['ws']
                },
                format: 'es',
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    publicDir: 'public',
    assetsInclude: [
        '**/*.glb', '**/*.gltf', '**/*.fbx', '**/*.obj', '**/*.mtl',
        '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp',
        '**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf',
        '**/*.mp4', '**/*.webm', '**/*.ogg', '**/*.mp3', '**/*.wav'
    ],
    base: './',
    copyPublicDir: true,
    optimizeDeps: {
        include: ['three', 'ws'],
        exclude: ['@tweenjs/tween.js']
    },
    preview: {
        port: 4173,
        strictPort: true,
        host: true
    }
}); 