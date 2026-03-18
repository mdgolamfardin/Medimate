import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

// ==========================================
// 1. SETUP & CONFIGURATION
// ==========================================
dotenv.config();

const app = express();
const port = process.env.PORT || 5001; // Using 5001 to avoid macOS AirPlay conflicts

// Middleware
app.use(cors()); 
app.use(express.json());

// Initialize AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_2);

// ==========================================
// 2. AI SCHEMAS & MODELS
// ==========================================

const summarySchema = {
  description: "Structured summary of a doctor-patient conversation.",
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "A concise summary capturing the main points of the conversation.",
      nullable: false,
    },
    importantNotes: {
      type: SchemaType.ARRAY,
      description: "Important notes, medication changes, or advice the patient must remember.",
      nullable: false,
      items: { 
        type: SchemaType.STRING 
      },
    },
    keyTerms: {
      type: SchemaType.ARRAY,
      description: "During the conversation, the doctor may mention medical terms that the patient might not understand. For each term, provide a simple explanation in layman's terms.",
      nullable: false,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          term: {
            type: SchemaType.STRING,
            description: "The medical term mentioned.",
            nullable: false,
          },
          explanation: {
            type: SchemaType.STRING,
            description: "A simple, patient-friendly explanation of the term.",
            nullable: false,
          },
        },
        required: ["term", "explanation"],
      },
    },
  },
  required: ["summary", "importantNotes", "keyTerms"],
};

// Pre-configure the model so we don't have to redefine it inside the route
const generativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-pro", // Note: Ensure you are using a valid model string here
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: summarySchema,
  },
});

// ==========================================
// 3. API ROUTES
// ==========================================

app.post("/api/generate-summary", async (req, res) => {
  try {
    const { transcript } = req.body;

    // Input Validation
    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({ error: "A valid transcript string is required." });
    }

    // Cleaned up prompt: The schema already tells Gemini exactly what format to use, 
    // so the prompt just needs to provide context and the data.
    const prompt = `
      Please act as a medical transcription assistant. Read the following raw transcript 
      of a doctor-patient conversation and extract the information according to the required JSON schema.
      
      Transcript to analyze:
      "${transcript}"
    `;

    // Call Gemini
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse and send the result
    const structuredNote = JSON.parse(responseText);
    res.status(200).json(structuredNote);

  } catch (error) {
    console.error("❌ Error generating summary:", error);
    res.status(500).json({ error: "An error occurred while communicating with the AI." });
  }
});

// ==========================================
// 4. SERVER INITIALIZATION & ERROR HANDLING
// ==========================================

const server = app.listen(port, () => {
  console.log(`✅ Backend server is actively running on http://localhost:${port}`);
});

// Catch Port Conflicts (e.g., macOS AirPlay on port 5000)
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please change the PORT in your .env file.`);
  } else {
    console.error("❌ Server error:", error);
  }
});

// Catch Silent Crashes
process.on('uncaughtException', (err) => {
  console.error('❌ CRITICAL: Uncaught server error:', err);
});