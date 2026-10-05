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

## Publicação (próximos passos)

Neste momento o painel funciona em **modo local**: edita os ficheiros no teu computador. Para os editores usarem o painel online, sem instalar nada:

1. Criar um repositório no GitHub e fazer push deste projeto.
2. Ligar o repositório ao **Cloudflare Pages** (build: `npm run build`, pasta: `dist`). Cada commit publica o site.
3. Mudar o `storage` em `keystatic.config.ts` para `{ kind: 'github', repo: 'organizacao/repositorio' }`, ou usar o Keystatic Cloud.
   Como o painel precisa de rotas de servidor, o deploy online do `/keystatic` requer um adapter do Astro. Ver a documentação do Keystatic sobre o modo GitHub.
4. Pedir à DSI do Técnico um registo CNAME de `tfcell.tecnico.ulisboa.pt` para o novo alojamento.

Com o modo GitHub, cada "Guardar" no painel cria um commit, e o Cloudflare reconstrói o site em cerca de um minuto.
