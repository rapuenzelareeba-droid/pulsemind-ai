import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

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
    let apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const originalLength = apiKey.length;
      const cleanKey = apiKey.replace(/^['"]|['"]$/g, "").trim();
      if (cleanKey !== apiKey) {
        console.log(`[PulseMind API Key] Detected and stripped wrapping quotes from GEMINI_API_KEY. Length changed from ${originalLength} to ${cleanKey.length}.`);
        apiKey = cleanKey;
      } else {
        console.log(`[PulseMind API Key] GEMINI_API_KEY loaded. Length: ${apiKey.length} characters.`);
      }
    } else {
      console.warn("[PulseMind API Key] WARNING: GEMINI_API_KEY is not defined in the environment.");
    }

    if (!apiKey || apiKey === "MOCK_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not defined or is invalid. Please configure it in your Vercel Project Settings (Environment Variables) and deploy a new version.");
    }

    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Robust helper function with retry logic and fallback models to handle 503 high demand or other transient API issues
async function generateContentWithFallback(
  contents: any,
  config?: any,
  preferredModel: string = "gemini-3.5-flash"
): Promise<any> {
  const modelsToTry = [
    preferredModel,
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    let attempts = 0;
    const maxAttempts = 2; // Try twice per model
    let delay = 1000; // Starting delay of 1 second

    while (attempts < maxAttempts) {
      try {
        console.log(`[PulseMind AI] Attempting generation using model: ${model} (Attempt ${attempts + 1}/${maxAttempts})...`);
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: config,
        });
        console.log(`[PulseMind AI] Generation successful using model: ${model}`);
        return response;
      } catch (err: any) {
        lastError = err;
        attempts++;
        console.warn(`[PulseMind AI] Error with model ${model} on attempt ${attempts}:`, err.message || err);

        // Detect if error is transient (e.g. 503 UNAVAILABLE, 429 RESOURCE_EXHAUSTED, high demand, etc.)
        const isTransient = 
          err.status === 503 || 
          err.statusCode === 503 ||
          err.message?.includes("503") ||
          err.message?.includes("UNAVAILABLE") ||
          err.message?.includes("high demand") ||
          err.status === 429 ||
          err.statusCode === 429 ||
          err.message?.includes("429") ||
          err.message?.includes("RESOURCE_EXHAUSTED");

        if (isTransient && attempts < maxAttempts) {
          console.log(`[PulseMind AI] Transient error detected. Retrying model ${model} in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          // Break the inner loop to try the next fallback model immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error("All generative models failed to respond.");
}

// AWS DynamoDB Client Initializer
let ddbDocClient: DynamoDBDocumentClient | null = null;
function getDynamoDBClient(): DynamoDBDocumentClient | null {
  if (ddbDocClient) return ddbDocClient;

  let accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  let region = process.env.AWS_REGION || "us-east-1";

  if (accessKeyId) {
    accessKeyId = accessKeyId.replace(/^['"]|['"]$/g, "").trim();
  }
  if (secretAccessKey) {
    secretAccessKey = secretAccessKey.replace(/^['"]|['"]$/g, "").trim();
  }
  if (region) {
    region = region.replace(/^['"]|['"]$/g, "").trim();
  }

  if (!accessKeyId || !secretAccessKey) {
    console.warn("WARNING: AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is not defined. DynamoDB logging is disabled.");
    return null;
  }

  try {
    const client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    ddbDocClient = DynamoDBDocumentClient.from(client);
    console.log("AWS DynamoDB Document Client initialized successfully with sanitized credentials.");
    return ddbDocClient;
  } catch (err) {
    console.error("Failed to initialize DynamoDB Client:", err);
    return null;
  }
}

// Helper to log event to AWS DynamoDB
async function logToDynamoDB(type: string, payload: any) {
  try {
    const ddb = getDynamoDBClient();
    if (!ddb) return;

    const tableName = process.env.AWS_DYNAMODB_TABLE_NAME || "pulsemind_health_logs";
    const logId = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    await ddb.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          id: logId,
          type,
          timestamp: new Date().toISOString(),
          ...payload,
        },
      })
    );
    console.log(`[AWS DynamoDB] Successfully logged ${type} event: ${logId}`);
  } catch (err) {
    console.error("[AWS DynamoDB] Failed to write log:", err);
  }
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

    // Use our robust helper function that supports retry and fallbacks
    const response = await generateContentWithFallback(
      message,
      {
        systemInstruction: systemInstruction || "You are PulseMind AI, a clinical-grade health coach. Provide accurate, helpful, and scientific information.",
        temperature: 0.7,
      },
      "gemini-3.5-flash"
    );

    // Fire-and-forget logging to AWS DynamoDB
    logToDynamoDB("chat_message", {
      message: message.substring(0, 500),
      systemInstruction: systemInstruction || "Default Clinic Coach",
      aiResponseSummary: response.text ? response.text.substring(0, 500) : "No reply"
    }).catch(err => console.error("Error calling logToDynamoDB:", err));

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

    // Use our robust helper function that supports retry and fallbacks
    const response = await generateContentWithFallback(
      [filePart, promptPart],
      {
        responseMimeType: "application/json",
      },
      "gemini-3.5-flash"
    );

    // Parse the JSON text returned from the model
    let parsedData: any = {};
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

    // Fire-and-forget logging to AWS DynamoDB
    logToDynamoDB("medical_report_analysis", {
      fileName: fileName || "unnamed_report",
      mimeType: mimeType,
      patientName: parsedData.patientName || "Unknown Patient",
      confidence: parsedData.confidence || 90,
      summary: parsedData.summary ? parsedData.summary.substring(0, 500) : "No summary"
    }).catch(err => console.error("Error calling logToDynamoDB for report:", err));

    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Analyze Report Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze medical report." });
  }
});

// Endpoint: Fetch synced cloud logs from Amazon DynamoDB
app.get(["/api/db/logs", "/db/logs"], async (req, res) => {
  try {
    const ddb = getDynamoDBClient();
    if (!ddb) {
      return res.json({
        success: false,
        message: "Amazon DynamoDB is not yet configured. Please add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION to enable cloud sync.",
        logs: []
      });
    }

    const tableName = process.env.AWS_DYNAMODB_TABLE_NAME || "pulsemind_health_logs";
    const response = await ddb.send(
      new ScanCommand({
        TableName: tableName,
        Limit: 20
      })
    );

    const sortedLogs = (response.Items || []).sort(
      (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    res.json({
      success: true,
      message: `Connected successfully to Amazon DynamoDB! Fetched logs from table '${tableName}'`,
      logs: sortedLogs
    });
  } catch (error: any) {
    console.error("DynamoDB Fetch Logs Error:", error);
    res.json({
      success: false,
      message: "Connected to DynamoDB but table does not exist yet or permissions are missing.",
      error: error.message,
      logs: []
    });
  }
});

export default app;
