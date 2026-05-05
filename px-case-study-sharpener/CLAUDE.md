# Case Study Sharpener — Claude Reference

**This is the one tool in the monorepo that is NOT a Static Web App.** It deploys to Azure App Service because it has a Node.js backend (`server.js`) that holds the Azure OpenAI key and proxies chat completions. Do not try to deploy it with an SWA workflow.

See [`DEPLOY.md`](./DEPLOY.md) for the full playbook. Quick reference below.

---

## May 2026 migration — Foundry agent → direct gpt-4.1

This tool used to call the `PX-Agent` v6 declarative agent on `brandchatbot-1-resource` (Foundry, Managed Identity, Responses API). That stack lived in `AZS3248_DesignerAI`, which is being decommissioned. The agent itself is also gone.

Current shape mirrors DesignAgentPX's compliance-checker:

- `server.js` POSTs to `${OPENAI_ENDPOINT}` directly with `Authorization: Bearer ${OPENAI_API_KEY}`
- Standard chat completions body — `messages`, `model`, `max_tokens`, `temperature`
- No `@azure/identity`, no Responses API, no `agent_reference`
- Knowledge that was in the Foundry agent (PX benchmarks, rubric) lives inline in `src/systemPrompt.js` and is sent in the messages array

**Required app settings (prod) / `.env` keys (local):**

| Var | Example |
|---|---|
| `OPENAI_ENDPOINT` | `https://px-agents-26.services.ai.azure.com/openai/v1/chat/completions` |
| `OPENAI_API_KEY` | key from `px-agents-26` (RG `Agents-q3`, sub `AZS3453_PX-WorkTeam`) |
| `OPENAI_MODEL` | `gpt-4.1` (default) |

---

## Local Dev

```bash
cp .env.example .env       # then paste OPENAI_API_KEY
npm install
npm run dev:all            # frontend on 3003, backend on 3004
```

If `/api/chat` returns 401, the key has rotated — pull a fresh one from the `px-agents-26` resource.

---

## Redeploy After a Change

The bridge App Service is `px-case-study-sharpener-bridge` (RG `PX-AI-Tools`, sub `AZS3453_PX-WorkTeam`, plan `ASP-PX-AI-Tools-Linux`). Build → zip → push:

```bash
APP=px-case-study-sharpener-bridge
RG=PX-AI-Tools

npm run build
zip -r deploy.zip server.js package.json package-lock.json dist node_modules

az webapp deployment source config-zip \
  --name $APP --resource-group $RG \
  --src deploy.zip

curl https://$APP.azurewebsites.net/health
```

Expected health response: `{"status":"ok","model":"gpt-4.1","endpointConfigured":true}`.

**Critical:** `SCM_DO_BUILD_DURING_DEPLOYMENT=false` must be set on the app. If Oryx rebuilds it wipes the bundled `node_modules/` and the app 500s.

```bash
az webapp config appsettings list \
  --name $APP --resource-group $RG \
  --query "[?name=='SCM_DO_BUILD_DURING_DEPLOYMENT']"
```

Logs:
```bash
az webapp log tail --name $APP --resource-group $RG
```

---

## What Lives Where (for adjustments)

| Change | File |
|---|---|
| AI behavior, rubric, PX benchmarks | `src/systemPrompt.js` |
| Default review guidelines (modal) | `DEFAULT_GUIDELINES` in `src/CaseStudySharpener.jsx` |
| Case study sections metadata | `src/caseStudySections.js` |
| PDF layout | `buildHtml()` in `src/PdfExport.jsx` |
| Image panel behaviour | `src/ImagePanel.jsx` |
| Styling (dark-first, CSS custom props) | `src/styles.css` |
| Endpoint / model config | env vars at top of `server.js` |

`CaseStudySharpener.jsx` is the monolithic main component (~1000 lines) — chat, exports, guidelines, session persistence all live there. Split it up if a change touches multiple concerns.

---

## Gotchas

1. **Key, not Managed Identity.** The previous Managed Identity → Foundry agent path is dead. Don't reintroduce `@azure/identity` or Responses API calls. The key on `px-agents-26` is the only credential.
2. **Bayer policy requires `--https-only true`** when creating web apps.
3. **Frontend and backend share one origin in production.** `server.js` serves `dist/` at `/` and `/api/chat` from the same host. CORS is wide open (`cors()` in `server.js`) — tighten it if a separate frontend origin is ever added.
4. **No CI/CD wired up.** Redeploys are manual via the zip command above. If you set up CI later, the workflow needs to build locally, zip with `node_modules`, and deploy via `azure/webapps-deploy@v3`.
5. **Images persist in localStorage as base64** (7-day TTL). Large/many images can exceed the ~5–10 MB browser quota; failures are currently silent.
