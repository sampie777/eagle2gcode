import { serve } from "bun";
import { existsSync, promises as fs } from "fs";
import * as path from "path";
import { executeFlatcam } from "./runner";

const PORT = parseInt(process.env.PORT || "3001", 10);
const DIST_DIR = process.env.DIST_DIR || path.resolve(__dirname, "../dist");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

export const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Health check endpoint
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", time: new Date().toISOString() }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // FlatCAM generation endpoint
    if (url.pathname === "/api/flatcam/generate" && req.method === "POST") {
      try {
        const contentType = req.headers.get("content-type") || "";
        let files: { filename: string; content: string }[] = [];
        let cadType: "eagle" | "altium" = "eagle";
        let diaWidth = 0.20188;
        let pcbName: string | undefined;
        let customScript: string | undefined;

        if (contentType.includes("application/json")) {
          const body = await req.json();
          files = body.files ?? [];
          cadType = body.cadType ?? "eagle";
          diaWidth = body.diaWidth ?? 0.20188;
          pcbName = body.pcbName;
          customScript = body.customScript;
        } else if (contentType.includes("multipart/form-data")) {
          const formData = await req.formData();
          cadType = (formData.get("cadType") as any) ?? "eagle";
          diaWidth = parseFloat((formData.get("diaWidth") as string) || "0.20188");
          pcbName = (formData.get("pcbName") as string) || undefined;
          customScript = (formData.get("customScript") as string) || undefined;

          formData.forEach((val) => {
            if (val instanceof File) {
              files.push({ filename: val.name, content: "" });
            }
          });

          // Read content for each uploaded file
          for (const f of files) {
            const fileObj = formData.get(f.filename) || Array.from(formData.values()).find(v => v instanceof File && v.name === f.filename);
            if (fileObj instanceof File) {
              f.content = await fileObj.text();
            }
          }
        } else {
          return new Response(JSON.stringify({ error: "Unsupported Content-Type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (files.length === 0) {
          return new Response(JSON.stringify({ error: "No files uploaded" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const result = await executeFlatcam({
          files,
          cadType,
          diaWidth,
          pcbName,
          customScript,
        });

        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 500,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || String(err) }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Static file serving (SPA support)
    if (req.method === "GET" || req.method === "HEAD") {
      let filePath = path.join(DIST_DIR, url.pathname === "/" ? "index.html" : url.pathname);

      if (!existsSync(filePath) || (await fs.stat(filePath)).isDirectory()) {
        filePath = path.join(DIST_DIR, "index.html");
      }

      if (existsSync(filePath)) {
        const fileContent = await fs.readFile(filePath);
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME_TYPES[ext] || "application/octet-stream";

        return new Response(fileContent, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server started on port ${PORT}, serving dist from ${DIST_DIR}`);
