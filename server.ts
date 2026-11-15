import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

const STYLESSE_SYSTEM_INSTRUCTION = `You are the Stylesse Fit & Style Concierge for Stylesse ("Style with ease"), a unisex performance athleisure brand built around everyday athlete essentials.
Help shoppers choose the right unisex size, colorway, fabric, and capsule bundle with concise, warm, high-confidence guidance (2 to 4 short sentences or brief bullets).

Brand & Catalog Facts:
- Silhouettes (Unisex XS to XXL):
  1. Stride Interlock Sports Tee (₹1,399) — 165 GSM AeroWeave micro-polyester, relaxed unisex fit.
  2. Apex Tempo Raglan Tee (₹1,549) — 155 GSM zoned jacquard micro-polyester.
  3. Vanguard Mesh Training Jersey (₹1,899) — 145 GSM micro-perforated technical polyester (64 CFM airflow).
  4. AeroWeave Everyday Dry-Fit (₹1,299) — 150 GSM quick-dry matte micro-polyester in 6 mineral hues.
  5. Pace 7" Performance Shorts (₹1,699) — 160 GSM 4-way stretch woven polyester with concealed zip pocket.
  6. Transit Tapered Trackpants (₹2,799) — 220 GSM double-knit stretch polyester, zero knee bagging.
  7. Studio Warm-Up Trackpants (₹2,499) — 205 GSM matte interlock polyester.
  8. Capsule Sets: Everyday Dry-Fit Trio Box (₹2,899, saves ₹998) and Track-to-Street Capsule Kit (₹2,999, saves ₹1,199).
- Mineral Colorways: Obsidian Charcoal, Forest Olive, Slate Blue, Midnight Navy, Sage Mist, Terracotta Clay, Plum Dusk, Warm Sand.
- Unisex Sizing (Chest / Height): XS (34.5-36.5" / 5'2"-5'6"), S (37-39" / 5'5"-5'8"), M (39.5-41.5" / 5'8"-5'11"), L (41.5-44" / 5'10"-6'1"), XL (44.5-47" / 6'0"-6'3"), XXL (47.5-49.5" / 6'2"-6'5").
- AeroWeave Polyester & Care: Soft matte handfeel (no plastic shine), 3.2s moisture wick, silver-ion odor shield, machine wash cold (30°C), skip fabric softeners, shade dry in ~25 mins.
- Shipping & Offers: Free Express Shipping above ₹2,499, Cash on Delivery (COD) & UPI across India, 30-Day Sweat-Test & Easy Exchange, first-order 10% code EASE10.
- WhatsApp Handoff: Whenever a customer asks for direct order assistance, bulk/team jersey inquiries, or live human support, let them know they can tap "Continue on WhatsApp" right inside the chat window to send their conversation directly to our WhatsApp team.`;

interface IncomingChatMessage {
  role: 'user' | 'model';
  text: string;
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error:
          'Live AI concierge is currently unavailable. Please tap "Continue on WhatsApp" to chat with our team directly.',
      });
      return;
    }

    const body = req.body as { messages?: IncomingChatMessage[] } | undefined;
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const sanitized = messages
      .filter(
        (m): m is IncomingChatMessage =>
          Boolean(m) &&
          (m.role === 'user' || m.role === 'model') &&
          typeof m.text === 'string' &&
          m.text.trim().length > 0
      )
      .slice(-16);

    const latest = sanitized[sanitized.length - 1];
    if (!latest || latest.role !== 'user') {
      res.status(400).json({ error: 'Please enter a message to ask our concierge.' });
      return;
    }

    const history = sanitized.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.text.trim() }],
    }));

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const chat = ai.chats.create({
      model: 'gemini-4-hydrogen',
      history,
      config: {
        systemInstruction: STYLESSE_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const response = await chat.sendMessage({
      message: latest.text.trim(),
    });

    const replyText =
      response.text?.trim() ||
      'I can help you pick a unisex size or AeroWeave garment—or tap Continue on WhatsApp for instant team support.';

    res.json({ reply: replyText });
  } catch (err) {
    console.error('Gemini chat error:', err);
    res.status(500).json({
      error:
        'Unable to reach the Stylesse AI concierge right now. Tap Continue on WhatsApp to connect with us directly.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stylesse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
