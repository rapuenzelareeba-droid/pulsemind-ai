import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable large bodies for base64 file uploads (OCR, report analysis)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Initialize Gemini API client on the server
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST Endpoints
app.get(["/api/health", "/health"], (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint: AI Doctor, Symptom Checker, disease suggestions, or coaches (General clinical Q&A proxy)
app.post(["/api/gemini/chat", "/gemini/chat"], async (req, res) => {
  try {
    const { message, systemInstruction, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();
    
    // We can use simple generateContent with system instruction
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction || "You are PulseMind AI, a clinical-grade health coach. Provide accurate, helpful, and scientific information.",
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with Gemini API." });
  }
});

// Endpoint: Medical Report Analyzer & OCR
app.post(["/api/gemini/analyze-report", "/gemini/analyze-report"], async (req, res) => {
  try {
    const { fileData, mimeType, fileName } = req.body;
    if (!fileData || !mimeType) {
      return res.status(400).json({ error: "fileData (base64) and mimeType are required." });
    }

    const ai = getGeminiClient();
    
    const filePart = {
      inlineData: {
        mimeType: mimeType,
        data: fileData,
      },
    };

    const promptPart = {
      text: `You are PulseMind AI Report Analyzer, an advanced medical AI specializing in lab report OCR, DICOM parsing, and clinical interpretation.
Analyze this medical report/image (${fileName || "document"}).
Return a JSON response containing:
1. "patientName": string (detect or default to unknown)
2. "confidence": number (confidence score from 1-100)
3. "summary": string (overall clinical summary of key findings)
4. "entities": array of objects with:
   - "name": string (biomarker name, e.g., LDL Cholesterol, Glucose)
   - "value": string (observed value)
   - "referenceRange": string (reference value, e.g., < 100 mg/dL)
   - "status": "optimal" | "elevated" | "low" | "critical"
5. "recommendations": array of strings (practical, evidence-based next steps. Always clearly prefix with informational advice and suggest consulting a medical professional)

Your response must be VALID JSON ONLY. Do not wrap in markdown blocks, do not include any text before or after the JSON.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [filePart, promptPart],
      config: {
        responseMimeType: "application/json",
      },
    });

    // Parse the JSON text returned from the model
    let parsedData = {};
    try {
      parsedData = JSON.parse(response.text || "{}");
    } catch (parseErr) {
      console.error("Failed to parse Gemini response as JSON:", response.text);
      // Fallback regex extraction or simple container
      parsedData = {
        patientName: "Patient Profile",
        confidence: 85,
        summary: response.text || "No summary generated.",
        entities: [],
        recommendations: ["Consult a physician to interpret these findings."]
      };
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Analyze Report Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze medical report." });
  }
});

// Start either Vite dev server or serve static assets in production
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted as middleware");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from:", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PulseMind AI Server booting successfully on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  bootstrap().catch((err) => {
    console.error("Critical server bootstrap failure:", err);
    process.exit(1);
  });
}

export default app;
