export type GeminiConfigs = {
    key: string;
    url?: string;
};

export type GeminiGenerateConfigs = GeminiConfigs & {
    model:
        | "gemini-2.0-flash"
        | "gemini-2.5-pro-exp-03-25"
        | "gemini-2.5-pro-preview-05-06"
        | "gemini-2.5-flash-preview-04-17";
};

type GeminiEmbeddingTask =
    | "SEMANTIC_SIMILARITY"
    | "CLASSIFICATION"
    | "CLUSTERING"
    | "RETRIEVAL_DOCUMENT"
    | "RETRIEVAL_QUERY"
    | "QUESTION_ANSWERING"
    | "FACT_VERIFICATION"
    | "CODE_RETRIEVAL_QUERY";

export type GeminiEmbeddingConfigs = GeminiConfigs & {
    model: "gemini-embedding-exp-03-07";
    task: GeminiEmbeddingTask;
};

export type GeminiEmbedContentPayload = {
    model: string;
    content: {
        parts: {
            text: string;
        }[];
    };
    taskType?: GeminiEmbeddingTask;
};

export type GeminiGenerateContentPayload = {
    system_instruction?: {
        parts: {
            text: string;
        }[];
    };
    contents: {
        parts: {
            text: string;
        }[];
    }[];
};

export type CandidateResponse = {
    content: {
        parts: {
            text: string;
        }[];
        role: string;
    };
    finishReason: string;
    avgLogprobs: number;
};
