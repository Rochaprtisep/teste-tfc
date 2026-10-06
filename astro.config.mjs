// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// O site é todo pré-renderizado (HTML estático): o conteúdo vem do Sanity durante o build.
// O adapter do Cloudflare só é usado no build, para gerar o que o Workers precisa para servir o site.
const isBuild = process.argv.includes('build');

export default defineConfig({
  site: 'https://tfcell.tecnico.ulisboa.pt',
  output: 'static',
  adapter: isBuild
    ? cloudflare({
        prerenderEnvironment: 'node',
        imageService: 'passthrough',
      })
    : undefined,
});
