import { defineArrayMember, defineField, defineType } from 'sanity';
import { DEPARTAMENTOS, NIVEIS_PARCEIRO } from '../listas';
import { imagem, textoRico } from './campos';

const nomeDe = (lista: readonly { title: string; value: string }[], value?: string) =>
  lista.find((x) => x.value === value)?.title;

export const noticia = defineType({
  name: 'noticia',
  title: 'Notícia',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Endereço (URL)',
      type: 'slug',
      description: 'Carrega em "Gerar" depois de escrever o título.',
      options: { source: 'titulo' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'data',
      title: 'Data',
      type: 'date',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    imagem('capa', 'Imagem de capa'),
    defineField({
      name: 'resumo',
      title: 'Resumo',
      type: 'text',
      rows: 2,
      description: 'Uma ou duas frases para a lista de notícias.',
    }),
    textoRico('conteudo', 'Conteúdo'),
  ],
  orderings: [{ title: 'Data (mais recentes)', name: 'dataDesc', by: [{ field: 'data', direction: 'desc' }] }],
  preview: { select: { title: 'titulo', subtitle: 'data', media: 'capa' } },
});

export const membro = defineType({
  name: 'membro',
  title: 'Membro',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    imagem('foto', 'Fotografia', 'De preferência quadrada (ex.: 600×600).'),
    defineField({
      name: 'departamento',
      title: 'Departamento',
      type: 'string',
      options: { list: [...DEPARTAMENTOS] },
      initialValue: 'mecanica',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'cargo', title: 'Cargo', type: 'string', description: 'Ex.: Team Leader, Membro' }),
    defineField({ name: 'curso', title: 'Curso', type: 'string', description: 'Ex.: MEMec' }),
    defineField({
      name: 'epoca',
      title: 'Época',
      type: 'string',
      description: 'Ex.: 2025/26',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
    defineField({
      name: 'ordem',
      title: 'Ordem',
      type: 'number',
      description: 'Números menores aparecem primeiro dentro do departamento.',
      initialValue: 10,
    }),
  ],
  orderings: [{ title: 'Época', name: 'epocaDesc', by: [{ field: 'epoca', direction: 'desc' }] }],
  preview: {
    select: { title: 'nome', departamento: 'departamento', epoca: 'epoca', media: 'foto' },
    prepare: ({ title, departamento, epoca, media }) => ({
      title,
      subtitle: [nomeDe(DEPARTAMENTOS, departamento), epoca].filter(Boolean).join(' · '),
      media,
    }),
  },
});

export const prototipo = defineType({
  name: 'prototipo',
  title: 'Protótipo',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Identificador',
      type: 'slug',
      description: 'Usado no link direto para o protótipo. Carrega em "Gerar".',
      options: { source: 'nome' },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ano', title: 'Ano', type: 'number', validation: (r) => r.required().integer() }),
    imagem('imagem', 'Imagem principal'),
    defineField({ name: 'resumo', title: 'Resumo', type: 'text', rows: 3 }),
    defineField({
      name: 'especificacoes',
      title: 'Especificações',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'especificacao',
          fields: [
            defineField({ name: 'nome', title: 'Característica', type: 'string', description: 'Ex.: Peso' }),
            defineField({ name: 'valor', title: 'Valor', type: 'string', description: 'Ex.: 45 kg' }),
          ],
          preview: { select: { title: 'nome', subtitle: 'valor' } },
        }),
      ],
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
      options: { layout: 'grid' },
    }),
    textoRico('descricao', 'Descrição'),
  ],
  preview: { select: { title: 'nome', subtitle: 'ano', media: 'imagem' } },
});

export const parceiro = defineType({
  name: 'parceiro',
  title: 'Parceiro',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    imagem('logo', 'Logótipo'),
    defineField({ name: 'website', title: 'Website', type: 'url' }),
    defineField({
      name: 'nivel',
      title: 'Nível',
      type: 'string',
      options: { list: [...NIVEIS_PARCEIRO] },
      initialValue: 'apoio',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'ordem', title: 'Ordem', type: 'number', initialValue: 10 }),
  ],
  preview: {
    select: { title: 'nome', nivel: 'nivel', media: 'logo' },
    prepare: ({ title, nivel, media }) => ({ title, subtitle: nomeDe(NIVEIS_PARCEIRO, nivel), media }),
  },
});
