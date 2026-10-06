import type { StructureBuilder, StructureResolver } from 'sanity/structure';

// Páginas únicas: abrem diretamente o documento, sem lista.
const pagina = (S: StructureBuilder, id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      pagina(S, 'definicoes', 'Definições gerais'),
      pagina(S, 'inicio', 'Página inicial'),
      pagina(S, 'contactos', 'Contactos'),
      S.divider(),
      S.listItem()
        .title('Notícias')
        .schemaType('noticia')
        .child(S.documentTypeList('noticia').title('Notícias').defaultOrdering([{ field: 'data', direction: 'desc' }])),
      S.documentTypeListItem('membro').title('Membros'),
      S.documentTypeListItem('prototipo').title('Protótipos (Garagem)'),
      S.documentTypeListItem('parceiro').title('Parceiros'),
    ]);
