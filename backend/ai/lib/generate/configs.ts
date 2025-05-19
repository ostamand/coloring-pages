import { GeminiGenerateModels } from "../../../lib/gemini/types.ts";

export type GenerateConfigs = {
    numberOfGenerations: number;
    worflowPath: string;
    geminiModelName: GeminiGenerateModels;
    generateScript: string;
    collectionName: string;
    modelName: string;
    trigger: string;
    height: number;
    width: number;
};

export function loadGenerateConfigs(filePath: string) {
    return JSON.parse(Deno.readTextFileSync(filePath)) as GenerateConfigs;
}

export function parseArgs(args: string[]) {
    const outputIndex = args.indexOf("--out");
    const outputFolder = outputIndex !== -1 ? args[outputIndex + 1] : undefined;
    if (!outputFolder) {
        console.log("Output folder is required (--out).");
        return {};
    }

    const inputConfigIndex = args.indexOf("--config");
    const inputConfigPath = inputConfigIndex !== -1
        ? args[inputConfigIndex + 1]
        : undefined;
    if (!inputConfigPath) {
        console.log("Config file path is required (--config).");
        return {};
    }

    const genfileIndex = args.indexOf("--gen-file");
    const genFile = genfileIndex !== -1 ? args[genfileIndex + 1] : undefined;

    const subjectIndex = args.indexOf("--subject");
    const subject = subjectIndex !== -1 ? args[subjectIndex + 1] : undefined;

    return { inputConfigPath, outputFolder, genFile, subject };
}
