# 🔍 LokalHybrid

> [!WARNING]  
> **Under Development**  
> Infrastructure orchestration (Docker), Database Schema (Drizzle), and Core Search Logic are implemented. Full application integration is currently in progress.

A high-performance, enterprise-grade Proof of Concept (POC) for a **Hybrid Search Engine**.

Inspired by the architectural principles outlined in [How to Build Enterprise AI RAG](https://bytevagabond.com/post/how-to-build-enterprise-ai-rag), this project implements a production-ready indexing pipeline and retrieval strategy that goes beyond simple vector search.

## 🧪 Architecture & Research Goals

The goal of this POC is to solve common RAG "hallucinations" and retrieval failures by combining multiple search strategies and AI-driven query refinement.

### 1. Hybrid Retrieval (The "Silver Bullet")

Following enterprise best practices, this system uses a dual-engine approach implemented in `src/db/queries.ts`:

- **Semantic Search (pgvector/HNSW)**: Captures intent and meaning using high-dimensional vectors (Cosine Distance).
- **Full-Text Search (PGroonga)**: Provides exact keyword matching and symbol search using the `&@~` operator.

### 2. Intent-Aware Query Expansion

Before hitting the database, user queries are processed by `improveQuery()`. Using **Llama 3.3 (Groq)**, the system transforms vague inputs into descriptive, context-rich search terms grounded in temporal data.

### 3. Versioned Document Indexing & Queues

To support model evolution (switching embedding or summary models), the schema implements a **Versioned Schema**:

- **Titles & Summaries**: Versioned to allow re-indexing without downtime.
- **Processing Queue**: A robust `title_queue` handles asynchronous processing states (`pending`, `processing`, `completed`, `failed`).

### 4. Enterprise-Grade Infrastructure

- **GPU-Accelerated Inference**: Uses TEI (Text Embeddings Inference) with NVIDIA GPU passthrough.
- **Nginx Caching Layer**: High-performance caching of embedding `POST` requests to minimize GPU latency.
- **Fail-Fast Configuration**: Strict validation using `env-var` and Drizzle ORM to prevent misconfiguration at startup.

> [!TIP]
>
> Although this repo is a work-in-progress, the TEI infrastructure (Docker + Nginx + TEI) is hardened and ready for immediate use. It handles model caching and GPU resource management out of the box.
>
> The cache key includes `$EMBEDDING_MODEL` environment variable on purpose to ensure cache integrity if you switch models.

## 🛠️ The Tech Stack

| Component        | Technology                                     |
| :--------------- | :--------------------------------------------- |
| **Database**     | PostgreSQL 17 (Supabase) + pgvector + PGroonga |
| **ORM**          | Drizzle ORM (TypeScript)                       |
| **Embeddings**   | HuggingFace TEI (`BAAI/bge-large-en-v1.5`)     |
| **LLM (Intent)** | Groq (Llama-3.3-70b-versatile)                 |
| **Proxy/Cache**  | Nginx Alpine                                   |
| **Runtime**      | Docker Compose with GPU support                |

> [!NOTE]
>
> All the models, and the dimensions are configurable.

## 🚀 Getting Started

### 1. Configure Environment

Clone `.example.env` to `.env` and fill in your keys:

```bash
# MUST be supabase_admin for migration compatibility
POSTGRES_USER="supabase_admin"
GROQ_API_KEY="gsk_..."
EMBEDDING_MODEL="BAAI/bge-large-en-v1.5"
```

### 2. Spin up the Stack

```bash
# Ensure you have NVIDIA Container Toolkit installed for GPU support
docker compose up -d
```

### 3. Initialize Schema

```bash
bun db:sync
```

## 🔍 Search Strategy Details

The search logic (`src/db/queries.ts`) uses a sophisticated multi-stage approach:

1. **Query Improvement**: LLM expands query intent using `improveQuery`.

2. **Pre-Candidate Filtering**:
   - Searches `title_summaries` first to find relevant documents.
   - Filters using combined **Cosine Distance** (Vector) and **PGroonga Match** (Text).

3. **Chunk Resolution**:
   - Joins valid candidates with `title_chunks` for granular retrieval.

4. **Re-Ranking**:
   - Results are ordered by a composite score of semantic similarity and text matching.
