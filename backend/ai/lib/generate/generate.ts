import { join } from "jsr:@std/path";

import { getClientFromPool, setupDatabasePool } from "../../../lib/db/mod.ts";
import { loadAppConfigs } from "../../../lib/configs.ts";
import { getRandomString } from "../../../lib/helpers.ts";
import { getGenerationConfigsFromGemini } from "./gemini.ts";
import { runGenerations } from "../generate/comfy.ts";
import { GenerationConfigsFromGemini } from "./gemini.ts";

export async function runGenerate(
    instructionsFn: (lastPrompts: string) => string,
    workflowPath: string,
    worflowUpdateFn: (
        workflow: any,
        prompt: string,
        seed: number,
        outputPrefix: string,
    ) => any,
    numberOfGenerations: number,
    outputFolder: string,
    geminiGenerateConfigs: GenerationConfigsFromGemini,
    genFile?: string,
) {
    const configs = loadAppConfigs();
    setupDatabasePool(configs);

    // paths for gemini generatins
    const randomId = getRandomString();
    const generationOutputFolder = join(outputFolder, randomId);
    const generationConfigPath = join(
        generationOutputFolder,
        `${randomId}.json`,
    );
    // generate new generation template if needed
    if (!genFile) {
        // Ensure the output folder exists
        await Deno.mkdir(join(outputFolder, randomId), {
            recursive: true,
        });
        const db = await getClientFromPool();
        // get generation configs
        let generationConfigs = null;
        try {
            generationConfigs = await getGenerationConfigsFromGemini(
                db,
                instructionsFn,
                configs,
                geminiGenerateConfigs,
            );
            Deno.writeTextFile(
                generationConfigPath,
                JSON.stringify(generationConfigs),
            );
        } catch (error) {
            console.error(error);
            return;
        } finally {
            await db.release();
        }
    }
    // generate images from generation template

    await runGenerations(
        workflowPath,
        worflowUpdateFn,
        {
            numberOfGenerations: numberOfGenerations,
            outputFolder: genFile ? outputFolder : generationOutputFolder,
            pathGenerationConfigs: genFile || generationConfigPath,
        },
    );
}