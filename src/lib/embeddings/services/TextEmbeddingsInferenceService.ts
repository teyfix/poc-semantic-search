/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DecodeRequest } from '../models/DecodeRequest';
import type { DecodeResponse } from '../models/DecodeResponse';
import type { EmbedAllRequest } from '../models/EmbedAllRequest';
import type { EmbedAllResponse } from '../models/EmbedAllResponse';
import type { EmbedRequest } from '../models/EmbedRequest';
import type { EmbedResponse } from '../models/EmbedResponse';
import type { EmbedSparseRequest } from '../models/EmbedSparseRequest';
import type { EmbedSparseResponse } from '../models/EmbedSparseResponse';
import type { Info } from '../models/Info';
import type { OpenAICompatRequest } from '../models/OpenAICompatRequest';
import type { OpenAICompatResponse } from '../models/OpenAICompatResponse';
import type { PredictRequest } from '../models/PredictRequest';
import type { PredictResponse } from '../models/PredictResponse';
import type { RerankRequest } from '../models/RerankRequest';
import type { RerankResponse } from '../models/RerankResponse';
import type { SimilarityRequest } from '../models/SimilarityRequest';
import type { SimilarityResponse } from '../models/SimilarityResponse';
import type { TokenizeRequest } from '../models/TokenizeRequest';
import type { TokenizeResponse } from '../models/TokenizeResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TextEmbeddingsInferenceService {
    /**
     * Decode input ids
     * @returns DecodeResponse Decoded ids
     * @throws ApiError
     */
    public static decode({
        requestBody,
    }: {
        requestBody: DecodeRequest,
    }): CancelablePromise<DecodeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/decode',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
            },
        });
    }
    /**
     * Get Embeddings. Returns a 424 status code if the model is not an embedding model.
     * @returns EmbedResponse Embeddings
     * @throws ApiError
     */
    public static embed({
        requestBody,
    }: {
        requestBody: EmbedRequest,
    }): CancelablePromise<EmbedResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/embed',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Embedding Error`,
                429: `Model is overloaded`,
            },
        });
    }
    /**
     * Get all Embeddings without Pooling.
     * Returns a 424 status code if the model is not an embedding model.
     * @returns EmbedAllResponse Embeddings
     * @throws ApiError
     */
    public static embedAll({
        requestBody,
    }: {
        requestBody: EmbedAllRequest,
    }): CancelablePromise<EmbedAllResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/embed_all',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Embedding Error`,
                429: `Model is overloaded`,
            },
        });
    }
    /**
     * Get Sparse Embeddings. Returns a 424 status code if the model is not an embedding model with SPLADE pooling.
     * @returns EmbedSparseResponse Embeddings
     * @throws ApiError
     */
    public static embedSparse({
        requestBody,
    }: {
        requestBody: EmbedSparseRequest,
    }): CancelablePromise<EmbedSparseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/embed_sparse',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Embedding Error`,
                429: `Model is overloaded`,
            },
        });
    }
    /**
     * Health check method
     * @returns any Everything is working fine
     * @throws ApiError
     */
    public static health(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
            errors: {
                503: `Text embeddings Inference is down`,
            },
        });
    }
    /**
     * Text Embeddings Inference endpoint info
     * @returns Info Served model info
     * @throws ApiError
     */
    public static getModelInfo(): CancelablePromise<Info> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/info',
        });
    }
    /**
     * Prometheus metrics scrape endpoint
     * @returns string Prometheus Metrics
     * @throws ApiError
     */
    public static metrics(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/metrics',
        });
    }
    /**
     * Get Predictions. Returns a 424 status code if the model is not a Sequence Classification model
     * @returns PredictResponse Predictions
     * @throws ApiError
     */
    public static predict({
        requestBody,
    }: {
        requestBody: PredictRequest,
    }): CancelablePromise<PredictResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/predict',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Prediction Error`,
                429: `Model is overloaded`,
            },
        });
    }
    /**
     * Get Ranks. Returns a 424 status code if the model is not a Sequence Classification model with
     * a single class.
     * @returns RerankResponse Ranks
     * @throws ApiError
     */
    public static rerank({
        requestBody,
    }: {
        requestBody: RerankRequest,
    }): CancelablePromise<RerankResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rerank',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Rerank Error`,
                429: `Model is overloaded`,
            },
        });
    }
    /**
     * Get Sentence Similarity. Returns a 424 status code if the model is not an embedding model.
     * @returns SimilarityResponse Sentence Similarity
     * @throws ApiError
     */
    public static similarity({
        requestBody,
    }: {
        requestBody: SimilarityRequest,
    }): CancelablePromise<SimilarityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/similarity',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Embedding Error`,
                429: `Model is overloaded`,
            },
        });
    }
    /**
     * Tokenize inputs
     * @returns TokenizeResponse Tokenized ids
     * @throws ApiError
     */
    public static tokenize({
        requestBody,
    }: {
        requestBody: TokenizeRequest,
    }): CancelablePromise<TokenizeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tokenize',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
            },
        });
    }
    /**
     * OpenAI compatible route. Returns a 424 status code if the model is not an embedding model.
     * @returns OpenAICompatResponse Embeddings
     * @throws ApiError
     */
    public static openaiEmbed({
        requestBody,
    }: {
        requestBody: OpenAICompatRequest,
    }): CancelablePromise<OpenAICompatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/embeddings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Batch is empty`,
                413: `Batch size error`,
                422: `Tokenization error`,
                424: `Embedding Error`,
                429: `Model is overloaded`,
            },
        });
    }
}
