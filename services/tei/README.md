# Text Embeddings Inference (TEI) Service

This service provides a high-performance interface for generating text embeddings using Hugging Face's `text-embeddings-inference` (TEI) backend, optimized with an Nginx caching layer. 

## 🏗️ Architecture

The service is split into two layers to balance performance and cost: 

### 1. TEI Server (`tei_server`)

- **Backend**: Runs the Rust-based TEI engine. 
- **Acceleration**: Utilizes NVIDIA GPUs (via `nvidia` Docker runtime) with `count: all` capabilities. 
- **Model**: Dynamically loaded via the `EMBEDDING_MODEL` environment variable. 

### 2. Caching Proxy (`tei`)

- **Engine**: Nginx Alpine. 
- **POST Caching**: Uniquely configured to cache embedding results. 
- **Cache Logic**: Since embedding the same text with the same model yields the same vector, we cache `POST` requests for **1 day**. 
- **Cache Key**: Composite key of `$EMBEDDING_MODEL | $URI | $REQUEST_BODY` to ensure integrity if models change. 

## 🛠️ Configuration Details

### Healthchecks & Model Loading

The `tei_server` is configured with an extended healthcheck period:
- **Retries**: `100` 
- **Start Interval**: `6s` 

This intentional delay (approx. 10 minutes) allows the container sufficient time to download large model weights (e.g., `BAAI/bge-large`) from Hugging Face on the first boot without orchestrators killing the container. 

### Observability

You can verify cache performance by inspecting the `X-Cache-Status` header in responses: 

- `HIT`: Served from Nginx cache (0ms GPU usage). 
- `MISS`: Served by the TEI server (GPU inference) and saved to cache. 

### Network Isolation

- **`tei_priv`**: Internal network for unexposed communication between Nginx and the TEI backend. 
- **`tei`**: Public-facing network accessible at `tei.lokal` (aliased) or `localhost:8000`. 

## 💾 Volumes

- `tei_data`: Persistent storage for downloaded model weights (prevents re-downloading on restart). 
- `tei_cache`: Persistent storage for the Nginx cache zones. 
