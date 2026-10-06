# Configurar o Sanity

O conteúdo do site (textos, membros, notícias, protótipos, parceiros) está guardado no [Sanity](https://www.sanity.io), não no GitHub.

**Como funciona:**

- Os editores entram no **Studio** (`https://tfcell.sanity.studio`) com Google, GitHub ou email e password. Não precisam de conta GitHub nem de acesso ao repositório.
- Quando alguém carrega em **Publicar**, o Sanity avisa o Cloudflare, que reconstrói o site em cerca de um minuto.
- O site continua a ser HTML estático. Só vai buscar o conteúdo ao Sanity durante o build.

Isto faz-se **uma vez**. Demora uns 20 minutos.

---

## Passo 1 — Criar o projeto no Sanity

1. Vai a https://www.sanity.io/manage e cria uma conta (podes usar o Google).
2. **Create new project**. Nome: `TFC`. Quando perguntar pelo dataset, escolhe o nome `production` e a visibilidade **Public**.
   > O dataset público só expõe o conteúdo **publicado**, que já vai estar no site de qualquer forma. Os rascunhos ficam privados.
3. Copia o **Project ID** (aparece no topo da página do projeto, algo como `a1b2c3d4`).
4. Abre [studio/env.ts](studio/env.ts) e troca `SUBSTITUIR` pelo Project ID.

## Passo 2 — Instalar e experimentar o Studio no teu computador

Na raiz do projeto:

```powershell
cd studio
npx npm@10 install
npx sanity login
npm run dev
```

Abre http://localhost:3333. Na primeira vez, o Sanity pede para autorizar `localhost:3333` (CORS): aceita.

O Studio está vazio. Para carregar o conteúdo de exemplo que estava no site (definições, página inicial, contactos, membros, parceiros, protótipo e notícia):

```powershell
npm run importar-exemplos
```

Atualiza o Studio e já deve aparecer tudo.

## Passo 3 — Publicar o Studio online

Ainda dentro de `studio/`:

```powershell
npx sanity deploy
```

O Studio fica em `https://tfcell.sanity.studio`. Se o nome `tfcell` já estiver ocupado, muda `studioHost` em [studio/sanity.cli.ts](studio/sanity.cli.ts) e corre outra vez.

No fim, o comando mostra um `appId`. Copia-o para `deployment` em [studio/sanity.cli.ts](studio/sanity.cli.ts) para não voltar a perguntar:

```ts
deployment: { appId: '...', autoUpdates: true },
```

Sempre que mudares os campos (pasta `studio/schemas`), volta a correr `npx sanity deploy`.

## Passo 4 — Reconstruir o site quando alguém publica

O site só muda quando é reconstruído. Para isso acontecer sozinho a cada publicação:

**a) Criar um deploy hook no Cloudflare**

**Workers & Pages** → o projeto → **Settings** → **Builds** → **Deploy Hooks** → **Add deploy hook**. Nome: `sanity`, branch: `main`. Copia o URL que aparece.

**b) Criar o webhook no Sanity**

https://www.sanity.io/manage → o projeto → **API** → **Webhooks** → **Create webhook**:

| Campo | Valor |
| --- | --- |
| Name | `Cloudflare` |
| URL | o URL do deploy hook |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| HTTP method | `POST` |
| Drafts | desligado (só conteúdo publicado) |

**c) Testar:** altera um texto no Studio, carrega em **Publicar** e vê em **Deployments** no Cloudflare se começou um build novo.

> Se não encontrares **Deploy Hooks** no Cloudflare, podes sempre publicar à mão: **Deployments** → **Retry deployment** no último deploy.

---

## Dar acesso a editores

https://www.sanity.io/manage → o projeto → **Members** → **Invite members** → email da pessoa.

| Papel | O que pode fazer |
| --- | --- |
| **Editor** | Criar, editar e publicar conteúdo. É o papel normal para o núcleo. |
| **Administrator** | Tudo, incluindo convidar pessoas e mudar definições do projeto. |
| **Viewer** | Só ver. |

A pessoa recebe um email, cria conta (Google, GitHub ou email) e entra em `https://tfcell.sanity.studio`.

Quando alguém sai do núcleo, remove-o em **Members**.

> O plano gratuito tem um limite de utilizadores. Confirma o número atual em https://www.sanity.io/pricing.

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| Build falha com `Falta o documento "Definições gerais"` | O dataset está vazio | Passo 2 (`npm run importar-exemplos`) ou criar as Definições no Studio e publicar |
| Build falha com erro de autorização (401/403) | O dataset está privado | sanity.io/manage → **Datasets** → `production` → tornar **Public** |
| Publiquei mas o site não mudou | O webhook não disparou ou o build falhou | Ver **API → Webhooks → attempts** no Sanity e **Deployments** no Cloudflare |
| Alterei e não aparece | Ficou como rascunho | No Studio, carregar em **Publicar** |
| O Studio local não abre (erro de CORS) | `localhost:3333` não autorizado | sanity.io/manage → **API** → **CORS origins** → adicionar `http://localhost:3333` com credenciais |
