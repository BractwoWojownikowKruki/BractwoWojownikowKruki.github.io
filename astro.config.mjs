import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://<your-github-username>.github.io/<repo-name>/',
  build: {
    format: 'directory'
  }
});
