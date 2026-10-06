# Site da TFC

Site estático em [Astro](https://astro.build), com o conteúdo gerido no [Sanity](https://www.sanity.io).
O build vai buscar o conteúdo ao Sanity e gera HTML puro em `dist/`.

## Começar

```sh
npm install
npm run dev
```

- Site: http://127.0.0.1:4321
- Painel de edição (Studio) online: https://tfcell.sanity.studio
- Studio no teu computador: `npm run studio` (http://localhost:3333). Na primeira vez: `cd studio && npx npm@10 install`.

`npm run build` gera o site final em `dist/`. O conteúdo vem sempre do Sanity, também em `npm run dev`: depois de publicar no Studio, recarrega a página.

👉 **Configuração do Sanity, acesso de editores e problemas comuns: [SANITY.md](SANITY.md).**

## Onde está cada coisa

| O quê | Onde |
| --- | --- |
| Conteúdo (textos, membros, notícias…) | No Sanity, editado no Studio |
| Campos do painel (o que se pode editar) | `studio/schemas/` |
| ID do projeto Sanity | `studio/env.ts` |
| Como o site lê o conteúdo | `src/lib/content.ts` |
| Páginas | `src/pages/` |
| Cores e estilos globais | `src/styles/global.css` (variáveis no topo, ex. `--accent`) |

### Mudar de época

1. Studio → **Definições gerais** → alterar **Época atual** (ex.: `2026/27`) → **Publicar**.
2. Adicionar os novos membros com essa época.

Os membros de épocas anteriores ficam guardados mas deixam de aparecer na página Equipa.

### Departamentos e níveis de parceiro

As listas estão em `studio/listas.ts` (`DEPARTAMENTOS`, `NIVEIS_PARCEIRO`). A ordem nessa lista é a ordem no site.
Depois de mudar, faz `npx sanity deploy` dentro de `studio/` para o Studio online mostrar as opções novas.

## Publicação

O site é pré-renderizado (HTML estático) e alojado no **Cloudflare Workers**. É reconstruído:

- a cada push para `main`;
- a cada publicação no Studio (webhook do Sanity, ver [SANITY.md](SANITY.md)).

### Notas de manutenção

- O Cloudflare usa **npm 10**. Para instalar ou atualizar pacotes, usa `npx npm@10 install <pacote>`. Se usares o npm 11, o `package-lock.json` pode ficar incompatível e o build falha.
- A pasta `studio/` tem o seu próprio `package.json` e não entra no build do site.
- Domínio: pedir à DSI do Técnico um registo CNAME de `tfcell.tecnico.ulisboa.pt` para o Worker.
