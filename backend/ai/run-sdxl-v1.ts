import { getDatabaseClient, getLastPrompts } from "../lib/db/mod.ts";
import { loadAppConfigs } from "../lib/configs.ts";
import { generateContent } from "../lib/gemini/mod.ts";
import { AppConfigs, GenerationConfigs } from "../lib/types.ts";
import { connectToWebSocket, waitForPrompt } from "../lib/comfy/comfy.ts";
import { convertPngToJpeg, getRandomString } from "../lib/helpers.ts";

import { join } from "jsr:@std/path";
import { Client } from "@db/postgres";

const NUMBER_OF_GENERATIONS = 10;
const WORKFLOW_PATH =
    "/mnt/o1sa/git/coloring-pages/backend/ai/workflows/workflow-sdxl.json";
const GEMINI_MODEL_NAME = "gemini-2.5-pro-exp-03-25";
const GENERATE_SCRIPT = "run-sdxl-v1.ts";
const COLLECTION_NAME = "kids";
const SYSTEM_INSTRUCTIONS = `
Generate a concise, imaginative text prompt for a Stable Diffusion model to create a kids' coloring page. The prompt should focus on the composition of the image, including characters, objects, and actions, without referencing the style. Aim for a design that is simple, engaging, suitable for young children, and ideal for coloring. 
Don't include too much content and details, the coloring page should include between zero to three characters and a maximum of two objects.

Also, provide between 1 and 5 single-word tags to classify the image content. These tags will be used for searching and organizing the coloring pages.

Format your response as plain JSON with the following structure:

{
  "prompt": "string",
  "tags": [string, ...]
}

- "prompt": A 1-2 sentence description of the coloring page's content.
- "tags": A list of 1-5 single-word tags summarizing the image.

When generating a new prompt, ensure it is significantly different from recent prompts by exploring new ideas, themes, or contexts. Below are the last 25 used prompts. Avoid repetition and ensure each idea is novel while keeping content appropriate for 6-year-old children:
`;

async function getGenerationConfigsFromGemini(configs: AppConfigs, db: Client) {
    // generate gemini prompt
    const lastPromptsData = await getLastPrompts(db, 25);

    const lastPrompts = lastPromptsData.reduce((agg, prompt, index) => {
        if (index > 0) {
            agg += "\n";
        }
        return agg += `${index + 1}. ${prompt}`;
    }, "");

    console.log(`⏳ Last prompts:\n${lastPrompts}`);

    const geminiPrompt = (SYSTEM_INSTRUCTIONS + lastPrompts).split("\n")
        .map((s) => s.trim()).join("\n");

    // call gemini
    console.log("🤓 Calling gemini...");
    const { text } = await generateContent(geminiPrompt, {
        key: configs.geminiApiKey,
        model: GEMINI_MODEL_NAME,
    });

    // remove json```
    const cleaned = text.replace(/```[a-z]*\n|```/g, "");

    // convert to json
    const geminiAnswer = JSON.parse(cleaned) as {
        prompt: string;
        tags: string[];
    };

    console.log(`📄 Prompt: ${geminiAnswer.prompt}`);

    const generationConfigs: GenerationConfigs = {
        coloringImagePath: null,
        generateScript: GENERATE_SCRIPT,
        generatedOn: null,
        prompt: `${geminiAnswer.prompt}`,
        seed: null,
        collectionName: COLLECTION_NAME,
        tags: geminiAnswer.tags.map((tag) => tag.toLowerCase()),
    };

    return generationConfigs;
}

async function runGenerations(
    pathGenerationConfigs: string,
    outputFolder: string,
    numberOfGenerations: number,
) {
    await Deno.mkdir(join(outputFolder), { recursive: true });

    const configs = loadAppConfigs();

    const generationFile = await Deno.readTextFile(pathGenerationConfigs);
    const generationTemplate = JSON.parse(generationFile) as GenerationConfigs;

    const randomId = pathGenerationConfigs.split("/").pop()?.split(".")
        .shift();

    // load workflow
    let workflow = undefined;
    try {
        const workflowFile = await Deno.readTextFile(WORKFLOW_PATH);
        workflow = JSON.parse(workflowFile);
    } catch (error) {
        console.log("❌ Failed to read or parse workflow file:", error);
        return;
    }

    // start generating
    const ws = await connectToWebSocket(configs.comfyServerAddress);

    for (let i = 0; i < numberOfGenerations; i++) {
        try {
            // update workflow
            const seed = Math.floor(Math.random() * 100000);
            workflow["250"]["inputs"]["value"] = seed;
            workflow["11"]["inputs"]["text"] =
                `coloring page, ${generationTemplate.prompt}`;

            const outputPrefix = `${randomId}-${seed}`;
            workflow["251"]["inputs"]["value"] = outputPrefix;

            // generate image
            console.log(
                `🎨 Generating ${
                    i + 1
                }/${numberOfGenerations}: ${outputPrefix}`,
            );
            await waitForPrompt(
                configs.comfyApiEndpoint,
                ws,
                workflow,
            );

            // conver to jpg and save to output folder
            const outputImagePath = join(outputFolder, `${seed}.jpg`);

            await convertPngToJpeg(
                join(configs.comfyOutputDir, `${outputPrefix}_00001_.png`),
                outputImagePath,
            );

            // save generation configs
            const generationConfig: GenerationConfigs = {
                ...generationTemplate,
                generatedOn: new Date().toISOString(),
                seed,
                coloringImagePath: await Deno.realPath(outputImagePath),
            };
            await Deno.writeTextFile(
                join(outputFolder, `${seed}.json`),
                JSON.stringify(generationConfig),
            );
        } catch (error) {
            console.error("❌ Generation failed", error);
        }
    }

    ws.close();
}

async function run(outputFolder: string, genFile?: string) {
    const configs = loadAppConfigs();

    // paths for gemini generatins
    const randomId = getRandomString();

    const generationOutputFolder = join(
        outputFolder,
        randomId,
    );

    const generationConfigPath = join(
        generationOutputFolder,
        `${randomId}.json`,
    );

    // generate new generation template if needed
    if (!genFile) {
        // Ensure the output folder exists
        await Deno.mkdir(join(outputFolder, randomId), { recursive: true });

        const db = getDatabaseClient(configs);

        // get generation configs
        let generationConfigs: GenerationConfigs | null = null;
        try {
            generationConfigs = await getGenerationConfigsFromGemini(
                configs,
                db,
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
        genFile || generationConfigPath,
        genFile ? outputFolder : generationOutputFolder,
        NUMBER_OF_GENERATIONS,
    );
}

function main(args: string[]) {
    const outputIndex = args.indexOf("--out");
    const outputFolder = outputIndex !== -1 ? args[outputIndex + 1] : undefined;
    if (!outputFolder) {
        console.log("Output folder is required (--out).");
        return;
    }

    const genfileIndex = args.indexOf("--gen-file");
    const genFile = genfileIndex !== -1 ? args[genfileIndex + 1] : undefined;

    run(outputFolder, genFile);
}

// 1. call gemini to get prompt, and tags
// 2. generate images using comfy and workflow
// 3. save images and json config in output folder
if (import.meta.main) {
    await main(Deno.args);
}
