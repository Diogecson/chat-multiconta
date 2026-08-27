# Netlify — Chat Multi-Conta (frontend estático)

Os 3 HTMLs desta pasta são a interface do sistema, servida como site estático (Netlify) enquanto o backend continua no n8n (EasyPanel).

## Arquivos

```
netlify/
├── index.html    ← tela de login (URL raiz do site)
├── chat.html     ← tela principal (WhatsApp Web)
├── contas.html   ← gestão de contas Meta+Evolution
├── netlify.toml  ← config Netlify (headers, cache HTML=0)
└── README.md     ← este arquivo
```

Todas as chamadas de API vão pra `https://plano-acao-high-performace-n8n.szlqqi.easypanel.host/webhook/*` (URL absoluta — se você mudar o servidor n8n, edite `API_BASE`/`BASE` no topo dos 3 HTMLs).

O CORS já está liberado no workflow n8n (`allowedOrigins: "*"`), então qualquer origem `.netlify.app` funciona sem alterar o backend.

Token de login é guardado em `localStorage` (não passa mais na URL), então recarregar/compartilhar link não vaza credencial.

## Deploy — 3 opções

### Opção 1 — Drag-and-drop (mais rápido, 30 segundos)

1. Vá em https://app.netlify.com/drop
2. Arraste a **pasta inteira `netlify/`** (não os arquivos soltos, a pasta) pro alvo do site
3. Ele publica automaticamente numa URL tipo `https://prazerosamente-radiante-abc123.netlify.app`
4. Clique em **Site settings → Change site name** pra deixar bonito, tipo `chat-unifecaf.netlify.app`

Toda vez que quiser atualizar (você editar um HTML), abre o site no dashboard → aba **Deploys** → arrasta a pasta de novo. Ele mantém a mesma URL.

### Opção 2 — CLI Netlify (bom pra iterar)

```powershell
# uma vez só (instala CLI global)
npm i -g netlify-cli

# na pasta netlify/
cd "C:\Users\DG SOARES\UniFECAF\ChatMultiConta\netlify"
netlify login
netlify init      # cria/vincula site
netlify deploy --prod
```

Depois disso, cada `netlify deploy --prod` republica em segundos.

⚠️ Requer Node.js instalado. Se você não tem Node, fica na Opção 1.

### Opção 3 — Git (deploy automático a cada commit)

1. Crie repo no GitHub com só essa pasta `netlify/` (ou toda a `ChatMultiConta/` — Netlify aponta o subdir).
2. Netlify → **Add new site → Import an existing project → GitHub → escolha o repo**.
3. **Base directory:** `netlify` (ou `ChatMultiConta/netlify` se subir o projeto todo).
4. **Publish directory:** `.` (o mesmo).
5. Deploy. Todo push na branch main republica.

## Custom domain (opcional)

Netlify → **Domain settings → Add custom domain** → digita `chat.fecaf.com.br` (ou outro) → segue as instruções DNS (adiciona CNAME no provedor de domínio). SSL vem grátis via Let's Encrypt.

## Ativar/desativar HTMLs no n8n

Depois de subir no Netlify, você provavelmente NÃO precisa mais das rotas GET `chat-login`, `chat-app`, `chat-contas-page` no n8n (elas só serviam pra retornar HTML — agora quem faz isso é o Netlify).

**Pode deixar as rotas ativas mesmo assim** (backup/fallback) — elas não atrapalham. Se quiser tirar depois, no editor n8n desative os 3 nós webhook e seus Respond correspondentes.

## Checklist depois do primeiro deploy

- [ ] Abre a URL da Netlify e vê a tela de login (fundo azul, ícone verde WhatsApp)
- [ ] Login com `admin` / `FECAF2026` → cai em `chat.html`
- [ ] Rail vertical mostra a conta Evolution (bolinha verde)
- [ ] Manda mensagem do WhatsApp → aparece em segundos
- [ ] Envia resposta pelo composer → chega no WhatsApp
- [ ] Aba em segundo plano + mensagem chega → toca beep + título mostra `(1) ...`
- [ ] Clicar na engrenagem → vai pra `contas.html` (URL local, sem query string)
- [ ] Clicar em Sair → limpa localStorage → volta pro login

## Troubleshooting

- **Login não conecta:** abra DevTools (F12) → aba Network → tenta login → veja o request pra `/webhook/chat-auth`. Se der CORS error, o `allowedOrigins` do workflow no n8n não está `*` — verifique o nó `WH chat-auth`.
- **Aparece login mesmo depois de logado:** localStorage bloqueado (modo anônimo/private do browser) — não persiste. Use modo normal.
- **Contas não carregam / lista fica em "resposta inválida":** o backend n8n não está ativo. Vai no n8n e reativa o workflow ChatMultiConta.
- **Mudei o HTML e não aparece:** cache. Ctrl+Shift+R pra forçar reload (o `netlify.toml` já pede `Cache-Control: max-age=0` no HTML, mas alguns browsers ignoram).
