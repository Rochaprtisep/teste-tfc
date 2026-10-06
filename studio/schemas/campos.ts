import { defineArrayMember, defineField } from 'sanity';

export const imagem = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'image',
    options: { hotspot: true },
  });

// Texto formatado: parágrafos, títulos, listas, links e imagens.
export const textoRico = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Título', value: 'h2' },
          { title: 'Subtítulo', value: 'h3' },
          { title: 'Citação', value: 'blockquote' },
        ],
      }),
      defineArrayMember({
        type: 'image',
        options: { hotspot: true },
        fields: [defineField({ name: 'alt', title: 'Descrição da imagem', type: 'string' })],
      }),
    ],
  });
