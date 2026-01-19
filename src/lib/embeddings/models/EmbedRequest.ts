/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Input } from './Input';
import type { TruncationDirection } from './TruncationDirection';
export type EmbedRequest = {
    /**
     * The number of dimensions that the output embeddings should have. If not set, the original
     * shape of the representation will be returned instead.
     */
    dimensions?: number | null;
    inputs: Input;
    normalize?: boolean;
    /**
     * The name of the prompt that should be used by for encoding. If not set, no prompt
     * will be applied.
     *
     * Must be a key in the `sentence-transformers` configuration `prompts` dictionary.
     *
     * For example if ``prompt_name`` is "query" and the ``prompts`` is {"query": "query: ", ...},
     * then the sentence "What is the capital of France?" will be encoded as
     * "query: What is the capital of France?" because the prompt text will be prepended before
     * any text to encode.
     */
    prompt_name?: string | null;
    truncate?: boolean | null;
    truncation_direction?: TruncationDirection;
};

