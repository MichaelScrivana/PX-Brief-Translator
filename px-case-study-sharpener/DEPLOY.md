# PX Case Study Sharpener — Deployment Guide

This tool deploys to **Azure App Service** (not Static Web Apps) because it has a Node.js backend that calls Azure OpenAI from the server.

**Live (legacy, decommissioning):** `https://px-case-study-sharpener.azurewebsites.net` — stopped 2026-05 with the `AZS3248_DesignerAI` sub auto-disable.

**Migration target (already provisioned, Running):** `px-case-study-sharpener-bridge` in RG `PX-AI-Tools`, sub `AZS3453_PX-WorkTeam`, plan `ASP-PX-AI-Tools-Linux` (F1, West Europe). Identity: none (key-based, not Managed Identity). HTTPS-only on. Only app setting present is `SCM_DO_BUILD_DURING_DEPLOYMENT` — `OPENAI_*` settings still need to be added per step 2 below.

---

## Why App Service (not Static Web Apps)?

The backend holds the Azure OpenAI key and proxies chat completions so the key never reaches the browser. SWA can't host a Node runtime. The other monorepo tools (Brief Translator, Persona Generator, AI Hub) are pure frontends and stay on SWA.

---

## Prerequisites

- Azure CLI (`brew install azure-cli`), logged in: `az login`
- Subscription: `AZS3453_PX-WorkTeam`
- App Service: `px-case-study-sharpener-bridge` in RG `PX-AI-Tools`, plan `ASP-PX-AI-Tools-Linux`
- Foundry resource for the model: `px-agents-26` (RG `Agents-q3`, eastus) — `gpt-4.1` deployment

---

## What changed (May 2026 migration)

The tool used to call the `PX-Agent` v6 declarative agent on `brandchatbot-1-resource` via Managed Identity. That whole stack lived in the `AZS3248_DesignerAI` sub which is being decommissioned, and the `PX-Agent` Foundry agent is gone.

New shape (mirrors DesignAgentPX's compliance-checker):

- `server.js` calls `${OPENAI_ENDPOINT}` directly with `Authorization: Bearer ${OPENAI_API_KEY}`
- No `@azure/identity`, no Responses API, no agent_reference
- System prompt + benchmarks are passed inline by the frontend in the `messages` array (see `src/systemPrompt.js`)

---

## Production Deployment (Existing App)

For the existing bridge App Service, each deploy is **build → zip → push**:

```bash
APP=px-case-study-sharpener-bridge
RG=PX-AI-Tools

# 1. Build the frontend
npm run build

# 2. Zip server.js, package.json, package-lock.json, dist/, node_modules/
zip -r deploy.zip server.js package.json package-lock.json dist node_modules

# 3. Tell Azure NOT to run Oryx build (dist/ is pre-built, node_modules included)
az webapp config appsettings set \
  --name $APP \
  --resource-group $RG \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=false

# 4. Deploy
az webapp deployment source config-zip \
  --name $APP \
  --resource-group $RG \
  --src deploy.zip

# 5. Verify
curl https://$APP.azurewebsites.net/health
```

Expected `/health` response:
```json
{ "status": "ok", "model": "gpt-4.1", "endpointConfigured": true }
```

---

## One-time setup on the bridge app

The bridge App Service is already created. These steps still need to be done before the first deploy.

### 1. Set app settings (endpoint + key)

```bash
APP=px-case-study-sharpener-bridge
RG=PX-AI-Tools

# Pull the key directly from px-agents-26 (no copy-paste)
KEY=$(az cognitiveservices account keys list \
  --name px-agents-26 \
  --resource-group Agents-q3 \
  --subscription AZS3453_PX-WorkTeam \
  --query key1 -o tsv)

az webapp config appsettings set \
  --name $APP --resource-group $RG \
  --subscription AZS3453_PX-WorkTeam \
  --settings \
    OPENAI_ENDPOINT="https://px-agents-26.services.ai.azure.com/openai/v1/chat/completions" \
    OPENAI_API_KEY="$KEY" \
    OPENAI_MODEL="gpt-4.1"
```

`SCM_DO_BUILD_DURING_DEPLOYMENT=false` is already set on the bridge.

### 2. Confirm Bayer Azure AD auth (Easy Auth)

All Bayer tools must be internal-only. Verify in Portal → Authentication that Microsoft is added as an identity provider and restricted to tenant `fcb2b37b-5da0-466b-9b83-0014b67a7c78`. Add it if missing.

### 3. First deploy

Follow the Production Deployment steps above.

---

## Environment Variables

| Var | Required | Purpose |
|---|---|---|
| `OPENAI_ENDPOINT` | yes | Full chat completions URL on `px-agents-26` |
| `OPENAI_API_KEY` | yes | Bearer key for the Foundry passthrough |
| `OPENAI_MODEL` | no | Defaults to `gpt-4.1` |
| `PORT` | no | Defaults to `3004` (App Service injects its own) |

Local `.env` is gitignored. See `.env.example` for shape.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/health` returns `endpointConfigured: false` | Missing `OPENAI_ENDPOINT` / `OPENAI_API_KEY` app setting | Re-run step 2 above |
| `/api/chat` returns 401 | Wrong or rotated key on `px-agents-26` | Pull a fresh key from the resource and update app settings |
| Deploy succeeds but app shows "Application Error" | Oryx rebuilt and broke `node_modules/` | Confirm `SCM_DO_BUILD_DURING_DEPLOYMENT=false` is set |
| 502 Bad Gateway on first request after deploy | Cold start | Retry after ~30s |
| 403 "This web app is stopped" | App Service stopped at the platform level (sub disabled, or manually stopped) | Check sub state and `az webapp start` |

View live logs:
```bash
az webapp log tail --name $APP --resource-group $RG
```

---

## Security Checklist

- [x] `--https-only true` set at creation
- [x] Azure AD (Easy Auth) restricting to Bayer tenant
- [x] `.env` gitignored, key only in App Service config
- [x] No keys in source
- [ ] CORS restricted to app origin in production (currently `cors()` is wide open in `server.js` — tighten when adding a separate frontend origin)
