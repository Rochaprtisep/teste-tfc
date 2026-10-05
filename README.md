# Site da TFC

Site estático em [Astro](https://astro.build), com o conteúdo gerido pelo [Keystatic](https://keystatic.com).
Não tem base de dados nem servidor: o build gera HTML puro em `dist/`.

## Começar

```sh
npm install
npm run dev
```

- Site: http://127.0.0.1:4321
- Painel de edição: http://127.0.0.1:4321/keystatic

`npm run build` gera o site final em `dist/`.

## Onde está cada coisa

| O quê | Onde |
| --- | --- |
| Conteúdo (textos, membros, notícias…) | `src/content/` (ficheiros `.yaml` / `.mdoc`, editados pelo painel) |
| Imagens carregadas no painel | `public/images/<secção>/` |
| Campos do painel (o que se pode editar) | `keystatic.config.ts` |
| Páginas | `src/pages/` |
| Cores e estilos globais | `src/styles/global.css` (variáveis no topo, ex. `--accent`) |

### Mudar de época

1. Painel → **Definições gerais** → alterar **Época atual** (ex.: `2026/27`).
2. Adicionar os novos membros com essa época.

Os membros de épocas anteriores ficam guardados mas deixam de aparecer na página Equipa.

### Departamentos e níveis de parceiro

As listas estão em `keystatic.config.ts` (`DEPARTAMENTOS`, `NIVEIS_PARCEIRO`). A ordem nessa lista é a ordem no site.

## Publicação e painel online

O site é pré-renderizado (HTML estático) e alojado no **Cloudflare Workers**.
Só o painel (`/keystatic` e `/api/keystatic/*`) corre como código no servidor.

- Em `npm run dev`, o painel edita os **ficheiros locais**.
- Em produção, o painel grava no **GitHub** (`Rochaprtisep/teste-tfc`). Cada "Guardar" cria um commit, e o Cloudflare reconstrói o site.

### 1. Criar a GitHub App (uma vez)

1. Fazer push do projeto para o GitHub.
2. Criar um ficheiro `.env` com `PUBLIC_KEYSTATIC_GITHUB=true` e (re)iniciar `npm run dev`.
3. Abrir http://127.0.0.1:4321/keystatic e seguir o assistente:
   - dar um nome à app (ex.: `tfc-keystatic`);
   - indicar o URL de produção, para registar o callback do login;
   - criar a app no GitHub.
   O assistente acrescenta ao `.env` as chaves `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
4. Reiniciar `npm run dev`, instalar a app no repositório (o painel mostra o link) e fazer login.

O `.env` nunca vai para o Git. Guarda estas chaves num sítio seguro.

### 2. Ligar ao Cloudflare

1. No Cloudflare: **Workers & Pages → Create → Import a repository** e escolher o repositório.
2. Build command: `npm run build` · Deploy command: `npx wrangler deploy`.
3. Em **Settings → Variables and Secrets**:
   - `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, como variável de **build**;
   - `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET` e `KEYSTATIC_SECRET`, como **secrets** do Worker (runtime).
4. Se o URL final mudar (domínio próprio), acrescentar na GitHub App o callback
   `https://<domínio>/api/keystatic/github/oauth/callback`.

### 3. Domínio

Pedir à DSI do Técnico um registo CNAME de `tfcell.tecnico.ulisboa.pt` para o Worker.

### Dar acesso a editores

Cada editor precisa de uma conta GitHub com acesso de escrita ao repositório: **Settings → Collaborators**. Para editar, entra em `https://<domínio>/keystatic`.

