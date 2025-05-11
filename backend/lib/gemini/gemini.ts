import {
    CandidateResponse,
    GeminiEmbedContentPayload,
    GeminiEmbeddingConfigs,
    GeminiGenerateConfigs,
    GeminiGenerateContentPayload,
} from "./types.ts";

const API_URL = "https://generativelanguage.googleapis.com/v1beta";

type FetchOptions = {
    headers: Headers;
    method: "POST";
    body?: string;
};

function getDefaultOptions(method: "POST"): FetchOptions {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return {
        headers,
        method,
    };
}

export async function generateEmbedding(
    text: string,
    configs: GeminiEmbeddingConfigs,
) {
    const options = getDefaultOptions("POST");

    const payload: GeminiEmbedContentPayload = {
        model: `models/${configs.model}`,
        content: {
            parts: [
                {
                    text,
                },
            ],
        },
        taskType: configs.task,
    };

    options.body = JSON.stringify(payload);

    const apiUrl = `${
        configs.url || API_URL
    }/models/${configs.model}:embedContent?key=${configs.key}`;

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
        throw new Error(
            `Got Status ${response.status}, fetch failed: ${apiUrl}`,
        );
    }

    const data = await response.json();

    return data.embedding.values;
}

export async function generateContent(
    prompt: string,
    configs: GeminiGenerateConfigs,
    systemInstruction?: string,
): Promise<{ candidate: CandidateResponse; text: string }> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const payload: GeminiGenerateContentPayload = {
        contents: [{
            parts: [
                {
                    text: prompt,
                },
            ],
        }],
    };

    if (systemInstruction) {
        payload.system_instruction = {
            parts: [
                {
                    text: systemInstruction,
                },
            ],
        };
    }

    const task = "generateContent";
    const apiUrl = `${
        configs.url || API_URL
    }/models/${configs.model}:${task}?key=${configs.key}`;

    const options = getDefaultOptions("POST");
    options.body = JSON.stringify(payload);

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
        throw new Error(`Fetch failed: ${apiUrl}`);
    }

    const data = await response.json();

    const candidates = data.candidates as CandidateResponse[];

    const candidateResponses = candidates.filter(
        (candidate: CandidateResponse) => {
            return candidate.finishReason === "STOP" &&
                candidate.content.role === "model";
        },
    );

    if (candidateResponses.length === 0) {
        throw new Error(`Model ${configs.model} provided no answers`);
    }

    const candidate = candidateResponses[0];

    return { candidate, text: candidate.content.parts[0].text };
}
