import { defineArrayMember, defineField, type ImageRule } from 'sanity';

// Impede publicar enquanto a imagem ainda está a carregar (deixava o documento corrompido).
export const semUploadPendente = (r: ImageRule) =>
  r.custom((v) => (v && '_upload' in v ? 'Espera que a imagem acabe de carregar antes de publicar.' : true));

export const imagem = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: 'image',
    options: { hotspot: true },
    validation: semUploadPendente,
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
        validation: semUploadPendente,
        fields: [defineField({ name: 'alt', title: 'Descrição da imagem', type: 'string' })],
      }),
    ],
  });
