import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: false
  },
  plugins: [
    {
      name: 'html-clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url || '';
          const urlPath = rawUrl.split('?')[0].split('#')[0];
          const query = rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '';

          if (urlPath === '/services' || urlPath === '/services/') {
            req.url = '/services.html' + query;
          } else if (urlPath === '/about-us' || urlPath === '/about-us/') {
            req.url = '/about-us.html' + query;
          } else if (urlPath === '/contact' || urlPath === '/contact/') {
            req.url = '/contact.html' + query;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const rawUrl = req.url || '';
          const urlPath = rawUrl.split('?')[0].split('#')[0];
          const query = rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '';

          if (urlPath === '/services' || urlPath === '/services/') {
            req.url = '/services.html' + query;
          } else if (urlPath === '/about-us' || urlPath === '/about-us/') {
            req.url = '/about-us.html' + query;
          } else if (urlPath === '/contact' || urlPath === '/contact/') {
            req.url = '/contact.html' + query;
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        'about-us': resolve(__dirname, 'about-us.html'),
        contact: resolve(__dirname, 'contact.html')
      }
    }
  }
});

