export type GenerationConfigs = {
    coloringImagePath: string | null;
    generateScript: string;
    generatedOn: string | null;
    prompt: string;
    seed: number | null;
    collectionName: string;
    tags: string[];
    modelName: string;
    promptModelName: string;
    name: string;
    height: number;
    width: number;
};

export type AppConfigs = {
    db: {
        name: string;
        port: number;
        user: string;
        password: string;
        hostname: string;
        poolSize: number;
    };
    s3: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
    cloudfrontUrl: string;
    geminiApiKey: string;
    comfyServerAddress: string;
    comfyApiEndpoint: string;
    comfyOutputDir: string;
};
