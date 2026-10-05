// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// O painel /keystatic precisa de rotas dinâmicas. Em modo local só faz sentido
// em `astro dev`; o build de produção fica 100% estático (sem servidor).
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://tfcell.tecnico.ulisboa.pt',
  integrations: [react(), ...(isDev ? [keystatic()] : [])],
});
