/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OpenAICompatEmbedding } from './OpenAICompatEmbedding';
import type { OpenAICompatUsage } from './OpenAICompatUsage';
export type OpenAICompatResponse = {
    data: Array<OpenAICompatEmbedding>;
    model: string;
    object: string;
    usage: OpenAICompatUsage;
};

