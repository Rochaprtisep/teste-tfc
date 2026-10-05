import { createReader } from '@keystatic/core/reader';
import Markdoc, { type Node } from '@markdoc/markdoc';
import keystaticConfig, { DEPARTAMENTOS, NIVEIS_PARCEIRO } from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export { DEPARTAMENTOS, NIVEIS_PARCEIRO };

export async function getDefinicoes() {
  const d = await reader.singletons.definicoes.readOrThrow();
  return { ...d, nomeCurto: d.nomeCurto || d.nome };
}

export function renderMarkdoc(node: Node) {
  return Markdoc.renderers.html(Markdoc.transform(node));
}

export async function getNoticias() {
  const all = await reader.collections.noticias.all();
  return all.sort((a, b) => b.entry.data.localeCompare(a.entry.data));
}

export function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
