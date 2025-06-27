import { AppConfigs } from "../../../lib/types.ts";
import { Client } from "@db/postgres";

import { getLastPrompts } from "../../../lib/db/page.ts";
import { GenerationConfigs } from "../../../lib/types.ts";
import { generateContent } from "../../../lib/gemini/mod.ts";
import { GeminiGenerateModels } from "../../../lib/gemini/types.ts";

export type GenerationConfigsFromGemini = {
    geminiModelName: GeminiGenerateModels;
    generateScript: string;
    collectionName: string;
    modelName: string;
    height: number;
    width: number;
};

export async function getGenerationConfigsFromGemini(
    db: Client,
    instructionsFn: (lastPrompts: string) => string,
    configs: AppConfigs,
    options: GenerationConfigsFromGemini,
) {
    // generate gemini prompt
    const lastPromptsData = await getLastPrompts(
        db,
        25,
        options.collectionName,
    );
    const lastPrompts = lastPromptsData.reduce((agg, prompt, index) => {
        if (index > 0) {
            agg += "\n";
        }
        return agg += `- ${prompt}`;
    }, "");

    console.log(`⏳ Last prompts:\n${lastPrompts}`);

    let geminiPrompt = instructionsFn(lastPrompts as string);
    geminiPrompt = geminiPrompt.split("\n").map((
        s,
    ) => s.trim()).join("\n");

    console.log("\nInstructions:");
    console.log(geminiPrompt);

    // call gemini
    console.log(`🤓 Calling Gemini (${options.geminiModelName})...`);
    const { text } = await generateContent(geminiPrompt, {
        key: configs.geminiApiKey,
        model: options.geminiModelName,
    });

    // remove json```
    const cleaned = text.replace(/```[a-z]*\n|```/g, "");

    type GeminiAnswer = {
        prompt: string;
        tags: string[];
        name: string;
    };

    // convert to json
    const geminiAnswer = JSON.parse(cleaned) as GeminiAnswer;
    console.log(`📄 Prompt: ${geminiAnswer.prompt}`);

    const generationConfigs: GenerationConfigs = {
        coloringImagePath: null,
        generateScript: options.generateScript,
        generatedOn: null,
        prompt: `${geminiAnswer.prompt}`,
        seed: null,
        collectionName: options.collectionName,
        tags: geminiAnswer.tags.map((tag) => tag.toLowerCase()),
        modelName: options.modelName,
        name: geminiAnswer.name,
        promptModelName: options.geminiModelName,
        height: options.height,
        width: options.width,
    };

    return generationConfigs;
}
