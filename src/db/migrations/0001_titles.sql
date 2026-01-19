CREATE TYPE "public"."title_status" AS ENUM('pending', 'processing', 'completed', 'failed');

--> statement-breakpoint
CREATE TABLE
	"title_queue" (
		"id" UUID PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
		"title_id" INTEGER NOT NULL,
		"status" "title_status" DEFAULT 'pending' NOT NULL,
		"summary_model" TEXT NOT NULL,
		"embedding_model" TEXT NOT NULL,
		"target_version" SMALLINT NOT NULL,
		"attempt_count" SMALLINT DEFAULT 0 NOT NULL,
		"last_error" TEXT,
		"completed_at" TIMESTAMP(6),
		"created_at" TIMESTAMP(6) DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP(6) DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
CREATE TABLE
	"title_chunks" (
		"id" INTEGER NOT NULL,
		"version" SMALLINT NOT NULL,
		"content" TEXT NOT NULL,
		"embedding" vector (1024) NOT NULL,
		"chunk_index" SMALLINT NOT NULL,
		CONSTRAINT "title_chunks_id_version_chunk_index_pk" PRIMARY KEY ("id", "version", "chunk_index")
	);

--> statement-breakpoint
CREATE TABLE
	"title_contents" (
		"id" INTEGER NOT NULL,
		"content" TEXT NOT NULL,
		CONSTRAINT "title_contents_id_pk" PRIMARY KEY ("id")
	);

--> statement-breakpoint
CREATE TABLE
	"title_metas" (
		"id" INTEGER NOT NULL,
		"version" SMALLINT NOT NULL,
		"summary_model" TEXT NOT NULL,
		"embedding_model" TEXT NOT NULL,
		"created_at" TIMESTAMP(6) DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP(6) DEFAULT NOW() NOT NULL,
		CONSTRAINT "title_metas_id_version_pk" PRIMARY KEY ("id", "version")
	);

--> statement-breakpoint
CREATE TABLE
	"title_summaries" (
		"id" INTEGER NOT NULL,
		"version" SMALLINT NOT NULL,
		"content" TEXT NOT NULL,
		"embedding" vector (1024) NOT NULL,
		CONSTRAINT "title_summaries_id_version_pk" PRIMARY KEY ("id", "version")
	);

--> statement-breakpoint
CREATE TABLE
	"titles" (
		"id" serial PRIMARY KEY NOT NULL,
		"version" SMALLINT DEFAULT -1 NOT NULL,
		"name" TEXT NOT NULL,
		"created_at" TIMESTAMP(6) DEFAULT NOW() NOT NULL,
		"updated_at" TIMESTAMP(6) DEFAULT NOW() NOT NULL
	);

--> statement-breakpoint
ALTER TABLE "title_queue"
ADD CONSTRAINT "title_queue_title_id_titles_id_fk" FOREIGN KEY ("title_id") REFERENCES "public"."titles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "title_chunks"
ADD CONSTRAINT "title_chunks_id_titles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."titles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "title_contents"
ADD CONSTRAINT "title_contents_id_titles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."titles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "title_metas"
ADD CONSTRAINT "title_metas_id_titles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."titles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "title_summaries"
ADD CONSTRAINT "title_summaries_id_titles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."titles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
CREATE INDEX "title_queue_status_index" ON "title_queue" USING btree ("status");

--> statement-breakpoint
CREATE INDEX "title_queue_title_id_index" ON "title_queue" USING btree ("title_id");

--> statement-breakpoint
CREATE UNIQUE INDEX "title_queue_title_id_target_version_summary_model_embedding_model_index" ON "title_queue" USING btree (
	"title_id",
	"target_version",
	"summary_model",
	"embedding_model"
)
WHERE
	"status" IN ('pending', 'processing');

--> statement-breakpoint
CREATE INDEX "title_chunks_embedding_index" ON "title_chunks" USING hnsw ("embedding" vector_cosine_ops);

--> statement-breakpoint
CREATE INDEX "title_chunks_content_index" ON "title_chunks" USING pgroonga ("content");

--> statement-breakpoint
CREATE INDEX "title_summaries_embedding_index" ON "title_summaries" USING hnsw ("embedding" vector_cosine_ops);

--> statement-breakpoint
CREATE INDEX "title_summaries_content_index" ON "title_summaries" USING pgroonga ("content");