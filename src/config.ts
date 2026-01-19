import { OpenAPI } from "@/lib/embeddings/index.js";
import env from "env-var";

export class ConfigError extends Error {}

/**
 * Application Configuration
 * Validates environment variables and provides a type-safe interface.
 */
export const Config = {
  // --- 🐘 PostgreSQL ---
  /**
   * Database connection string.
   * Note: Expects user 'supabase_admin' for full migration/extension support.
   */
  POSTGRES_URL: env.get("POSTGRES_URL").required().asUrlString(),

  // --- 🤖 AI & LLM (Groq) ---
  /**
   * API key for Groq inference
   */
  GROQ_API_KEY: env.get("GROQ_API_KEY").required().asString(),

  /**
   * LLM model used for text summarization tasks
   */
  SUMMARY_MODEL: env.get("SUMMARY_MODEL").required().asString(),

  /**
   * LLM model used for completion of user queries before generating embeddings for the query.
   */
  COMPLETION_MODEL: env.get("COMPLETION_MODEL").required().asString(),

  // --- 🧠 Embeddings & Vector Search ---
  /** * The base URL for the Text Embeddings Inference (TEI) server.
   * Maps to 'tei.lokal' in production/docker or 'localhost:8000' for local dev.
   */
  EMBEDDING_SERVER_URL: env
    .get("EMBEDDING_SERVER_URL")
    .required()
    .asUrlString(),

  /**
   * The specific HuggingFace model ID for generating vectors
   */
  EMBEDDING_MODEL: env.get("EMBEDDING_MODEL").required().asString(),

  /**
   * Vector dimensions (e.g., 1024 for BGE-Large).
   * Used for DB schema definitions and zero-padding logic.
   */
  EMBEDDING_DIMENSIONS: env.get("EMBEDDING_DIMENSIONS").default(1024).asInt(),
};

/**
 * Configure the OpenAPI client for the Embeddings service.
 * This links the generated SDK to the TEI server defined in environment variables.
 */
OpenAPI.BASE = Config.EMBEDDING_SERVER_URL;
