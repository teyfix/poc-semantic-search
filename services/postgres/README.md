# PostgreSQL Service (Supabase)

This service provides a hardened PostgreSQL 17 instance based on the Supabase image (`supabase/postgres:17.6.1.072`).  It is optimized for performance and compatibility, pre-loaded with extensions like **PGroonga** (for full-text search) and **pgvector** (for embeddings). 

## 🛠️ Key Configurations

### 1. Robust Healthcheck

Unlike standard Postgres containers, this setup uses a dynamic healthcheck configuration: 

- **Tool**: Uses `pg_isready` to verify the postmaster is accepting connections. 
- **Security**: Utilizes `PGPASSWORD` to authenticate the healthcheck without exposing credentials in the process list. 
- **Responsiveness**: A `start_interval` of **1s** ensures dependent services (like the API) can start immediately once the DB is ready. 

### 2. Networking & Discovery

- **Alias**: The service is aliased as `pg.lokal` within the `postgres` network. 
- **Decoupling**: This allows connection strings (`POSTGRES_URL`) to remain constant even if container names change. 
- **External Access**: Maps port `5432` to the host for management via TablePlus, pgAdmin, or DBeaver. 

### 3. Environment Variable Enforcement

The compose configuration uses the `${POSTGRES_PASSWORD:?}` syntax.  This "fail-fast" mechanism prevents the container from starting if the password is missing from your `.env` file, ensuring no insecure instances are deployed. 
