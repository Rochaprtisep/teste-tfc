import { definicoes, inicio, contactos } from './paginas';
import { noticia, membro, prototipo, parceiro } from './colecoes';

export const SINGLETONS = new Set(['definicoes', 'inicio', 'contactos']);

export const schemaTypes = [definicoes, inicio, contactos, noticia, membro, prototipo, parceiro];
