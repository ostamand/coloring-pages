import { runGenerate } from "./lib/generate/generate.ts";

import { SYSTEM_INSTRUCTIONS_PIRATE_LIFE } from "./instructions/flux.ts";
import { loadGenerateConfigs } from "./lib/generate/configs.ts";
import { parseArgs } from "./lib/generate/configs.ts";

async function main(args: string[]) {
    const { outputFolder, inputConfigPath, genFile } = parseArgs(args);

    if (!inputConfigPath || !outputFolder) {
        return;
    }

    const generateConfig = loadGenerateConfigs(inputConfigPath);

    const instructionsFn = (lastPrompts: string) => {
        console.log(SYSTEM_INSTRUCTIONS_PIRATE_LIFE + lastPrompts);
        return SYSTEM_INSTRUCTIONS_PIRATE_LIFE + lastPrompts;
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
// deno run --allow-all ai/run-a-pirate-life.ts --config ai/configs/a-pirate-life.json --out tmp/a-pirate-life/m4kcFuN7I7W0 --gen-file tmp/a-pirate-life/m4kcFuN7I7W0/m4kcFuN7I7W0.json
if (import.meta.main) {
    await main(Deno.args);
}
