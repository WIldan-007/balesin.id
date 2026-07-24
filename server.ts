import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy — forward /api, /go, /webhook to backend (port 3001)
  const apiTarget = `http://localhost:${parseInt(process.env.API_PORT || '3001')}`;
  
  app.use('/api', async (req, res) => {
    try {
      const url = `${apiTarget}${req.originalUrl}`;
      const headers: any = { 'Content-Type': 'application/json' };
      if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
      const body = req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined;
      const response = await fetch(url, { method: req.method, headers, body });
      const data = response.headers.get('content-type')?.includes('json')
        ? await response.json() : await response.text();
      res.status(response.status).json(data);
    } catch (err) {
      res.status(502).json({ error: 'Backend unavailable' });
    }
  });

  app.use('/go', async (req, res) => {
    try {
      const response = await fetch(`${apiTarget}${req.originalUrl}`, { redirect: 'manual' });
      if (response.status === 302 || response.status === 301)
        return res.redirect(response.headers.get('location') || '/');
      res.status(response.status).send(await response.text());
    } catch { res.redirect('/'); }
  });

  // Initialize Gemini AI
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.length < 10) return null;
    return new GoogleGenAI({ apiKey });
  };

  // Health check — proxy to backend
  app.get("/api/health", async (_req, res) => {
    try {
      const response = await fetch(`${apiTarget}/api/health`);
      const data = await response.json();
      res.json(data);
    } catch {
      res.json({ status: "proxy_ok", backend: "unreachable", timestamp: new Date().toISOString() });
    }
  });

  // Test AI Reply Simulation endpoint
  app.post("/api/ai/simulate-reply", async (req, res) => {
    try {
      const { prompt, tone = "Cybernetic & Direct", platform = "Instagram" } = req.body;
      const ai = getAi();

      if (!ai) {
        // Fallback simulated response if key not available
        return res.json({
          success: true,
          reply: `[ECOS Node AI Reply - Simulated]: Thank you for reaching out on ${platform}! Check your DMs for the exclusive alpha link. ⚡ #CyborgAuto`,
          isSimulated: true,
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are the CYBORG Auto ECOS Social Media AI Agent responding on ${platform}.
Tone archetype: ${tone}.\nContext/User Comment: "${prompt || "I want access to the high converting promo link"}"
Core Directive: Craft a high-converting, slick, tech-forward response (max 280 chars) including a Call To Action to check DMs or click the short link.`,
      });

      res.json({
        success: true,
        reply: response.text,
        isSimulated: false,
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CYBORG AUTO] Node running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
