import { defineArrayMember, defineField, defineType } from 'sanity';
import { imagem } from './campos';

export const definicoes = defineType({
  name: 'definicoes',
  title: 'Definições gerais',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome do núcleo', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'nomeCurto', title: 'Sigla', type: 'string', description: 'Aparece no menu, ex.: TFC' }),
    defineField({
      name: 'descricao',
      title: 'Descrição curta',
      type: 'text',
      rows: 3,
      description: 'Usada nos motores de busca e nas pré-visualizações de links.',
    }),
    imagem('logo', 'Logótipo'),
    defineField({
      name: 'epocaAtual',
      title: 'Época atual',
      type: 'string',
      description: 'Ex.: 2025/26. A página Equipa mostra os membros desta época.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'email', title: 'Email de contacto', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
    defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
    defineField({ name: 'facebook', title: 'Facebook', type: 'url' }),
    defineField({ name: 'youtube', title: 'YouTube', type: 'url' }),
  ],
});

export const inicio = defineType({
  name: 'inicio',
  title: 'Página inicial',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título principal', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'text', rows: 2 }),
    imagem('imagem', 'Imagem de destaque'),
    defineField({ name: 'botaoTexto', title: 'Texto do botão', type: 'string', initialValue: 'Conhece a equipa' }),
    defineField({ name: 'botaoLink', title: 'Link do botão', type: 'string', initialValue: '/equipa' }),
    defineField({ name: 'sobreTitulo', title: 'Secção "Sobre nós" — título', type: 'string', initialValue: 'Quem somos' }),
    defineField({
      name: 'sobreTexto',
      title: 'Secção "Sobre nós" — texto',
      type: 'text',
      rows: 6,
      description: 'Deixa uma linha em branco entre parágrafos.',
    }),
    defineField({
      name: 'numeros',
      title: 'Números em destaque',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'numero',
          fields: [
            defineField({ name: 'valor', title: 'Valor', type: 'string', description: 'Ex.: 40+' }),
            defineField({ name: 'legenda', title: 'Legenda', type: 'string', description: 'Ex.: membros' }),
          ],
          preview: { select: { title: 'valor', subtitle: 'legenda' } },
        }),
      ],
    }),
  ],
});

export const contactos = defineType({
  name: 'contactos',
  title: 'Contactos',
  type: 'document',
  fields: [
    defineField({ name: 'introducao', title: 'Texto de introdução', type: 'text', rows: 3 }),
    defineField({ name: 'morada', title: 'Morada', type: 'text', rows: 3 }),
    defineField({ name: 'mapaUrl', title: 'Link para o mapa (Google Maps / OpenStreetMap)', type: 'url' }),
    defineField({
      name: 'contactosExtra',
      title: 'Contactos por área',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contacto',
          fields: [
            defineField({ name: 'area', title: 'Área', type: 'string', description: 'Ex.: Parcerias' }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
          ],
          preview: { select: { title: 'area', subtitle: 'email' } },
        }),
      ],
    }),
  ],
});
