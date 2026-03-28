# PX AI Tools — Claude Code Reference Guide

> Read this file FIRST before making any changes to this project. It contains critical context about the project structure, deployment, APIs, and common pitfalls learned through development.

---

## Who You're Working With

Michael is a designer at Bayer's Product Experience (PX) organization. He has HTML/CSS experience and is beginning his coding journey with JavaScript, React, Node.js, and Azure. Explain concepts clearly, avoid jargon without context, and walk through steps rather than assuming familiarity with CLI tools or deployment workflows.

**Working style:**
- He'll say "help me build X" — ask clarifying questions before diving in
- Don't make assumptions about what he wants. Ask first, build second.
- Walk through deployment steps one at a time — don't dump a wall of commands
- When something breaks, explain WHY it broke, not just how to fix it

---

## Project Overview

This is a monorepo containing multiple PX AI tools, all deployed as separate Azure Static Web Apps from the same GitHub repo.

**GitHub repo:** `MichaelScrivana/PX-AI-Tools` (formerly PX-Brief-Translator — may have been renamed)

### Apps in this repo:

| App | Folder | Azure URL | Port (dev) | Description |
|-----|--------|-----------|------------|-------------|
| **AI Hub** | `px-ai-hub/` | TBD | 3002 | Landing page linking to all PX AI tools |
| **Brief Translator** | `px-brief-translator/` | `proud-moss-0a781bf03.azurestaticapps.net` | 3000 | Translates project briefs into 6 sub-home working briefs |
| **Persona Generator** | `px-persona-generator/` | `calm-mushroom-0cfaf7f0f.1.azurestaticapps.net` | 3001 | Generates synthetic consumer personas with deep dives and concept testing |
| **Case Study Sharpener** | `px-case-study-sharpener/` | `px-case-study-sharpener.azurewebsites.net` | 3003 (frontend) / 3004 (server) | Conversational AI tool that helps refine project summaries into PX.com case studies. Uses Azure AI Foundry agent (PX-Agent) with knowledge sources. Has its own Node.js backend (not a static web app). |

---

## Tech Stack

- **Framework:** Vite + React (functional components with hooks)
- **Styling:** Plain CSS with CSS custom properties for theming (no Tailwind, no CSS-in-JS)
- **Fonts:** Roboto (loaded via Google Fonts CDN)
- **UI style:** Apple-like aesthetic — dark mode default, minimal, clean
- **APIs:** Bayer myGenAssist (MGA), Azure OpenAI, Anthropic Claude
- **Deployment:** Azure Static Web Apps via GitHub Actions
- **No backend** — all API calls happen client-side from the browser

### When building new tools:
- Default to Vite + React unless there's a reason not to
- Keep the same visual language: dark theme, Roboto font, PX logo, similar card/button styles
- Each tool gets its own folder at the repo root with its own `package.json`
- Each tool runs on a different dev port (3000, 3001, 3002, etc.)

---

## Repo Structure

```
PX-AI-Tools/                          <- GitHub repo root
├── .github/
│   └── workflows/
│       ├── azure-static-web-apps-proud-moss-*.yml   <- Brief Translator
│       ├── azure-static-web-apps-calm-mushroom-*.yml <- Persona Generator
│       ├── deploy-ai-hub.yml                         <- AI Hub
│       └── deploy-persona-generator.yml              <- (backup, may be redundant)
├── px-ai-hub/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── Hub.jsx              <- Tool cards grid, add new tools to TOOLS array
│   │   ├── styles.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/
│       ├── img/                 <- PX logos
│       ├── icons/               <- PWA icons
│       ├── manifest.json
│       ├── sw.js
│       └── staticwebapp.config.json
├── px-brief-translator/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── BriefTranslator.jsx  <- Main component (config, hero, brief input, outputs)
│   │   ├── ChatAgent.jsx        <- Chat panel with MGA Chat + custom assistants
│   │   ├── DropZone.jsx         <- Drag/drop file upload (pdf.js + mammoth via CDN)
│   │   ├── subHomes.js          <- 6 sub-home definitions
│   │   ├── systemPrompts.js     <- System prompts per sub-home
│   │   ├── sampleBrief.js       <- Sample brief for demo
│   │   ├── styles.css           <- Full CSS with light/dark themes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── img/
│   │   ├── icons/
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   └── staticwebapp.config.json
│   └── teams-app/               <- Microsoft Teams tab manifest
├── px-persona-generator/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── PersonaGenerator.jsx <- Main component (loop animation, cards, deep dive, concept test)
│   │   ├── personas.js          <- 8 persona definitions + loop messages
│   │   ├── styles.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/
│       ├── img/
│       ├── icons/
│       ├── manifest.json
│       ├── sw.js
│       └── staticwebapp.config.json
└── DEPLOYMENT-PLAYBOOK.md        <- Step-by-step deployment reference
```

---

## Critical Rules (Read Before Touching Anything)

### 1. Static assets MUST be inside `public/`

Vite only copies files from `public/` into the `dist/` build output. If you put images, JSON files, or configs outside `public/`, they'll work in `npm run dev` but **disappear in production**.

- Images -> `public/img/`
- PWA icons -> `public/icons/`
- `staticwebapp.config.json` -> `public/`
- `manifest.json` -> `public/`
- `sw.js` -> `public/`

**NEVER put static assets at the project root or in `src/` and expect them to work in production.**

### 2. `.github/workflows/` MUST be at the repo root

GitHub only detects workflow files at the repo root's `.github/workflows/`. If the folder is inside a subfolder (like `px-brief-translator/.github/`), GitHub ignores it entirely.

### 3. `.gitignore` MUST exist before first commit

Without it, `node_modules/` (hundreds of MBs) gets pushed to GitHub. Every app folder needs:

```gitignore
node_modules
dist
.DS_Store
*.local
.env
.env.*
```

### 4. `output_location` must be `dist` for Vite projects

Azure's Oryx build system needs to know where the built files are. For Vite, it's always `dist`. Azure's auto-generated workflows sometimes default to `""` or `"build"` — always check and fix this.

### 5. Don't create duplicate workflow files

When you create a new Azure Static Web App and link it to GitHub, Azure auto-generates a workflow file. Use THAT file. Don't create a second one manually — it causes confusion about which one runs.

---

## Bayer myGenAssist (MGA) API

MGA is Bayer's internal AI platform at `chat.int.bayer.com`. It exposes an OpenAI-compatible API.

### Authentication
```
Authorization: Bearer <token>
Content-Type: application/json
```
Users get tokens from: `chat.int.bayer.com -> Profile -> API Tokens`

### Chat Completions (main endpoint)
```
POST https://chat.int.bayer.com/api/v2/chat/completions

{
  "model": "gpt-4o",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "max_tokens": 2000,
  "temperature": 0.7
}
```

Response: Standard OpenAI format -> `response.choices[0].message.content`

### MGA Assistants (custom assistants)

MGA assistants are called through the **same chat completions endpoint**, NOT through OpenAI's threads/runs API. The threads/runs pattern (`/threads`, `/threads/{id}/runs`) does NOT work on MGA.

To call a custom assistant:
```
POST https://chat.int.bayer.com/api/v2/chat/completions
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
  mga-project: <assistant_id>        <- routes to the specific assistant

Body:
{
  "model": "gpt-4o",
  "assistant_id": "<assistant_id>",  <- also pass in body for compatibility
  "messages": [...],
  "max_tokens": 1500,
  "temperature": 0.5
}
```

### Listing Available Assistants
```
GET https://chat.int.bayer.com/api/v2/assistants?category=<category>&limit=30&keyword=<search>

Categories: my_assistants, favorites, shared, popular
Headers: Authorization: Bearer <token>
```

Returns an object where values are arrays of assistant objects with `id`, `name`, `description`, `logo_url`, `model`, `owners`, `tags`.

### IMPORTANT: MGA does NOT support:
- `/api/v2/threads` (create thread)
- `/api/v2/threads/{id}/messages` (add message)
- `/api/v2/threads/{id}/runs` (create run)
- Any OpenAI Assistants API thread/run pattern

If you need multi-turn conversation with an MGA assistant, maintain conversation history in memory (array of messages) and send the full history with each request to the chat completions endpoint.

---

## Azure / Anthropic API Integration

### Azure OpenAI
```
POST {endpoint}/openai/deployments/{deployment}/chat/completions?api-version={version}
Headers: api-key: <key>
Body: Standard OpenAI chat completions format
```

### Anthropic Claude
```
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: <key>
  anthropic-version: 2023-06-01
  anthropic-dangerous-direct-browser-access: true    <- required for browser calls
Body:
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2000,
  "system": "...",
  "messages": [{ "role": "user", "content": "..." }]
}
```
Response: `response.content[0].text`

### Azure AI Foundry — Calling Agents with Knowledge Sources

Azure AI Foundry agents (created in the Foundry portal) have their own knowledge bases, instructions, and tools. Calling them from code is more complex than standard API calls. Here's what we learned:

**The problem:** Foundry agents require OAuth (Bearer token), NOT API keys. The standard `api-key` header works for direct model calls (chat completions), but the Responses API with `agent_reference` requires a proper Azure AD token with the `https://ai.azure.com` audience.

**What does NOT work:**
- Calling the agent directly from the browser (no way to get OAuth tokens client-side without an app registration)
- Using the API key from the Foundry resource — returns 401 on the agent endpoint
- OpenAI Assistants API (`/openai/assistants`) — Foundry declarative agents don't show up there
- Most API versions — only `2025-05-15-preview` works as of March 2026

**What DOES work:**

1. **Get an OAuth token** (requires `az login` first):
   ```bash
   az login
   TOKEN=$(az account get-access-token --resource https://ai.azure.com --query accessToken -o tsv)
   ```

2. **Call the agent via the Responses API:**
   ```
   POST {project_endpoint}/openai/responses?api-version=2025-05-15-preview
   Headers:
     Authorization: Bearer <oauth_token>
     Content-Type: application/json
   Body:
   {
     "input": [{"role": "user", "content": "..."}],
     "agent_reference": {
       "name": "<agent-name>",
       "version": "<version>",
       "type": "agent_reference"
     }
   }
   ```
   Response text is in: `response.output[].content[].text` (where type === "output_text")

3. **For production (no user login required):** Deploy a Node.js backend to Azure App Service with Managed Identity enabled. The `@azure/identity` package's `DefaultAzureCredential` automatically uses the managed identity to get tokens — no keys, no logins.

**Our Foundry setup:**
- **Project endpoint:** `https://brandchatbot-1-resource.services.ai.azure.com/api/projects/brandchatbot-1`
- **Agent:** `PX-Agent` version `6` (Claude Opus 4.6, has PX knowledge sources)
- **Resource group:** `rg-brandchatbot-1` (Foundry resource), `DesignAgentGroup` (App Services)
- **Subscription:** `AZS3248_DesignerAI` (`95bd45e7-6664-419c-8cf3-c0a9eb48cb8c`)

**Deploying apps with backends to Azure App Service:**

Bayer's Azure policy requires `--https-only true` when creating web apps. Without it, creation is blocked by the "CSF Secure Configuration" policy.

```bash
az webapp create \
  --name <app-name> \
  --resource-group DesignAgentGroup \
  --plan ASP-DesignAgentGroup-b200 \
  --runtime "NODE|20-lts" \
  --https-only true
```

The `ASP-DesignAgentGroup-b200` plan (in `DesignAgentGroup` resource group, Canada Central) is already approved and hosts the OAD Design Reviewer. New apps can share this plan.

After creating, enable Managed Identity and grant it "Cognitive Services User" on the Foundry resource:
```bash
PRINCIPAL_ID=$(az webapp identity assign --name <app-name> --resource-group DesignAgentGroup --query principalId -o tsv)

az role assignment create \
  --assignee-object-id $PRINCIPAL_ID \
  --assignee-principal-type ServicePrincipal \
  --role "Cognitive Services User" \
  --scope "/subscriptions/95bd45e7-6664-419c-8cf3-c0a9eb48cb8c/resourceGroups/rg-brandchatbot-1/providers/Microsoft.CognitiveServices/accounts/brandchatbot-1-resource"
```

**Deployment:** Build the Vite frontend locally (`npm run build`), zip `server.js`, `package.json`, `dist/`, and `node_modules/`, then deploy with `SCM_DO_BUILD_DURING_DEPLOYMENT=false` (skip Oryx build since dist/ is pre-built):
```bash
az webapp deployment source config-zip --name <app-name> --resource-group DesignAgentGroup --src deploy.zip
```

**Also useful — calling Claude directly via Foundry (no agent, no OAuth needed):**
```
POST https://brandchatbot-1-resource.openai.azure.com/anthropic/v1/messages
Headers:
  x-api-key: <foundry-api-key>    <- from Azure Portal > resource > Keys
  Content-Type: application/json
  anthropic-version: 2023-06-01
Body:
{
  "model": "claude-opus-4-6",
  "messages": [{"role": "user", "content": "..."}],
  "max_tokens": 4000
}
```
This bypasses the agent (no knowledge sources) but works with just an API key. Good for prototyping.

---

## Deployment: Azure Static Web Apps

### Adding a New Tool to the Hub

1. **Create the app folder** at the repo root: `px-new-tool/`
2. **Scaffold with Vite + React** — same structure as existing apps
3. **Put all static assets in `public/`** — images, config, manifest
4. **Include `.gitignore`** with node_modules, dist, .DS_Store
5. **Ensure `package.json` has a `build` script** — Oryx looks for this
6. **Create Azure Static Web App** in Azure Portal:
   - Source: GitHub -> same repo
   - Branch: main
   - Build preset: Custom
   - App location: `/px-new-tool`
   - API location: (leave blank)
   - Output location: `dist`
7. **After creation**, Azure auto-generates a workflow file and pushes it to your repo
8. **Pull the new workflow**: `git pull`
9. **Check `output_location`** in the new workflow file — if it's `""` or `"build"`, change it to `"dist"`
10. **Add `paths` filter** to the workflow so it only triggers for its folder:
    ```yaml
    on:
      push:
        branches: [main]
        paths:
          - 'px-new-tool/**'
    ```
11. **Add the tool to the Hub** — edit `px-ai-hub/src/Hub.jsx`, add entry to the `TOOLS` array
12. **Commit and push**

### Deployment Checklist (Before Every Deploy)

- [ ] All images are inside `public/img/`, not at project root
- [ ] `staticwebapp.config.json` is inside `public/`
- [ ] `.gitignore` exists with node_modules and dist
- [ ] `package.json` has `"build": "vite build"` script
- [ ] `.github/workflows/` is at REPO ROOT (not inside an app subfolder)
- [ ] Workflow `output_location` is set to `"dist"` (not `""` or `"build"`)
- [ ] No duplicate workflow files for the same app
- [ ] Deployment token is added as a GitHub secret

### Common Deployment Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Bad credentials" | Missing GitHub secret for deployment token | Add `AZURE_STATIC_WEB_APPS_API_TOKEN_*` secret |
| "Could not find 'build' in package.json" | Wrong `app_location` — pointing to wrong folder | Set `app_location` to the subfolder with `package.json` |
| "Unable to determine app artifacts" | `output_location` is empty or wrong | Set `output_location` to `"dist"` |
| "Congratulations" placeholder page | Workflow hasn't deployed yet | Check Actions tab, fix errors, re-push |
| Workflow not triggering | `.github/` folder is inside a subfolder | Move it to repo root |

---

## Git & GitHub

### GitHub CLI Setup
```bash
# Install
brew install gh

# Login with correct permissions (needed for secrets)
gh auth login --scopes "repo,admin:repo_hook"

# Set a deployment secret
gh secret set SECRET_NAME --repo MichaelScrivana/PX-AI-Tools
```

### Day-to-Day Workflow
```bash
git add .
git commit -m "describe what changed"
git push

# First push on a new branch:
git push --set-upstream origin main

# Pull Azure's auto-generated workflow files:
git pull
```

### Renaming the Repo
If the repo is renamed on GitHub:
```bash
git remote set-url origin https://github.com/MichaelScrivana/NEW-NAME.git
```
Azure deployments won't break (linked by repo ID, not name).

---

## UI / Design Conventions

- **Dark mode default** (`useState(true)` for darkMode)
- **Font:** Roboto (Google Fonts CDN)
- **Logo:** `PX-logo-blk@3x.png` with `filter: invert(1)` in dark mode
- **Hero:** `WeArePX1-wht@3x.png` (dark) / `WeArePX1@3x.png` (light)
- **Color accent:** `#0071e3` (Apple blue)
- **CSS approach:** Custom properties for theming, no framework
- **Card style:** Rounded corners (16-20px), subtle shadows, border on hover
- **Buttons:** Pill-shaped (`border-radius: 980px`)
- **Animations:** Subtle — fade/slide transitions, no heavy motion
- **Config panel:** Each app has its own API config panel with provider toggle (Bayer/Azure/Anthropic)

---

## File-by-File Reference (Key Files)

### Brief Translator
- `BriefTranslator.jsx` — Everything: config panel, MGA assistant browser, hero, brief input, folder tab grid (3x2), output viewer, ChatAgent integration
- `ChatAgent.jsx` — Floating chat panel. BASE_OPTION (MGA Chat via completions) + custom assistants (also via completions with `mga-project` header). Per-assistant message history via `historiesRef`
- `DropZone.jsx` — Drag/drop file upload using CDN-loaded pdf.js (v3.11.174) and mammoth (v1.8.0). Do NOT use npm packages for these — they cause Vite build errors in this environment
- `subHomes.js` — 6 sub-homes: research, brand, product, innovation, engineering, graphics
- `systemPrompts.js` — Detailed system prompts per sub-home for brief translation

### Persona Generator
- `PersonaGenerator.jsx` — Loop animation simulation, persona cards (dark), expandable details, deep dive overlay with journey timeline, "Test a Concept" AI evaluation
- `personas.js` — 8 hardcoded personas with health contexts, decision styles, agent behaviors, deep dives, PX implications. `LOOP_MESSAGES` array drives the generation animation.

### AI Hub
- `Hub.jsx` — `TOOLS` array at the top defines all tool cards. To add a new tool, add an entry here with `id`, `name`, `description`, `icon`, `gradient`, `tags`, `url`, `status`

---

## Things That Will Bite You

1. **Azure auto-generates workflow files** when you link a repo. Don't fight it — use their file, just fix `output_location` to `"dist"` and add `paths` filters.

2. **Don't use OpenAI Assistants API (threads/runs) with MGA.** It doesn't support those endpoints. Use chat completions for everything, including custom assistants.

3. **`npm run dev` lies to you.** Vite's dev server serves from the repo root, so files outside `public/` still load. Production only serves from `dist/` (which is built from `public/`). Always verify with `npm run build && npm run preview` before deploying.

4. **CDN libraries, not npm, for pdf.js and mammoth.** The Vite build environment had issues with these as npm packages. They're loaded via dynamic `<script>` tags from cdnjs.cloudflare.com.

5. **Two workflow files for the same app = confusion.** If Azure generates one and you also created one manually, delete the manual one.

6. **`gh auth login` default scopes can't write secrets.** Use `gh auth login --scopes "repo,admin:repo_hook"` or just use the GitHub web UI for secrets.

7. **The `paths` filter in workflows is important** in a monorepo. Without it, pushing a change to one app triggers ALL workflows, rebuilding every app unnecessarily.

---

*Last updated: March 28, 2026*
