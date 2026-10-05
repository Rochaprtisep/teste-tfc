import { config, collection, singleton, fields } from '@keystatic/core';

// Imagens ficam em /public/images/<pasta> e são servidas em /images/<pasta>.
const image = (label: string, folder: string, opts: { required?: boolean; description?: string } = {}) =>
  fields.image({
    label,
    description: opts.description,
    directory: `public/images/${folder}`,
    publicPath: `/images/${folder}/`,
    validation: { isRequired: opts.required ?? false },
  });

const richText = (label: string, folder: string) =>
  fields.markdoc({
    label,
    options: {
      image: { directory: `public/images/${folder}`, publicPath: `/images/${folder}/` },
    },
  });

export const DEPARTAMENTOS = [
  { label: 'Direção', value: 'direcao' },
  { label: 'Mecânica', value: 'mecanica' },
  { label: 'Elétrica e Eletrónica', value: 'eletrica' },
  { label: 'Hidrogénio e Fuel Cell', value: 'fuelcell' },
  { label: 'Software e Dados', value: 'software' },
  { label: 'Marketing e Parcerias', value: 'marketing' },
] as const;

export const NIVEIS_PARCEIRO = [
  { label: 'Parceiro principal', value: 'principal' },
  { label: 'Ouro', value: 'ouro' },
  { label: 'Prata', value: 'prata' },
  { label: 'Apoio', value: 'apoio' },
] as const;

// Em `npm run dev` edita os ficheiros locais; em produção grava no GitHub.
// Para testar o modo GitHub localmente: PUBLIC_KEYSTATIC_GITHUB=true no .env
const useGithub = import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_GITHUB === 'true';

export default config({
  storage: useGithub
    ? { kind: 'github', repo: { owner: 'Rochaprtisep', name: 'teste-tfc' } }
    : { kind: 'local' },
  ui: {
    brand: { name: 'TFC — Painel' },
    navigation: {
      Páginas: ['definicoes', 'inicio', 'contactos'],
      Conteúdo: ['noticias', 'membros', 'prototipos', 'parceiros'],
    },
  },

  singletons: {
    definicoes: singleton({
      label: 'Definições gerais',
      path: 'src/content/definicoes',
      format: { data: 'yaml' },
      schema: {
        nome: fields.text({ label: 'Nome do núcleo', validation: { isRequired: true } }),
        nomeCurto: fields.text({ label: 'Sigla', description: 'Aparece no menu, ex.: TFC' }),
        descricao: fields.text({
          label: 'Descrição curta',
          description: 'Usada nos motores de busca e nas pré-visualizações de links.',
          multiline: true,
        }),
        logo: image('Logótipo', 'site'),
        epocaAtual: fields.text({
          label: 'Época atual',
          description: 'Ex.: 2025/26. A página Equipa mostra os membros desta época.',
          validation: { isRequired: true },
        }),
        email: fields.text({ label: 'Email de contacto' }),
        instagram: fields.url({ label: 'Instagram' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        facebook: fields.url({ label: 'Facebook' }),
        youtube: fields.url({ label: 'YouTube' }),
      },
    }),

    inicio: singleton({
      label: 'Página inicial',
      path: 'src/content/inicio',
      format: { data: 'yaml' },
      schema: {
        titulo: fields.text({ label: 'Título principal', validation: { isRequired: true } }),
        subtitulo: fields.text({ label: 'Subtítulo', multiline: true }),
        imagem: image('Imagem de destaque', 'inicio'),
        botaoTexto: fields.text({ label: 'Texto do botão', defaultValue: 'Conhece a equipa' }),
        botaoLink: fields.text({ label: 'Link do botão', defaultValue: '/equipa' }),
        sobreTitulo: fields.text({ label: 'Secção "Sobre nós" — título', defaultValue: 'Quem somos' }),
        sobreTexto: fields.text({ label: 'Secção "Sobre nós" — texto', multiline: true }),
        numeros: fields.array(
          fields.object({
            valor: fields.text({ label: 'Valor', description: 'Ex.: 40+' }),
            legenda: fields.text({ label: 'Legenda', description: 'Ex.: membros' }),
          }),
          { label: 'Números em destaque', itemLabel: (p) => `${p.fields.valor.value} ${p.fields.legenda.value}` }
        ),
      },
    }),

    contactos: singleton({
      label: 'Contactos',
      path: 'src/content/contactos',
      format: { data: 'yaml' },
      schema: {
        introducao: fields.text({ label: 'Texto de introdução', multiline: true }),
        morada: fields.text({ label: 'Morada', multiline: true }),
        mapaUrl: fields.url({ label: 'Link para o mapa (Google Maps / OpenStreetMap)' }),
        contactosExtra: fields.array(
          fields.object({
            area: fields.text({ label: 'Área', description: 'Ex.: Parcerias' }),
            email: fields.text({ label: 'Email' }),
          }),
          { label: 'Contactos por área', itemLabel: (p) => p.fields.area.value || 'Contacto' }
        ),
      },
    }),
  },

  collections: {
    noticias: collection({
      label: 'Notícias',
      slugField: 'titulo',
      path: 'src/content/noticias/*',
      format: { contentField: 'conteudo' },
      entryLayout: 'content',
      columns: ['titulo', 'data'],
      schema: {
        titulo: fields.slug({ name: { label: 'Título' }, slug: { label: 'Endereço (URL)' } }),
        data: fields.date({ label: 'Data', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        capa: image('Imagem de capa', 'noticias'),
        resumo: fields.text({ label: 'Resumo', description: 'Uma ou duas frases para a lista de notícias.', multiline: true }),
        conteudo: richText('Conteúdo', 'noticias'),
      },
    }),

    membros: collection({
      label: 'Membros',
      slugField: 'nome',
      path: 'src/content/membros/*',
      format: { data: 'yaml' },
      columns: ['nome', 'departamento', 'epoca'],
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        foto: image('Fotografia', 'membros', { description: 'De preferência quadrada (ex.: 600×600).' }),
        departamento: fields.select({ label: 'Departamento', options: [...DEPARTAMENTOS], defaultValue: 'mecanica' }),
        cargo: fields.text({ label: 'Cargo', description: 'Ex.: Team Leader, Membro' }),
        curso: fields.text({ label: 'Curso', description: 'Ex.: MEMec' }),
        epoca: fields.text({ label: 'Época', description: 'Ex.: 2025/26', validation: { isRequired: true } }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        ordem: fields.integer({ label: 'Ordem', description: 'Números menores aparecem primeiro dentro do departamento.', defaultValue: 10 }),
      },
    }),

    prototipos: collection({
      label: 'Protótipos (Garagem)',
      slugField: 'nome',
      path: 'src/content/prototipos/*',
      format: { contentField: 'descricao' },
      columns: ['nome', 'ano'],
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        ano: fields.integer({ label: 'Ano', validation: { isRequired: true } }),
        imagem: image('Imagem principal', 'prototipos'),
        resumo: fields.text({ label: 'Resumo', multiline: true }),
        especificacoes: fields.array(
          fields.object({
            nome: fields.text({ label: 'Característica', description: 'Ex.: Peso' }),
            valor: fields.text({ label: 'Valor', description: 'Ex.: 45 kg' }),
          }),
          { label: 'Especificações', itemLabel: (p) => `${p.fields.nome.value}: ${p.fields.valor.value}` }
        ),
        galeria: fields.array(image('Imagem', 'prototipos'), { label: 'Galeria' }),
        descricao: richText('Descrição', 'prototipos'),
      },
    }),

    parceiros: collection({
      label: 'Parceiros',
      slugField: 'nome',
      path: 'src/content/parceiros/*',
      format: { data: 'yaml' },
      columns: ['nome', 'nivel'],
      schema: {
        nome: fields.slug({ name: { label: 'Nome' } }),
        logo: image('Logótipo', 'parceiros'),
        website: fields.url({ label: 'Website' }),
        nivel: fields.select({ label: 'Nível', options: [...NIVEIS_PARCEIRO], defaultValue: 'apoio' }),
        ordem: fields.integer({ label: 'Ordem', defaultValue: 10 }),
      },
    }),
  },
});
