/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TruncationDirection } from './TruncationDirection';
export type RerankRequest = {
    query: string;
    raw_scores?: boolean;
    return_text?: boolean;
    texts: Array<string>;
    truncate?: boolean | null;
    truncation_direction?: TruncationDirection;
};

