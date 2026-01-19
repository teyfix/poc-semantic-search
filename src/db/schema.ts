import { Config } from "@/config";
import { sql } from "drizzle-orm";
import * as d from "drizzle-orm/pg-core";

const TimestampSchema = {
  /**
   * Timestamp when this entity was created.
   * Title might be created but not yet processed.
   */
  created_at: d.timestamp({ precision: 6 }).notNull().defaultNow(),

  /**
   * Timestamp when this entity was last updated.
   * Title might be created but not yet processed.
   */
  updated_at: d.timestamp({ precision: 6 }).notNull().defaultNow(),
};

export const titles = d.pgTable("titles", {
  /**
   * Auto-incremented ID
   */
  id: d.serial().primaryKey(),

  /**
   * Current version of this title.
   *
   * Every other generated entity obeys this version,
   * where they can be multiple versions of the entities.
   *
   * Version change may occur if the same title is being
   * processed with a different model.
   *
   * Set `-1` as default to prevent searching any title
   * without a version.
   */
  version: d.smallint().notNull().default(-1),

  /**
   * Original name of the title
   */
  name: d.text().notNull(),

  /**
   * Timestamps belonging to original creation
   */
  ...TimestampSchema,
});

/**
 * Shared version schema for referencing the current version of a title.
 */
const VersionSchema = {
  /**
   * ID of the title @eq `titles.id`
   */
  id: d
    .integer()
    .notNull()
    .references(() => titles.id, { onDelete: "cascade" }),

  /**
   * Version of the title @eq `titles.version`
   */
  version: d.smallint().notNull(),
};

/**
 * Full document content in a seperated table
 * for optimization.
 */
export const title_contents = d.pgTable(
  "title_contents",
  {
    /**
     * ID of the title
     */
    id: d
      .integer()
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),

    /**
     * Original content of the full document.
     */
    content: d.text().notNull(),
  },
  (t) => [d.primaryKey({ columns: [t.id] })],
);

/**
 * Chunk details in a seperated table for optimization.
 * This metadata applies to every chunk in this version.
 */
export const title_metas = d.pgTable(
  "title_metas",
  {
    ...VersionSchema,

    /**
     * Which model is used to generate summary of this version.
     */
    summary_model: d.text().notNull(),

    /**
     * Which model is used to generate embeddings of the chunks of this version.
     */
    embedding_model: d.text().notNull(),

    /**
     * Versioned timestamps for this title
     */
    ...TimestampSchema,
  },
  (t) => [d.primaryKey({ columns: [t.id, t.version] })],
);

/**
 * Shared schema for summary and chunks.
 */
const ChunkSchema = {
  ...VersionSchema,

  /**
   * Content of this summary or chunk
   */
  content: d.text().notNull(),

  /**
   * Generated embedding based on content
   */
  embedding: d.vector({ dimensions: Config.EMBEDDING_DIMENSIONS }).notNull(),
};

/**
 * Summarized title for incremental search.
 * This will be the first step while searching titles.
 */
export const title_summaries = d.pgTable(
  "title_summaries",
  {
    ...ChunkSchema,
  },
  (t) => [
    d.primaryKey({ columns: [t.id, t.version] }),
    d.index().using("hnsw", t.embedding.op("vector_cosine_ops")),
    d.index().using("pgroonga", t.content),
  ],
);

/**
 * Chunks of the original content of the title.
 */
export const title_chunks = d.pgTable(
  "title_chunks",
  {
    ...ChunkSchema,

    /**
     * Index of this chunk
     */
    chunk_index: d.smallint().notNull(),
  },
  (t) => [
    d.primaryKey({ columns: [t.id, t.version, t.chunk_index] }),
    d.index().using("hnsw", t.embedding.op("vector_cosine_ops")),
    d.index().using("pgroonga", t.content),
  ],
);

/**
 * Status of the title in the processing queue
 */
export const titleStatus = d.pgEnum("title_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

/**
 * Processing queue of the titles.
 */
export const titleQueue = d.pgTable(
  "title_queue",
  {
    /**
     * Unique ID for this task
     */
    id: d.uuid().primaryKey().defaultRandom(),

    /**
     * ID of the title @eq `titles.id`
     */
    title_id: d
      .integer()
      .notNull()
      .references(() => titles.id, { onDelete: "cascade" }),

    /**
     * Status of the task
     */
    status: titleStatus().notNull().default("pending"),

    /**
     * Model which will be used to generate summary
     */
    summary_model: d.text().notNull(),

    /**
     * Model which will be used to generate embeddings
     * for summary and chunks
     */
    embedding_model: d.text().notNull(),

    /**
     * Target version of the title after this task
     */
    target_version: d.smallint().notNull(),

    /**
     * How many times this task has been attempted
     */
    attempt_count: d.smallint().notNull().default(0),

    /**
     * Last reason why this task failed
     */
    last_error: d.text(),

    /**
     * When this task was completed
     */
    completed_at: d.timestamp({ precision: 6 }),

    /**
     * Task timestamps
     */
    ...TimestampSchema,
  },
  (t) => [
    d.index().on(t.status),
    d.index().on(t.title_id),
    d
      .uniqueIndex()
      .on(t.title_id, t.target_version, t.summary_model, t.embedding_model)
      .where(sql`"status" IN ('pending', 'processing')`),
  ],
);
