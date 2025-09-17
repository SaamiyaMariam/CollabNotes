# 📝 CollabNotes

A **Notion-inspired collaborative document editor** built as a full-stack portfolio project.  
The goal is to showcase modern **full-stack skills** (React + Tailwind + NestJS + Postgres) and real-time collaboration patterns (WebSockets + CRDTs with Y.js).

---

## 🚀 Features

- 🔐 **Auth**: JWT-based login/signup with refresh tokens
- 📄 **Docs CRUD**: Create, read, update, and delete documents
- ✍️ **Rich Text Editing**: TipTap editor with bold/italic/headings/lists
- ⚡ **Real-time Collaboration**: Multi-user editing via Y.js + WebSockets
- 👥 **Presence**: Show who’s online and cursor positions
- 💾 **Persistence**: CRDT state periodically stored in Postgres
- 🎨 **Frontend**: React + TypeScript + TailwindCSS
- ⚙️ **Backend**: NestJS + Prisma + PostgreSQL (+ Redis optional)
- 🐳 **Infra**: Docker for Postgres/Redis, PNPM monorepo

---

## 📂 Project Structure

```collab-notes/
├─ apps/
│  ├─ api/       # NestJS backend (all server code lives here)
│  └─ web/       # React + Vite frontend (all client code lives here)
├─ docker/       # optional folder for DB init scripts, seed data, etc.
├─ docker-compose.yml   # spins up Postgres + Redis
├─ pnpm-workspace.yaml  # tells pnpm this is a monorepo
└─ README.md
```
---

## 🛠️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/collab-notes.git
cd collab-notes
```
### 2. Install dependencies
```bash
pnpm install
````
### 3. Start Postgres + Redis
```bash
docker compose up -d
````
### 4. Setup backend (NestJS + Prisma)
```bash
cd apps/api
npx prisma migrate dev --name init
pnpm start:dev
````
Backend runs on: http://localhost:4000
### 5. Start frontend (React + Vite)
```bash
cd apps/web
pnpm dev
````
## 🧑‍💻 Development Notes

Environment variables:

apps/api/.env → DB + JWT secrets

apps/web/.env → Frontend API URL (VITE_API_URL)

Git ignores node_modules/, dist/, and .env files.

## 📜 License

MIT
