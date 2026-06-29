/**
 * Vite plugin: serves /api/* routes during development by importing
 * and running the corresponding handler from the /api directory.
 *
 * In production (Vercel), the /api/*.ts files are deployed as serverless
 * functions automatically — this plugin only activates in dev mode.
 */

import type { Plugin } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Tiny .env parser — avoids needing the dotenv package
function loadEnvFile(envPath: string): Record<string, string> {
  if (!fs.existsSync(envPath)) return {};
  const result: Record<string, string> = {};
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    result[key] = val;
  }
  return result;
}

export function devApiPlugin(): Plugin {
  return {
    name: "vite-dev-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");

        if (!url.pathname.startsWith("/api/")) {
          next();
          return;
        }

        // e.g. /api/bosta → "bosta"
        const fnName = url.pathname.replace(/^\/api\//, "").replace(/\/$/, "");
        if (!fnName) { next(); return; }

        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const handlerPath = path.resolve(__dirname, "api", `${fnName}.ts`);

        if (!fs.existsSync(handlerPath)) {
          next();
          return;
        }

        // Inject all .env vars into process.env so server-side handlers can read them
        const envVars = loadEnvFile(path.resolve(__dirname, ".env"));
        for (const [k, v] of Object.entries(envVars)) {
          process.env[k] = v;
        }

        try {
          // Buffer the request body
          const chunks: Buffer[] = [];
          await new Promise<void>((resolve, reject) => {
            req.on("data", (chunk: Buffer) => chunks.push(chunk));
            req.on("end", resolve);
            req.on("error", reject);
          });

          let body: any = {};
          if (chunks.length > 0) {
            const raw = Buffer.concat(chunks).toString("utf-8");
            try { body = JSON.parse(raw); } catch { body = {}; }
          }

          // Parse query string
          const query: Record<string, string> = {};
          url.searchParams.forEach((v, k) => { query[k] = v; });

          // Minimal Vercel-compatible req/res mock
          const mockReq = { method: req.method, query, body, headers: req.headers };

          let statusCode = 200;
          let responded = false;
          const mockRes = {
            status(code: number) { statusCode = code; return mockRes; },
            json(data: any) {
              if (responded) return mockRes;
              responded = true;
              res.writeHead(statusCode, { "Content-Type": "application/json" });
              res.end(JSON.stringify(data));
              return mockRes;
            },
            send(data: any) {
              if (responded) return mockRes;
              responded = true;
              res.writeHead(statusCode, { "Content-Type": "text/plain" });
              res.end(String(data));
              return mockRes;
            },
          };

          // Vite's ssrLoadModule transpiles TypeScript on the fly
          const mod = await server.ssrLoadModule(handlerPath);
          const handler = mod.default;

          if (typeof handler !== "function") {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: `No default export in api/${fnName}.ts` }));
            return;
          }

          await handler(mockReq, mockRes);

          if (!responded) { res.writeHead(200); res.end(); }
        } catch (err: any) {
          console.error(`[dev-api] Error in api/${fnName}:`, err);
          if (!res.headersSent) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: err?.message ?? "Internal Server Error" }));
          }
        }
      });
    },
  };
}
