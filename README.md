<div align="center">

# 🎓 UniQ

**A full-stack digital services platform for university student affairs — requests, complaints, payments, academic records, and an AI assistant, all in one place.**

[![Node](https://img.shields.io/badge/Node.js-%3E%3D18-0B2545?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-12294B?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-1B3B6F?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-1E4079?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-234A85?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-27548F?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-2B5FA0?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-3068B0?style=flat-square&logo=turborepo&logoColor=white)](https://turborepo.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-3672C4?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

<sub>Graduation Project · Faculty of Computers and Data Science · Alexandria University</sub>

[Features](#-features) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Getting Started](#-getting-started) • [API Overview](#-api-overview) • [Chatbot](#-ai-chatbot)

</div>

---

## 📖 Overview

**UniQ** is a full-stack platform that digitizes the everyday interactions between university students, academic staff, and the student affairs office. Students can submit requests and complaints, track their academic records, make payments, and get instant help from an Arabic/English AI assistant — while staff and administrators manage everything through dedicated dashboards.

The project is organized as a **Turborepo monorepo** for the Node.js/TypeScript backend, alongside a standalone **React frontend** and a standalone **Python (FastAPI) RAG chatbot microservice**, all orchestrated together with **Docker Compose**.

---

## ✨ Features

| Area | Capabilities |
|---|---|
| 👤 **Authentication & Roles** | JWT-based auth (short & long-lived tokens), role-based access control for `student`, `academic_staff`, `affairs_staff`, and `admin` |
| 📝 **Requests & Complaints** | Students submit requests/complaints with file attachments; staff review, approve, and track status through a full lifecycle |
| 🎓 **Academic Records** | Course history, GPA tracking, semester/program management, doctor approvals |
| 💳 **Payments** | Full payment lifecycle simulation (`initiate` → `confirm`/`fail`) with atomic DB commits and sequential request/payment numbering — no external gateway involved |
| 🔔 **Notifications** | Real-time in-app notifications for students and staff |
| 📧 **Email Delivery** | Background email worker (BullMQ + Redis) for transactional emails, decoupled from the API |
| 🖼️ **File Uploads** | Cloudinary-backed photo/document uploads with signed upload URLs |
| 📊 **Dashboards** | Role-specific dashboards (student, academic staff, affairs office, admin) with charts and analytics |
| 🤖 **AI Chatbot** | Bilingual (Arabic/English) RAG-powered assistant for university bylaws, GPA calculation/planning, and course recommendations |
| 🔒 **Row-Level Security** | PostgreSQL RLS policies enforced via a restricted `app_user` DB role, separate from the migration superuser |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Client
        FE["🖥️ Frontend<br/>React 19 + Vite"]
    end

    subgraph Backend["Node.js Backend (Turborepo)"]
        API["🚀 API<br/>Express + TypeScript + Prisma"]
        WORKER["📧 Email Worker<br/>BullMQ"]
    end

    subgraph AI["Python AI Service"]
        BOT["🤖 Chatbot<br/>FastAPI + LangChain + Groq"]
    end

    DB[("🐘 PostgreSQL<br/>Row-Level Security")]
    REDIS[("🧮 Redis<br/>Queues & Rate Limiting")]
    CLOUD["☁️ Cloudinary"]

    FE -->|REST /api/v1| API
    FE -.->|Chat UI| BOT
    API -->|Prisma / app_user role| DB
    API -->|Enqueue jobs| REDIS
    WORKER -->|Consume jobs| REDIS
    API --> CLOUD
    BOT -->|Auth & data proxy| API

    style FE fill:#5B8DBE,color:#0B1D3A,stroke:#0B1D3A,stroke-width:1px
    style API fill:#0B2545,color:#fff,stroke:#5B8DBE,stroke-width:1px
    style WORKER fill:#1B3B6F,color:#fff,stroke:#5B8DBE,stroke-width:1px
    style BOT fill:#2E5C8A,color:#fff,stroke:#5B8DBE,stroke-width:1px
    style DB fill:#0B1D3A,color:#fff,stroke:#5B8DBE,stroke-width:1px
    style REDIS fill:#27548F,color:#fff,stroke:#5B8DBE,stroke-width:1px
    style CLOUD fill:#7FA8D9,color:#0B1D3A,stroke:#0B1D3A,stroke-width:1px
```

**Key design decisions:**
- The **chatbot never talks to the database directly** — every chatbot action (auth, GPA data, chat logging) is proxied through the main API (`/api/v1/chatbot/*`), keeping a single source of truth and a single security boundary.
- The database is accessed through **two Postgres roles**: a superuser (migrations only, via [`entrypoint.sh`](entrypoint.sh)) and a restricted `app_user` role that the running API actually uses, with PostgreSQL **Row-Level Security** policies defined in [`sql/`](sql) and [`packages/database/prisma`](packages/database/prisma).
- Emails are **never sent inline** in a request — they're queued via BullMQ/Redis and processed by the dedicated [`apps/workers`](apps/workers) service, so slow SMTP calls never block API responses.

---

## 🛠️ Tech Stack

<table>
<tr>
<td valign="top" width="33%">

**Frontend**
- React 19 + Vite 7
- React Router 7
- Tailwind CSS 4
- Recharts
- Axios

</td>
<td valign="top" width="33%">

**Backend**
- Node.js 20 + TypeScript
- Express 5
- Prisma 7 (PostgreSQL)
- BullMQ + Redis
- JWT, Helmet, Zod
- Cloudinary, Nodemailer

</td>
<td valign="top" width="33%">

**AI Chatbot**
- Python 3.11 + FastAPI
- LangChain + Groq (Llama 3.3 / 3.1)
- ChromaDB (vector store)
- Sentence-Transformers
- Arabic NLP: AraBERT, PyArabic, Farasa

</td>
</tr>
</table>

**Infrastructure:** Docker & Docker Compose · Turborepo (npm workspaces) · PostgreSQL · Redis

---

## 📁 Project Structure

```
UniQ/
├── apps/
│   ├── api/              # 🚀 Express + TypeScript + Prisma REST API
│   ├── workers/          # 📧 BullMQ background email worker
│   └── chatbot/          # 🤖 FastAPI + Streamlit RAG chatbot microservice
├── frontend/              # 🖥️ React 19 + Vite single-page application
├── packages/
│   ├── database/          # 🗄️ Shared Prisma schema, migrations & client (@repo/db)
│   ├── config/             # ⚙️ Shared Redis/Cloudinary configuration (@repo/config)
│   ├── ui/                  # 🧩 Shared React UI primitives (@repo/ui)
│   ├── eslint-config/        # 🧹 Shared ESLint configuration
│   └── typescript-config/     # 🧾 Shared tsconfig presets
├── sql/                    # 🐘 Raw SQL: roles, permissions, RLS policies & seed data
├── http/                    # 🔬 REST Client (.http) request collections for manual API testing
├── diagrams/                 # 🗺️ Architecture / flow diagrams (draw.io)
├── docker-compose.yml         # 🐳 Orchestrates api, chatbot, workers, postgres, redis
└── entrypoint.sh                # 🔑 API container startup: migrate → grant RLS perms → run
```

<details>
<summary><strong>📂 Explore each part of the codebase</strong></summary>

| Path | What lives here |
|---|---|
| [`apps/api/src/routes`](apps/api/src/routes) | All REST route definitions, grouped by domain |
| [`apps/api/src/controller`](apps/api/src/controller) | Request handlers |
| [`apps/api/src/services`](apps/api/src/services) | Business logic, one service per domain |
| [`apps/api/src/middlewares`](apps/api/src/middlewares) | Auth, rate limiting, logging, file upload, error handling |
| [`apps/api/src/validator`](apps/api/src/validator) | Zod request-validation schemas |
| [`apps/workers/src/email`](apps/workers/src/email) | Email queue processor & worker entrypoint |
| [`packages/database/prisma/schema.prisma`](packages/database/prisma/schema.prisma) | Full data model (31 models: users, students, staff, requests, complaints, payments, academic records…) |
| [`packages/database/prisma/migrations`](packages/database/prisma/migrations) | Versioned migration history |
| [`apps/chatbot/services`](apps/chatbot/services) | RAG, intent classification, GPA calculation, course recommendation services |
| [`apps/chatbot/core/orchestrator.py`](apps/chatbot/core/orchestrator.py) | Central pipeline that routes a user message through intent → RAG → LLM |
| [`frontend/src/features`](frontend/src/features) | Feature-based frontend modules: `auth`, `student`, `academic`, `affairs`, `admin`, `chatbot`, `notifications` |
| [`frontend/src/routes/AppRoutes.jsx`](frontend/src/routes/AppRoutes.jsx) | Full role-based route map |

</details>

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js ≥ 18 and npm (for local, non-Docker frontend development)
- API keys/credentials for: PostgreSQL, Redis, Cloudinary, Gmail (App Password), Groq, and optionally Hugging Face
- Stripe keys are present in `apps/api/.env.example` as reserved config, but the payment flow currently runs fully simulated — no live Stripe calls are made (see [Payments](#-api-overview))

### 1. Clone & configure environment variables

```bash
git clone https://github.com/<your-org>/uniq.git
cd uniq
```

Each service reads its own `.env` file. Copy every example file and fill in real values — **never commit the resulting `.env` files**:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/workers/.env.example apps/workers/.env
cp packages/database/.env.example packages/database/.env
cp apps/chatbot/.env.example apps/chatbot/.env
cp frontend/.env.example frontend/.env
```

| File | Used by |
|---|---|
| [`.env.example`](.env.example) | Docker Compose (Postgres container + shared `HF_TOKEN`/`APP_USER_PW`) |
| [`apps/api/.env.example`](apps/api/.env.example) | API: JWT secrets, DB, Redis, Cloudinary, email, Stripe |
| [`apps/workers/.env.example`](apps/workers/.env.example) | Email worker: DB, Redis, email credentials |
| [`packages/database/.env.example`](packages/database/.env.example) | Prisma CLI (migrations) |
| [`apps/chatbot/.env.example`](apps/chatbot/.env.example) | Chatbot: Groq API key, backend URLs, CORS |
| [`frontend/.env.example`](frontend/.env.example) | Frontend: API base URL |

### 2. Run everything with Docker Compose

```bash
docker compose up --build
```

This starts, in order: **PostgreSQL**, **Redis**, the **API** (runs Prisma migrations and grants RLS permissions on boot via [`entrypoint.sh`](entrypoint.sh)), the **email worker**, and the **chatbot** service.

| Service | URL |
|---|---|
| API | http://localhost:3000 |
| Chatbot API (FastAPI) | http://localhost:7860 |
| Chatbot demo UI (Streamlit) | http://localhost:8501 |
| PostgreSQL | localhost:5000 |
| Redis | localhost:6379 |

### 3. Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `VITE_API_BASE_URL` (see [`frontend/.env.example`](frontend/.env.example)), defaulting to `http://localhost:3000`.

### 4. (Optional) Run the Node backend outside Docker

```bash
npm install          # installs all workspaces (apps/* and packages/*)
npm run dev           # turbo run dev — runs every app in parallel
```

Useful root-level scripts (see [`package.json`](package.json) and [`turbo.json`](turbo.json)):

```bash
npm run build          # turbo run build
npm run lint            # turbo run lint
npm run check-types      # turbo run check-types
npm run format             # prettier --write
```

---

## 🔌 API Overview

All routes are mounted under `/api/v1` — see [`apps/api/src/routes/v1/v1.ts`](apps/api/src/routes/v1/v1.ts).

| Route | Auth | Purpose |
|---|---|---|
| `/auth` | Public | Login, logout, password reset |
| `/programs` | Public | Academic programs listing |
| `/collageInfo` | Public | College/faculty public information |
| `/chatbot` | Public* | Proxy endpoints consumed by the chatbot service |
| `/notifications` | 🔒 | User notifications |
| `/users` | 🔒 | User profile & management |
| `/students` | 🔒 Student | Student-only academic/records endpoints |
| `/complaints` | 🔒 | Complaint submission & review |
| `/requests` | 🔒 | Request submission & review |
| `/academic` | 🔒 | Academic staff endpoints (approvals, records) |
| `/staff` | 🔒 | Staff management |
| `/payments` | 🔒 | Payment processing (Stripe) |

*Chatbot endpoints validate the forwarded user session — see [`chatbot.route.ts`](apps/api/src/routes/chatbot/chatbot.route.ts) for details.

Ready-to-run request collections for every module (auth, students, staff, requests, complaints, payments, academic, programs, landing page) are available in [`http/`](http) — open them with the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) VS Code extension. Sample tokens have been replaced with placeholders — log in via `/api/v1/auth/login` to obtain your own.

---

## 🤖 AI Chatbot

The chatbot ([`apps/chatbot`](apps/chatbot)) is a standalone Python service combining:

- **Intent classification** ([`services/intent_service.py`](apps/chatbot/services/intent_service.py)) to route each message
- **RAG over university bylaws** ([`services/rag_service.py`](apps/chatbot/services/rag_service.py), [`services/academic_rag_service.py`](apps/chatbot/services/academic_rag_service.py)) using ChromaDB + multilingual embeddings, sourced from the PDFs in [`apps/chatbot/data`](apps/chatbot/data)
- **GPA calculation & planning** ([`services/gpa_service.py`](apps/chatbot/services/gpa_service.py))
- **Course recommendations** ([`services/recommendation_service.py`](apps/chatbot/services/recommendation_service.py))
- An **orchestrator** ([`core/orchestrator.py`](apps/chatbot/core/orchestrator.py)) that ties intent → retrieval → LLM (Groq/Llama) generation together, with per-role **access control** ([`core/access_control.py`](apps/chatbot/core/access_control.py))
- A lightweight **Streamlit** front door ([`app.py`](apps/chatbot/app.py)) for demoing the assistant independently of the main frontend

The production chat experience is embedded directly into the React app via [`frontend/src/features/chatbot`](frontend/src/features/chatbot); the frontend never calls the chatbot service directly — every request flows through the Node API's `/api/v1/chatbot` routes.

---

## 🗄️ Database

- Schema, relations, and 31 domain models are defined in [`packages/database/prisma/schema.prisma`](packages/database/prisma/schema.prisma)
- Versioned migrations live in [`packages/database/prisma/migrations`](packages/database/prisma/migrations)
- Role/permission bootstrapping and Row-Level Security policies live in [`sql/`](sql), applied in order (`01_init_db_user.sql` → `12_complaints.sql`)
- [`packages/database/scripts/grant-permissions.ts`](packages/database/scripts/grant-permissions.ts) grants table-level permissions to the restricted `app_user` role after migrations run — see [`entrypoint.sh`](entrypoint.sh) for the full boot sequence

---

## 🔐 Security Notes

- All secrets are supplied via environment variables — see the `.env.example` files above. **No credentials are committed to this repository.**
- JWTs use separate short-lived and long-lived secrets (`JWT_SECRET_SHORT_LIVE`, `JWT_SECRET_LONG_LIVE`).
- The API runs against Postgres as a **least-privilege `app_user` role**, never the superuser, with Row-Level Security enforced at the database layer.
- Rate limiting is applied both by IP ([`ip-rate-limiter`](apps/api/src/middlewares/ip-rate-limiter.ts)) and by authenticated JWT ([`jwt-rate-limiter`](apps/api/src/middlewares/jwt-rate-limiter.ts)).

---

## 📄 License

No license has been specified yet for this project. Add a `LICENSE` file to define how others may use, modify, and distribute this code.

