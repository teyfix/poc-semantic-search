import { TextEmbeddingsInferenceService } from "@/lib/embeddings";

type Text = string;
type Vector = number[];

type SingleOptions = {
  input: Text;
};

type MultipleOptions = {
  input: Text[];
};

export async function generateEmbeddings(
  options: SingleOptions,
): Promise<Vector>;
export async function generateEmbeddings(
  options: MultipleOptions,
): Promise<Vector[]>;
export async function generateEmbeddings(
  options: SingleOptions | MultipleOptions,
): Promise<Vector | Vector[]> {
  const inputs = options.input;
  const vectors = await TextEmbeddingsInferenceService.embed({
    requestBody: {
      inputs,
    },
  });

  if (typeof inputs === "string") {
    if (vectors[0] == null) {
      throw new Error("Failed to generate embeddings");
    }

    return vectors[0];
  }

  return vectors;
}
