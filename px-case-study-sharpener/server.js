import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { DefaultAzureCredential } from '@azure/identity';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3004;

// ── Config ──
const FOUNDRY_PROJECT_ENDPOINT = 'https://brandchatbot-1-resource.services.ai.azure.com/api/projects/brandchatbot-1';
const API_VERSION = '2025-05-15-preview';
const AGENT_NAME = 'PX-Agent';
const AGENT_VERSION = '6';

// ── Azure credential (uses az login, managed identity, or env vars) ──
const credential = new DefaultAzureCredential();
let cachedToken = null;

async function getToken() {
  if (cachedToken && cachedToken.expiresOnTimestamp > Date.now() + 60000) {
    return cachedToken.token;
  }
  cachedToken = await credential.getToken('https://ai.azure.com/.default');
  return cachedToken.token;
}

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files in production
app.use(express.static(path.join(__dirname, 'dist')));

// ── Health check ──
app.get('/health', async (req, res) => {
  try {
    await getToken();
    res.json({ status: 'ok', agent: AGENT_NAME, version: AGENT_VERSION });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ── Chat endpoint ──
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const token = await getToken();

    // Convert chat messages to Responses API input format
    const input = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const response = await axios.post(
      `${FOUNDRY_PROJECT_ENDPOINT}/openai/responses?api-version=${API_VERSION}`,
      {
        input,
        agent_reference: {
          name: AGENT_NAME,
          version: AGENT_VERSION,
          type: 'agent_reference',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
      }
    );

    // Extract text from Responses API output
    const output = response.data.output || [];
    let text = '';
    for (const item of output) {
      if (item.type === 'message') {
        for (const c of item.content || []) {
          if (c.type === 'output_text') {
            text += c.text;
          }
        }
      }
    }

    res.json({ response: text, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error('Agent call failed:', e.response?.data || e.message);
    res.status(e.response?.status || 500).json({
      error: e.response?.data?.error?.message || e.message,
    });
  }
});

// SPA fallback
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Case Study Sharpener server running on port ${PORT}`);
  console.log(`Agent: ${AGENT_NAME} v${AGENT_VERSION}`);
  console.log(`Foundry: ${FOUNDRY_PROJECT_ENDPOINT}`);
});
