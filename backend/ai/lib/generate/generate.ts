import { join } from "jsr:@std/path";

import { getDatabaseClient } from "../../../lib/db/db.ts";
import { loadAppConfigs } from "../../../lib/configs.ts";
import { getRandomString } from "../../../lib/helpers.ts";
import { getGenerationConfigsFromGemini } from "./gemini.ts";
import { runGenerations } from "../generate/comfy.ts";
import { GenerationConfigsFromGemini } from "./gemini.ts";

export async function runGenerate(
    instructions: string,
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
        const db = getDatabaseClient(configs);
        // get generation configs
        let generationConfigs = null;
        try {
            generationConfigs = await getGenerationConfigsFromGemini(
                db,
                instructions,
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
            db.end();
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
