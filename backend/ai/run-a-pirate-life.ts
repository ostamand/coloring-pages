import { runGenerate } from "./lib/generate/generate.ts";

import { SYSTEM_INSTRUCTIONS_PIRATE_LIFE } from "./instructions/flux.ts";
import { loadGenerateConfigs } from "./lib/generate/configs.ts";
import { parseArgs } from "./lib/generate/configs.ts";
import { GenerationConfigs } from "../lib/types.ts";

async function main(args: string[]) {
    const { outputFolder, inputConfigPath, genFile } = parseArgs(args);

    if (!inputConfigPath || !outputFolder) {
        return;
    }

    const generateConfig = loadGenerateConfigs(inputConfigPath);

    // get last prompts from output folder

    const jsonFiles: string[] = [];
    for await (const dirEntry of Deno.readDir(outputFolder)) {
        if (dirEntry.isDirectory) {
            const subfolder = `${outputFolder}/${dirEntry.name}`;
            for await (const fileEntry of Deno.readDir(subfolder)) {
                if (fileEntry.isFile && fileEntry.name.endsWith(".json")) {
                    jsonFiles.push(`${subfolder}/${fileEntry.name}`);
                }
            }
        }
    }

    const lastPromptsFromOutputFolder: string[] = [];
    for (const filePath of jsonFiles) {
        try {
            const data = JSON.parse(
                Deno.readTextFileSync(filePath),
            ) as GenerationConfigs;
            if (data && data.prompt) {
                if (!lastPromptsFromOutputFolder.includes(data.prompt)) {
                    lastPromptsFromOutputFolder.push(data.prompt);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const instructionsFn = (lastPrompts: string) => {
        const instructions = SYSTEM_INSTRUCTIONS_PIRATE_LIFE + lastPrompts +
            lastPromptsFromOutputFolder.join("\n");
        return instructions;
    };

    await runGenerate(
        instructionsFn,
        generateConfig.worflowPath,
        (workflow, prompt, seed, outputPrefix) => {
            workflow["14"]["inputs"]["seed"] = seed;
            workflow["11"]["inputs"]["text"] =
                `${generateConfig.trigger}, ${prompt}`;
            workflow["249"]["inputs"]["filename_prefix"] = outputPrefix;
            return workflow;
        },
        generateConfig.numberOfGenerations,
        outputFolder,
        {
            ...generateConfig,
        },
        genFile,
    );
}

// --out: output folder for generations
// --config: path to config input path
// example: deno run --allow-all ai/run-a-pirate-life.ts --config ai/configs/a-pirate-life.json --out tmp/a-pirate-life
// deno run --allow-all ai/run-a-pirate-life.ts --config ai/configs/a-pirate-life.json --out tmp/a-pirate-life/v66anw3baagY --gen-file tmp/a-pirate-life/v66anw3baagY/v66anw3baagY.json
if (import.meta.main) {
    await main(Deno.args);
}
