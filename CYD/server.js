const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 4173);
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/api/assistant") {
    return handleAssistant(req, res);
  }

  const safePath = decodeURIComponent(req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0]);
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
});

async function handleAssistant(req, res) {
  try {
    const body = await readJson(req);
    const result = await askOpenAI(body);
    sendJson(res, 200, result);
  } catch (error) {
    sendJson(res, 500, {
      error: "assistant_failed",
      message: error.message
    });
  }
}

async function askOpenAI({ prompt, role, user }) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const system = [
    "Eres el asistente de CYD SyncEdu.",
    "Clasifica lo que pide el usuario en un intent valido.",
    "Responde SOLO JSON valido con: intent, title, reply.",
    "Intents permitidos: calendar, grades, courses, notices, teacher_gradebook, messages, suggestions.",
    "Si el rol es teacher y pide calificar/notas de alumnos, usa teacher_gradebook.",
    "Si pide actividades, proximas tareas, fechas o calendario, usa calendar.",
    "Si no estas seguro, usa suggestions."
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "developer", content: system },
        { role: "user", content: `Usuario: ${user}. Rol: ${role}. Peticion: ${prompt}` }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "syncedu_assistant_route",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              intent: { type: "string", enum: ["calendar", "grades", "courses", "notices", "teacher_gradebook", "messages", "suggestions"] },
              title: { type: "string" },
              reply: { type: "string" }
            },
            required: ["intent", "title", "reply"]
          },
          strict: true
        }
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return JSON.parse(data.output_text);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) req.destroy();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

server.listen(port, "127.0.0.1", () => {
  console.log(`SyncEdu prototype running at http://127.0.0.1:${port}`);
});
