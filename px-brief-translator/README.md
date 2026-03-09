# PX Brief Translator

A workshop demo tool that translates a single project brief into tailored working briefs for each PX sub-home using AI.

Supports **Azure OpenAI** (company API) and **Anthropic Claude** (direct API).

## Quick Start (3 commands)

Make sure you have **Node.js** installed (v18+). If you don't have it yet, download it from [nodejs.org](https://nodejs.org).

```bash
# 1. Open this folder in your terminal (in VS Code: Terminal > New Terminal)
cd px-brief-translator

# 2. Install dependencies
npm install

# 3. Start the dev server (opens in browser automatically)
npm run dev
```

The app will open at **http://localhost:3000** in your browser.

## Setting Up Azure OpenAI

1. Click the **"API Setup"** button in the top-right corner of the app
2. Make sure **Azure OpenAI** is selected (it's the default)
3. Fill in your three Azure credentials:

| Field | Where to Find It | Example |
|-------|------------------|---------|
| **Azure Endpoint** | Azure Portal > your OpenAI resource > Keys and Endpoint | `https://my-company.openai.azure.com` |
| **Deployment Name** | Azure AI Studio > Deployments | `gpt-4o` or `gpt-4-turbo` |
| **API Key** | Azure Portal > your OpenAI resource > Keys and Endpoint > KEY 1 | (a long string of characters) |

4. Click **Save Configuration**
5. You're ready to translate briefs!

### Where to find your Azure credentials

1. Go to [portal.azure.com](https://portal.azure.com)
2. Search for "OpenAI" in the top search bar
3. Click on your Azure OpenAI resource
4. In the left sidebar, click **Keys and Endpoint**
5. Copy **KEY 1** and the **Endpoint** URL
6. For the deployment name, go to [Azure AI Studio](https://ai.azure.com) > Deployments to see what model names are available

## How to Use

1. Click **"Load Sample Brief"** or paste your own project brief
2. Click **"Translate to All Sub-Homes"**
3. Watch as each sub-home brief generates in sequence
4. Click the tabs to read each team's translated working brief

## Project Structure

```
px-brief-translator/
├── index.html              <- Entry HTML (loads React)
├── package.json            <- Dependencies & scripts
├── vite.config.js          <- Dev server config
├── README.md               <- You are here
└── src/
    ├── main.jsx            <- React root mount
    ├── App.jsx             <- App wrapper
    ├── BriefTranslator.jsx <- Main component (UI + API calls)
    ├── styles.css          <- All styling
    ├── subHomes.js         <- Sub-home definitions (names, colors, icons)
    ├── systemPrompts.js    <- AI system prompts per sub-home
    └── sampleBrief.js      <- Demo brief content
```

## Customizing

- **Change the prompts**: Edit `src/systemPrompts.js` to match your team's actual frameworks
- **Change the sample brief**: Edit `src/sampleBrief.js` with a real project brief
- **Change the styling**: Edit `src/styles.css` — colors, fonts, spacing
- **Add/remove sub-homes**: Edit `src/subHomes.js` and add matching prompts in `systemPrompts.js`

## Switching Between Azure and Anthropic

The app supports both providers. Click **"API Setup"** and toggle between them. If you want to use Anthropic's Claude API directly, you'll need a key from [console.anthropic.com](https://console.anthropic.com).

## Troubleshooting

**"CORS error" in the browser console:**
Azure OpenAI endpoints need to allow browser requests. If your company has CORS restrictions, you may need to ask your IT team to add `http://localhost:3000` to the allowed origins, or use the app through a proxy.

**"401 Unauthorized":**
Double-check your API key. For Azure, make sure you're using the key from the correct resource.

**"404 Not Found":**
The deployment name might be wrong. Check Azure AI Studio > Deployments for the exact name.
