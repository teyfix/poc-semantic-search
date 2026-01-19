/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EncodingFormat } from './EncodingFormat';
import type { Input } from './Input';
export type OpenAICompatRequest = {
    dimensions?: number | null;
    encoding_format?: EncodingFormat;
    input: Input;
    model?: string | null;
    user?: string | null;
};

