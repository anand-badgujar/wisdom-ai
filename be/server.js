require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { GoogleGenAI } = require("@google/genai");
const { pipeline } = require("@huggingface/transformers");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const EMBEDDING_MODEL = "Xenova/gte-small";
const GEMINI_MODEL = "gemini-3.5-flash-lite";

// ========================================
// Clients
// ========================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ========================================
// Load embedding model
// ========================================

let extractor;

async function loadEmbeddingModel() {
  console.log("Loading embedding model...");

  extractor = await pipeline(
    "feature-extraction",
    EMBEDDING_MODEL
  );

  console.log("Embedding model loaded.");
}

// ========================================
// Generate query embedding
// ========================================

async function generateEmbedding(text) {

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}

// ========================================
// Search Gita
// ========================================

async function searchGita(queryEmbedding) {

  const { data, error } = await supabase.rpc(
    "match_gita_verses",
    {
      query_embedding: queryEmbedding,
      match_threshold: 0.40,
      match_count: 5
    }
  );

  if (error) {
    throw new Error(
      `Gita search failed: ${error.message}`
    );
  }

  return data || [];
}

// ========================================
// Generate Gemini guidance
// ========================================

async function generateGuidance(userProblem, verses) {

  const context = verses.map((verse, index) => {

    return `
SOURCE ${index + 1}

Bhagavad Gita ${verse.chapter}:${verse.verse}

Translation:
${verse.translation || ""}

Meaning:
${verse.meaning || ""}

Topic:
${verse.topic || ""}

Teaching:
${verse.teaching || ""}
`;

  }).join("\n----------------------\n");

  const prompt = `
You are a thoughtful spiritual guidance assistant.

The user has described a real-life situation.

Use ONLY the supplied Bhagavad Gita sources
to provide a grounded spiritual perspective.

USER SITUATION:
${userProblem}

RELEVANT GITA SOURCES:
${context}

RULES:

- Do not invent verses or quotations.
- Do not invent chapter or verse numbers.
- Mention chapter and verse when referring to a teaching.
- Do not claim that the teaching is a guaranteed solution.
- Present the teaching as a perspective for reflection.
- Give practical and compassionate suggestions.
- Do not pretend to be Krishna, Arjuna, or another
  religious figure.
- Do not provide medical, legal, financial, or
  psychological diagnoses.

Structure your response as:

Understanding

Gita Perspective

Practical Reflection

A Thought to Reflect On
`;

  const interaction = await ai.interactions.create({
    model: GEMINI_MODEL,
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "text/plain"
    },
    generation_config: {
      thinking_level: "minimal"
    }
  });

  return interaction.output_text;
}

// ========================================
// API endpoint
// ========================================

app.post("/api/guidance", async (req, res) => {

  try {

    const { problem } = req.body;

    // -------------------------------
    // Validate input
    // -------------------------------

    if (!problem || typeof problem !== "string") {

      return res.status(400).json({
        error: "Please provide your problem."
      });

    }

    const userProblem = problem.trim();

    if (userProblem.length < 5) {

      return res.status(400).json({
        error: "Please describe your situation in more detail."
      });

    }

    console.log("\n================================");
    console.log("NEW USER REQUEST");
    console.log("================================");

    console.log(userProblem);

    // -------------------------------
    // Create embedding
    // -------------------------------

    console.log("Generating embedding...");

    const queryEmbedding =
      await generateEmbedding(userProblem);

    // -------------------------------
    // Search Gita
    // -------------------------------

    console.log("Searching Gita...");

    const verses =
      await searchGita(queryEmbedding);

    console.log(
      `Found ${verses.length} relevant verses.`
    );

    if (verses.length === 0) {

      return res.json({
        guidance:
          "I could not find sufficiently relevant teachings for this situation.",
        verses: []
      });

    }

    // -------------------------------
    // Gemini
    // -------------------------------

    console.log("Generating guidance...");

    const guidance =
      await generateGuidance(
        userProblem,
        verses
      );

    // -------------------------------
    // Response
    // -------------------------------

    res.json({
      guidance,

      verses: verses.map((verse) => ({
        chapter: verse.chapter,
        verse: verse.verse,
        topic: verse.topic,
        similarity: verse.similarity
      }))
    });

  } catch (error) {

    console.error("API ERROR:", error);

    res.status(500).json({
      error: "Something went wrong while generating guidance."
    });
  }
});

// ========================================
// Start server
// ========================================

async function startServer() {

  await loadEmbeddingModel();

  app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("Spiritual Guidance API running");
    console.log(`http://localhost:${PORT}`);
    console.log("================================");
  });
}

startServer();