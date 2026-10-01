// @ts-check
import { defineConfig } from 'astro/config';
import remarkLiens from './src/lib/remark-liens.mjs';

const base = '/mes-fiches-ifsi';

// Le site est servi par GitHub Pages à l'adresse
// https://burrpburrp.github.io/mes-fiches-ifsi/
export default defineConfig({
  site: 'https://burrpburrp.github.io',
  base,
  markdown: {
    remarkPlugins: [[remarkLiens, { base }]],
  },
});
