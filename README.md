  # 🕉️ Wisdom AI

  **Wisdom AI** is an AI-powered guidance system that connects real-life situations with teachings from the **Bhagavad Gita**.

  Instead of giving generic AI answers, it uses **semantic search + RAG (Retrieval-Augmented Generation)** to find relevant Gita verses and then uses **Google Gemini** to generate practical, situation-specific guidance.

  ## ✨ Features

  * 🕉️ **Gita-grounded guidance** — Responses are based on relevant verses.
  * 🔎 **Semantic retrieval** — Uses `Xenova/gte-small` embeddings to find relevant verses.
  * 🧠 **RAG pipeline** — Retrieves relevant verses before generating an answer.
  * 🤖 **Google Gemini** — Generates practical guidance from retrieved sources.
  * 📖 **Verse references** — Responses include chapter and verse information.
  * 🎯 **Situation-based advice** — Designed to connect ancient teachings with modern problems.

  ## 🏗️ Architecture

  text
  User
    ↓
  Frontend
    ↓ POST /api/guidance
  Node.js + Express
    ↓
  Xenova/gte-small
    ↓
  Supabase Vector Search
    ↓
  Relevant Gita Verses
    ↓
  Google Gemini
    ↓
  Practical Guidance
    ↓
  Frontend


  ## 🛠️ Tech Stack

  * HTML5
  * CSS3
  * JavaScript
  * Node.js
  * Express.js
  * Hugging Face Transformers
  * Xenova/gte-small
  * Supabase
  * Google Gemini
  * dotenv
  * CORS

  ## 📁 Project Structure

  text
  wisdom-ai/
  ├── be/
  │   ├── server.js
  │   ├── package.json
  │   ├── package-lock.json
  │   └── .env.example
  ├── index.html
  ├── style.css
  ├── script.js
  ├── .gitignore
  └── README.md


  > Never commit your actual `.env` file or API keys.

  ## 🚀 Getting Started

  ### 1. Clone the repository

  bash
  git clone https://github.com/anand-badgujar/wisdom-ai.git
  cd wisdom-ai


  ### 2. Install backend dependencies

  bash
  cd be
  npm install


  ### 3. Configure environment variables

  Create `be/.env`:

  env
  SUPABASE_URL=your_supabase_url
  SUPABASE_KEY=your_supabase_key
  GEMINI_API_KEY=your_gemini_api_key


  ### 4. Start the backend

  bash
  node server.js


  The backend runs on:

  text
  http://localhost:3000


  ### 5. Run the frontend

  Open the frontend using a local development server such as **VS Code Live Server**.

  ## 🔌 API

  ### `POST /api/guidance`

  Accepts a user's real-life situation and returns AI-generated guidance based on relevant Bhagavad Gita verses.

  Example request:

  json
  {
    "problem": "I am confused about an important decision in my life."
  }


  ## 🔎 RAG Pipeline

  Wisdom AI follows these steps:

  1. User enters a problem.
  2. The problem is converted into an embedding.
  3. Supabase performs semantic vector search.
  4. Relevant Gita verses are retrieved.
  5. Retrieved verses are provided to Gemini.
  6. Gemini generates practical guidance.
  7. The frontend displays the guidance with verse references.

  ## 🔮 Future Scope

  * Better retrieval accuracy
  * Conversation history
  * Multi-language support
  * More personalized guidance
  * Improved UI/UX
  * Additional spiritual knowledge sources

  ## ⚠️ Disclaimer

  Wisdom AI is an educational and spiritual guidance project. It is not a replacement for professional medical, legal, financial, or psychological advice.

  ## 👨‍💻 Developer

  **Anand Badgujar**

  GitHub: https://github.com/anand-badgujar

  ---

  > **Wisdom AI — Ancient wisdom, practical guidance.**
