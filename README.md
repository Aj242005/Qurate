<div align="center">

<img src="frontend/public/favicon.svg" alt="Qurate Logo" width="80" />

# Qurate

### ⚡ AI-Powered Database Intelligence

*Query your data in natural language. Get instant tables, graphs, and insights — no SQL required.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)

---

**Qurate** transforms how you interact with your databases. Ask questions in plain English, Hindi, Telugu, Punjabi, or any of 12+ languages — and get instant responses as formatted text, sortable tables, or beautiful charts.

[Getting Started](#-getting-started) · [Features](#-features) · [Architecture](#-architecture) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## 🎯 Overview

Qurate is a full-stack AI platform that bridges the gap between natural language and SQL. Built for analysts, developers, and non-technical users alike, it provides:

- **Conversational Database Queries** — Ask questions like "Show me top 10 customers by revenue" and get structured results
- **Multi-Modal Responses** — Every answer is rendered as the best-fit format: text, interactive tables, or auto-generated charts
- **Cross-Language Voice Input** — Speak your queries in English, Hindi, Telugu, Punjabi, Tamil, Bengali, and more
- **Sandboxed Execution** — Each user gets an isolated PostgreSQL database, ensuring data security and privacy
- **Excel-to-Database** — Upload `.xlsx`/`.csv` files to instantly create queryable database tables

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🧠 AI-Powered Pipeline
- Natural language → SQL generation via **Gemini 3.1 Pro**
- Built-in **security auditor** that validates every query before execution
- Smart **response formatter** that chooses text, table, or graph output
- Conversation memory via MongoDB for contextual follow-ups

</td>
<td width="50%">

### 🎨 Premium UI
- **Awwwards-quality** glassmorphic design
- **Dark/Light mode** with persistent theme toggle
- **Framer Motion** animations throughout
- MacBook scroll parallax, animated counters, bento grid layout

</td>
</tr>
<tr>
<td width="50%">

### 🎙️ Voice & Language
- **Web Speech API** for speech-to-text input
- **12+ languages**: English, Hindi, Punjabi, Telugu, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Urdu, French
- **Text-to-Speech** playback for assistant responses

</td>
<td width="50%">

### 🔐 Security & Auth
- **JWT-based** authentication with access + refresh tokens
- **Sandboxed PostgreSQL** databases per user
- SQL **security auditing** via AI before every execution
- Auto token refresh on 410 responses

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  React 19 · Vite 8 · TailwindCSS 4 · Redux Toolkit · Recharts │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Landing  │  │  Auth    │  │ Pricing  │  │  Dashboard   │   │
│  │  Page    │  │Login/Sign│  │  Page    │  │ Chat + Voice │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                          │ native fetch                         │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   FastAPI   │
                    │  Port 1008  │
                    └──────┬──────┘
                           │
     ┌─────────────────────┼──────────────────────┐
     │            │                │               │
┌────▼─────┐ ┌───▼────────┐ ┌─────▼──────┐ ┌─────▼──────┐
│  Redis   │ │  MongoDB   │ │ PostgreSQL │ │  Gemini AI │
│  Cache   │ │  Atlas     │ │  Sandboxes │ │  3.1 Pro   │
│          │ │            │ │            │ │            │
│ • Tokens │ │ • Users    │ │ • Per-user │ │ • SQL Gen  │
│ • User   │ │ • Chat Hist│ │   isolated │ │ • Security │
│   cache  │ │ • Accounts │ │   databases│ │ • Formatter│
└──────────┘ └────────────┘ └────────────┘ └────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8, TypeScript 5.8 | SPA with component architecture |
| **Styling** | TailwindCSS 4, Shadcn UI | Utility-first CSS with premium components |
| **Animations** | Framer Motion (motion/react) | Page transitions, micro-interactions |
| **Charts** | Recharts | Interactive data visualization |
| **State** | Redux Toolkit | Auth, chat, and UI state management |
| **API** | Native `fetch` wrapper | Auto token refresh, typed endpoints |
| **Backend** | Python 3.12, FastAPI | Async REST API |
| **AI** | Google Gemini 3.1 Pro | SQL generation, security audit, formatting |
| **Auth DB** | MongoDB Atlas | User accounts, chat history, sessions |
| **Cache** | Redis 7 | Refresh token store, user session caching |
| **User DB** | PostgreSQL 16 | Per-user sandboxed databases |
| **Packages** | pnpm (frontend), uv (backend) | Fast, disk-efficient package managers |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20 and **pnpm** (`npm i -g pnpm`)
- **Python** ≥ 3.12 and **uv** (`pip install uv`)
- **PostgreSQL** 16+ running locally
- **Redis** 7+ running locally (`redis-server`)
- **MongoDB** connection (Atlas or local)
- **Google Gemini API Key**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Qurate.git
cd Qurate
```

### 2. Backend Setup

```bash
cd backend-py

# Create virtual environment and install dependencies
uv venv
uv pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your actual credentials:
#   MONGO_URI, GEMINI_API_KEY, POSTGRES_USER, POSTGRES_PASSWORD, etc.

# Start the server
uvicorn src.main:server --port 1008 --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

### 4. Open the App

Navigate to **http://localhost:5173** — sign up, and you'll be redirected to the AI dashboard.

---

## 📁 Project Structure

```
Qurate/
├── frontend/                    # React SPA
│   ├── public/
│   │   └── favicon.svg          # Brand logo (purple lightning bolt)
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/       # Chat, Sidebar, Voice, Excel Upload
│   │   │   ├── landing/         # Hero, MacbookScroll, Features, Stats
│   │   │   ├── ui/              # GlassCard, GradientButton, ThemeToggle
│   │   │   ├── Navbar.tsx       # Responsive glassmorphic nav
│   │   │   └── ProtectedRoute.tsx
│   │   ├── lib/
│   │   │   ├── api.ts           # Native fetch wrapper with auto-refresh
│   │   │   └── utils.ts         # cn() helper
│   │   ├── pages/
│   │   │   ├── Landing.tsx      # Hero + scroll + features + stats + CTA
│   │   │   ├── Login.tsx        # Glassmorphic login form
│   │   │   ├── SignUp.tsx       # Full registration form
│   │   │   ├── Pricing.tsx      # 3-tier pricing cards
│   │   │   └── Dashboard.tsx    # AI chat interface
│   │   ├── store/
│   │   │   ├── store.ts         # Redux store config
│   │   │   ├── authSlice.ts     # Login/signup/logout
│   │   │   ├── chatSlice.ts     # Messages, prompt, history
│   │   │   └── uiSlice.ts      # Theme, sidebar, voice language
│   │   ├── types/
│   │   │   └── speech.d.ts      # Web Speech API declarations
│   │   ├── App.tsx              # Routes
│   │   ├── main.tsx             # Entry point + Provider
│   │   └── index.css            # Design system + theme variables
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.app.json
│
├── backend-py/                  # FastAPI server
│   ├── src/
│   │   └── main.py              # Routes: login, signup, prompt, upload-excel
│   ├── agents/
│   │   └── agent.py             # AI pipeline: SQL gen → audit → execute → format
│   ├── decorators/
│   │   └── auth.py              # JWT authentication decorator
│   ├── models/                  # Pydantic models & response helpers
│   ├── mongodb/                 # MongoDB client (users, chat history)
│   ├── redisdb/                 # Redis client (token store, session cache)
│   ├── postgresdb/              # PostgreSQL client (sandboxed DBs)
│   ├── utils/                   # JWT, password hashing
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 📡 API Reference

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/sign-up` | Register a new user (creates sandbox DB) |
| `POST` | `/login` | Authenticate and receive JWT tokens |
| `POST` | `/refresh` | Exchange refresh token for new access token |

### Authenticated Routes

> All require `accesstoken` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/prompt2query` | Send natural language → get text/table/graph |
| `GET` | `/chat-history` | Retrieve conversation history |
| `DELETE` | `/chat-history` | Clear conversation history |
| `POST` | `/upload-excel` | Upload `.xlsx`/`.csv` to create a DB table |

### Response Shapes

Every `/prompt2query` response includes a `data` field with one of three types:

```json
// Text response
{ "type": "text", "response": "Your database has 3 tables." }

// Table response
{
  "type": "table",
  "response": {
    "columns": ["name", "age", "city"],
    "rows": [["Alice", 30, "NYC"], ["Bob", 25, "SF"]]
  }
}

// Graph response
{
  "type": "graph",
  "response": {
    "x": ["Jan", "Feb", "Mar"],
    "y": [100, 150, 200],
    "x_label": "Month",
    "y_label": "Revenue"
  }
}
```

---

## 🎨 Design System

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--q-purple` | `#863bff` | Primary brand, CTAs, gradients |
| `--q-purple-deep` | `#7e14ff` | Hover states, accents |
| `--q-cyan` | `#47bfff` | Secondary brand, chart accents |

### Visual Effects

- **Glassmorphism** — `.glass` and `.glass-strong` utility classes
- **Glow Effects** — `.glow-purple` and `.glow-cyan` for hover states
- **Text Gradient** — `.text-gradient` for the brand purple→cyan gradient
- **Mesh Background** — `.bg-gradient-mesh` for ambient radial gradients
- **Shimmer Loading** — `.shimmer` for skeleton loading states

### Theme Toggle

The app supports **dark** and **light** modes:
- Persisted in `localStorage` as `qurate_theme`
- Toggled via the sun/moon icon in the navbar or sidebar
- CSS variables swap automatically via the `.dark` class on `<html>`

---

## 🎙️ Voice Input

Qurate supports cross-language voice queries via the Web Speech API:

| Language | Code | Language | Code |
|----------|------|----------|------|
| English | `en-US` | Hindi | `hi-IN` |
| Punjabi | `pa-IN` | Telugu | `te-IN` |
| Tamil | `ta-IN` | Bengali | `bn-IN` |
| Marathi | `mr-IN` | Gujarati | `gu-IN` |
| Kannada | `kn-IN` | Malayalam | `ml-IN` |
| Urdu | `ur-IN` | French | `fr-FR` |

The language picker is accessible via the **🌐** button next to the microphone in the chat input.

---

## 🔒 Security Model

1. **JWT Authentication** — Short-lived access tokens (60 min) + long-lived refresh tokens (7 days)
2. **Redis Token Store** — Refresh tokens are stored in Redis hashes (`refresh:{email}`) with 7-day TTL; tokens can be individually invalidated without affecting other sessions
3. **User Session Cache** — Authenticated user details are cached in Redis (`user:{email}`) for 30 minutes, reducing MongoDB reads on every request
4. **Sandboxed Databases** — Each user gets an isolated PostgreSQL database; cross-DB queries are impossible
5. **AI Security Audit** — Every generated SQL query passes through a dedicated security agent before execution
6. **No Raw SQL Exposure** — Users never see or write SQL; the AI generates and the auditor validates

---

## 📊 Chat Response Types

The dashboard renders three distinct response types inline:

### Text
Plain conversational responses, clarifications, and status messages. Includes a **🔊 speaker button** for text-to-speech playback.

### Table
Sortable, scrollable data tables with alternating row colors. Click column headers to sort ascending/descending.

### Graph
Auto-generated bar charts using Recharts with brand gradient fills. The AI automatically selects the best chart type based on the data shape.

---

## 🛠️ Development

### Frontend Scripts

```bash
pnpm dev          # Start Vite dev server (HMR)
pnpm build        # TypeScript check + production build
pnpm preview      # Preview production build locally
```

### Backend Scripts

```bash
uvicorn src.main:server --port 1008 --reload    # Dev with hot reload
python start.py                                  # Production start
```

### Environment Variables

Create a `.env` file in `backend-py/`:

```env
MONGO_URI="mongodb+srv://..."
GEMINI_API_KEY="your-gemini-api-key"
ACCESS_TOKEN_SECRET_KEY="your-secret"
REFRESH_TOKNE_SECRET_KEY="your-refresh-secret"
ACCESS_TOKEN_DURATION="60"
REFRESH_TOKEN_DURATION="7"
POSTGRES_PASSWORD="postgres"
POSTGRES_HOST="localhost"
POSTGRES_USER="postgres"
PORT=1008
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 💜 by Akshit Jain**

<sub>Powered by Gemini AI · React · FastAPI · PostgreSQL · MongoDB</sub>

</div>