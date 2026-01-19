/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictInput } from './PredictInput';
import type { TruncationDirection } from './TruncationDirection';
export type PredictRequest = {
    inputs: PredictInput;
    raw_scores?: boolean;
    truncate?: boolean | null;
    truncation_direction?: TruncationDirection;
};

