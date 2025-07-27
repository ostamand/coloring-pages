import { runGenerate } from "./lib/generate/generate.ts";

import { SYSTEM_INSTRUCTIONS_SUBJECT_v1 } from "./instructions/flux.ts";
import { loadGenerateConfigs } from "./lib/generate/configs.ts";
import { parseArgs } from "./lib/generate/configs.ts";

async function main(args: string[]) {
    const { outputFolder, inputConfigPath, genFile, subject } = parseArgs(args);
    if (!subject) {
        console.log("Subject is required (--subject).");
        return;
    }

    if (!inputConfigPath || !outputFolder) {
        return;
    }

    const generateConfig = loadGenerateConfigs(inputConfigPath);
    const scriptName = import.meta.url.split("/").pop();
    generateConfig.generateScript = scriptName || generateConfig.generateScript;

    const instructionsFn = (lastPrompts: string) => {
        return SYSTEM_INSTRUCTIONS_SUBJECT_v1 + subject;
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
// --subject: subject of the coloring page
// --gen-file: (optional) generate from a template config file
// example: deno run --allow-all ai/run-flux-subject-v1.ts --config ai/configs/flux-v3.json --out tmp --subject 'a penguin'
if (import.meta.main) {
    await main(Deno.args);
}
