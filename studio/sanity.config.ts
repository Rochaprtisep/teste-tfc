import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { ptPTLocale } from '@sanity/locale-pt-pt';
import { projectId, dataset } from './env';
import { schemaTypes, SINGLETONS } from './schemas';
import { structure } from './structure';

export default defineConfig({
  name: 'default',
  title: 'TFC — Painel',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool(), ptPTLocale()],
  schema: {
    types: schemaTypes,
    // As páginas únicas (definições, início, contactos) não aparecem em "Criar novo".
    templates: (templates) => templates.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    // Nas páginas únicas só se pode publicar ou descartar alterações (nada de apagar ou duplicar).
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
});
