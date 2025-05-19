import { join } from "jsr:@std/path";

import { loadAppConfigs } from "../../../lib/configs.ts";
import { connectToWebSocket, waitForPrompt } from "../../../lib/comfy/comfy.ts";
import { convertPngToJpeg } from "../../../lib/helpers.ts";

export async function runGenerations(
    workflowPath: string,
    updateWorkflowFn: (
        workflow: any,
        prompt: string,
        seed: number,
        outputPrefix: string,
    ) => any,
    options: {
        pathGenerationConfigs: string;
        outputFolder: string;
        numberOfGenerations: number;
    },
) {
    await Deno.mkdir(join(options.outputFolder), {
        recursive: true,
    });

    const configs = loadAppConfigs();
    const generationFile = await Deno.readTextFile(
        options.pathGenerationConfigs,
    );
    const generationTemplate = JSON.parse(generationFile);
    const randomId = options.pathGenerationConfigs.split("/").pop()?.split(".")
        .shift();

    // load workflow
    let workflow = undefined;
    try {
        const workflowFile = await Deno.readTextFile(workflowPath);
        workflow = JSON.parse(workflowFile);
    } catch (error) {
        console.log("❌ Failed to read or parse workflow file:", error);
        return;
    }

    // start generating
    const ws = await connectToWebSocket(configs.comfyServerAddress);
    for (let i = 0; i < options.numberOfGenerations; i++) {
        try {
            const seed = Math.floor(Math.random() * 100000);
            const outputPrefix = `${randomId}-${seed}`;

            // update workflow
            workflow = updateWorkflowFn(
                workflow,
                generationTemplate.prompt,
                seed,
                outputPrefix,
            );

            // generate image
            console.log(
                `🎨 Generating ${
                    i + 1
                }/${options.numberOfGenerations}: ${outputPrefix}`,
            );

            await waitForPrompt(configs.comfyApiEndpoint, ws, workflow);
            // conver to jpg and save to output folder
            const outputImagePath = join(options.outputFolder, `${seed}.jpg`);
            await convertPngToJpeg(
                join(configs.comfyOutputDir, `${outputPrefix}_00001_.png`),
                outputImagePath,
            );
            // save generation configs
            const generationConfig = {
                ...generationTemplate,
                generatedOn: new Date().toISOString(),
                seed,
                coloringImagePath: await Deno.realPath(outputImagePath),
            };
            await Deno.writeTextFile(
                join(options.outputFolder, `${seed}.json`),
                JSON.stringify(generationConfig),
            );
        } catch (error) {
            console.error("❌ Generation failed", error);
        }
    }
    ws.close();
}
