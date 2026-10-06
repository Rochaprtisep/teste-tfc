import { createClient } from '@sanity/client';
import { toHTML, escapeHTML } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';
import { projectId, dataset } from '../../studio/env';
import { DEPARTAMENTOS, NIVEIS_PARCEIRO } from '../../studio/listas';

export { DEPARTAMENTOS, NIVEIS_PARCEIRO };

// O conteúdo é lido do Sanity durante o build. Só o conteúdo publicado é público,
// por isso não é preciso token; os rascunhos no Studio não aparecem no site.
const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
});

// Imagens servidas pelo CDN do Sanity, redimensionadas e em formato moderno.
const img = (field: string, w: number) => `select(defined(${field}.asset) => ${field}.asset->url + "?w=${w}&fit=max&auto=format")`;

// Texto rico: as imagens embebidas trazem já o URL.
const rico = (field: string) => `"${field}": coalesce(${field}[]{..., _type == "image" => {"url": asset->url + "?w=1200&fit=max&auto=format"}}, [])`;

export function renderRico(blocks: PortableTextBlock[]) {
  return toHTML(blocks, {
    components: {
      types: {
        image: ({ value }) =>
          value.url ? `<img src="${escapeHTML(value.url)}" alt="${escapeHTML(value.alt ?? '')}" loading="lazy" />` : '',
      },
    },
  });
}

export interface Definicoes {
  nome: string;
  nomeCurto: string;
  descricao: string;
  logo: string | null;
  epocaAtual: string;
  email: string;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  youtube: string | null;
}

let definicoes: Promise<Definicoes> | undefined;

// Usado em todas as páginas (cabeçalho e rodapé), por isso só é pedido uma vez por build.
export function getDefinicoes() {
  definicoes ??= client
    .fetch<Omit<Definicoes, 'nomeCurto'> & { nomeCurto: string | null }>(
      `*[_id == "definicoes"][0]{
        "nome": coalesce(nome, ""), nomeCurto, "descricao": coalesce(descricao, ""),
        "logo": ${img('logo', 200)}, "epocaAtual": coalesce(epocaAtual, ""), "email": coalesce(email, ""),
        instagram, linkedin, facebook, youtube
      }`
    )
    .then((d) => {
      if (!d) throw new Error('Falta o documento "Definições gerais" no Sanity.');
      return { ...d, nomeCurto: d.nomeCurto || d.nome };
    });
  return definicoes;
}

export interface Inicio {
  titulo: string;
  subtitulo: string | null;
  imagem: string | null;
  botaoTexto: string | null;
  botaoLink: string | null;
  sobreTitulo: string | null;
  sobreTexto: string | null;
  numeros: { valor: string; legenda: string }[];
}

export async function getInicio() {
  const d = await client.fetch<Inicio | null>(
    `*[_id == "inicio"][0]{
      "titulo": coalesce(titulo, ""), subtitulo, "imagem": ${img('imagem', 1400)},
      botaoTexto, botaoLink, sobreTitulo, sobreTexto,
      "numeros": coalesce(numeros[]{valor, legenda}, [])
    }`
  );
  if (!d) throw new Error('Falta o documento "Página inicial" no Sanity.');
  return d;
}

export interface Contactos {
  introducao: string | null;
  morada: string | null;
  mapaUrl: string | null;
  contactosExtra: { area: string; email: string }[];
}

export async function getContactos() {
  const d = await client.fetch<Contactos | null>(
    `*[_id == "contactos"][0]{ introducao, morada, mapaUrl, "contactosExtra": coalesce(contactosExtra[]{area, email}, []) }`
  );
  return d ?? { introducao: null, morada: null, mapaUrl: null, contactosExtra: [] };
}

export interface Noticia {
  slug: string;
  titulo: string;
  data: string;
  capa: string | null;
  resumo: string;
  conteudo: PortableTextBlock[];
}

export function getNoticias() {
  return client.fetch<Noticia[]>(
    `*[_type == "noticia" && defined(slug.current)] | order(data desc){
      "slug": slug.current, "titulo": coalesce(titulo, ""), data,
      "capa": ${img('capa', 1400)}, "resumo": coalesce(resumo, ""), ${rico('conteudo')}
    }`
  );
}

export interface Membro {
  nome: string;
  foto: string | null;
  departamento: string;
  cargo: string | null;
  curso: string | null;
  epoca: string;
  linkedin: string | null;
  ordem: number | null;
}

export function getMembros() {
  return client.fetch<Membro[]>(
    `*[_type == "membro"]{
      "nome": coalesce(nome, ""), "foto": ${img('foto', 600)}, departamento, cargo, curso,
      "epoca": coalesce(epoca, ""), linkedin, ordem
    }`
  );
}

export interface Prototipo {
  slug: string;
  nome: string;
  ano: number;
  imagem: string | null;
  resumo: string | null;
  especificacoes: { nome: string; valor: string }[];
  galeria: string[];
  descricao: PortableTextBlock[];
}

export function getPrototipos() {
  return client.fetch<Prototipo[]>(
    `*[_type == "prototipo"] | order(ano desc){
      "slug": slug.current, "nome": coalesce(nome, ""), ano, "imagem": ${img('imagem', 1200)}, resumo,
      "especificacoes": coalesce(especificacoes[]{nome, valor}, []),
      "galeria": coalesce(galeria[defined(asset)].asset->url, []),
      ${rico('descricao')}
    }`
  );
}

export interface Parceiro {
  nome: string;
  logo: string | null;
  website: string | null;
  nivel: string;
  ordem: number | null;
}

export function getParceiros() {
  return client.fetch<Parceiro[]>(
    `*[_type == "parceiro"]{ "nome": coalesce(nome, ""), "logo": ${img('logo', 600)}, website, nivel, ordem }`
  );
}

export function formatDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
