import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3004;

const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1';

if (!OPENAI_ENDPOINT || !OPENAI_API_KEY) {
  console.warn('[startup] OPENAI_ENDPOINT and OPENAI_API_KEY must be set — /api/chat will 500 until they are.');
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    model: OPENAI_MODEL,
    endpointConfigured: Boolean(OPENAI_ENDPOINT && OPENAI_API_KEY),
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    if (!OPENAI_ENDPOINT || !OPENAI_API_KEY) {
      return res.status(500).json({ error: 'Server missing OPENAI_ENDPOINT / OPENAI_API_KEY' });
    }

    const response = await axios.post(
      OPENAI_ENDPOINT,
      {
        model: OPENAI_MODEL,
        messages,
        max_tokens: 4000,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim() || '';
    res.json({ response: text, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error('Chat call failed:', e.response?.data || e.message);
    res.status(e.response?.status || 500).json({
      error: e.response?.data?.error?.message || e.message,
    });
  }
});

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Case Study Sharpener server running on port ${PORT}`);
  console.log(`Model: ${OPENAI_MODEL}`);
  console.log(`Endpoint: ${OPENAI_ENDPOINT || '(unset)'}`);
});
