import { generateEmbeddings } from "@/helpers/generate-embeddings";
import { improveQuery } from "@/helpers/improve-query";
import { and, cosineDistance, desc, eq, lte, or, sql } from "drizzle-orm";
import { db } from "./drizzle";
import { title_chunks, title_summaries, titles } from "./schema";

// TODO: Fix invalid JOINs below (there are some :d)
// TODO: Fix scoring function
export async function searchTitle(options: {
  query: string;
  similarity: {
    text: number;
    semantic: number;
  };
}) {
  const textQuery = options.query;
  const semanticQuery = await improveQuery({ query: options.query });
  const queryVector = await generateEmbeddings({ input: semanticQuery });

  const distance = {
    text: 1 - options.similarity.text,
    semantic: 1 - options.similarity.semantic,
  };

  const precandidates = db.$with("sq_titles").as(
    db
      /**
       * ? aliasing table columns to prevent collision on next step
       */
      .select({
        id: sql<number>`${titles.id}`.as("title_id"),
        name: sql<string>`${titles.name}`.as("title_name"),
        version: sql<number>`${titles.version}`.as("title_version"),
      })
      .from(titles)
      .innerJoin(
        title_summaries,
        and(
          eq(titles.id, title_summaries.id),
          eq(titles.version, title_summaries.version),
        ),
      )
      .where(
        or(
          lte(
            cosineDistance(title_summaries.embedding, queryVector),
            distance.semantic,
          ),
          lte(
            sql`${title_summaries.content} &@~ ${options.query}`,
            distance.text,
          ),
        ),
      ),
  );

  const candidates = db.$with("sq_results").as(
    db
      .selectDistinctOn([precandidates.id], {
        id: precandidates.id,
        name: precandidates.name,
        version: precandidates.version,
        /**
         * TODO: combine PGroona score and cosine distance
         */
        score: cosineDistance(precandidates, queryVector),
      })
      .from(precandidates)
      .innerJoin(
        title_chunks,
        and(
          eq(precandidates.id, title_chunks.id),
          eq(precandidates.version, title_chunks.version),
        ),
      )
      .where(
        or(
          lte(
            cosineDistance(title_chunks.embedding, queryVector),
            distance.semantic,
          ),
          lte(sql`${title_chunks.content} &@~ ${textQuery}`, distance.text),
        ),
      )
      .orderBy((t) => [t.id, desc(t.score)]),
  );

  const resutls = await db
    .with(precandidates, candidates)
    .select()
    .from(candidates)
    .orderBy(desc(candidates.score))
    .limit(25);

  return resutls;
}
