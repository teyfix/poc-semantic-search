import Groq from "groq-sdk";
import { Config } from "@/config";

const groq = new Groq({ apiKey: Config.GROQ_API_KEY });

const systemPrompt = `
You are an expert investigator on understanding user intents. 
Your task is to improve a search query given by a user by adding more context, synonyms, and relevant concepts to help a vector search engine find the best results.

Rules:
1. Maintain the original intent.
2. Add temporal context if the query is time-sensitive.
3. Output ONLY the improved query string. No explanations.
`;

export async function improveQuery(options: {
  query: string;
}): Promise<string> {
  const isotime = new Date().toISOString();

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: systemPrompt },
      ],
      model: Config.COMPLETION_MODEL, // Using your llama-3.3-70b-versatile
      temperature: 0.2, // Low temperature for consistent search expansion
      max_tokens: 100,
    });

    const improvedQuery = chatCompletion.choices[0]?.message?.content?.trim();

    // Fallback to original query if LLM fails or returns empty
    return improvedQuery || options.query;
  } catch (error) {
    console.error("Failed to improve query:", error);
    return options.query;
  }
}
