/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SimilarityInput = {
    /**
     * A list of strings which will be compared against the source_sentence.
     */
    sentences: Array<string>;
    /**
     * The string that you wish to compare the other strings with. This can be a phrase, sentence,
     * or longer passage, depending on the model being used.
     */
    source_sentence: string;
};

