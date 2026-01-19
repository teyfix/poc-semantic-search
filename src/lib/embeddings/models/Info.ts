/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ModelType } from './ModelType';
export type Info = {
    auto_truncate: boolean;
    docker_label?: string | null;
    max_batch_requests?: number | null;
    max_batch_tokens: number;
    max_client_batch_size: number;
    /**
     * Router Parameters
     */
    max_concurrent_requests: number;
    max_input_length: number;
    model_dtype: string;
    /**
     * Model info
     */
    model_id: string;
    model_sha?: string | null;
    model_type: ModelType;
    sha?: string | null;
    tokenization_workers: number;
    /**
     * Router Info
     */
    version: string;
};

