// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// O site é todo pré-renderizado (HTML estático). Só as rotas do painel
// (/keystatic e /api/keystatic) correm no Cloudflare Workers.
// Em `astro dev` não usamos o adapter: o painel em modo local precisa de Node
// para escrever ficheiros, e falha dentro do runtime do Workers.
const isBuild = process.argv.includes('build');

export default defineConfig({
  site: 'https://tfcell.tecnico.ulisboa.pt',
  output: 'static',
  adapter: isBuild
    ? cloudflare({
        // O conteúdo é lido do disco no build; o runtime do Workers não tem acesso a ficheiros.
        prerenderEnvironment: 'node',
        imageService: 'passthrough',
      })
    : undefined,
  integrations: [react(), keystatic()],
});
