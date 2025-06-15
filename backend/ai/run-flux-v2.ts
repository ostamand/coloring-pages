import { runGenerate } from "./lib/generate/generate.ts";

import { SYSTEM_INSTRUCTIONS_v1 } from "./instructions/sdxl.ts";
import { loadGenerateConfigs } from "./lib/generate/configs.ts";
import { parseArgs } from "./lib/generate/configs.ts";

async function main(args: string[]) {
    const { outputFolder, inputConfigPath, genFile } = parseArgs(args);

    if (!inputConfigPath || !outputFolder) {
        return;
    }

    const generateConfig = loadGenerateConfigs(inputConfigPath);

    const instructionsFn = (lastPrompts: string) => {
        return SYSTEM_INSTRUCTIONS_v1 + lastPrompts;
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
// --gen-file: (optional) generate from a template config file
// example: deno run --allow-all ai/run-flux-v2.ts --config ai/configs/flux-v3.json --out tmp/hN3nDy1Sb5dB/v3 --gen-file tmp/hN3nDy1Sb5dB/hN3nDy1Sb5dB.json
// example: deno run --allow-all ai/run-flux-v2.ts --config ai/configs/flux-v3.json --out tmp
if (import.meta.main) {
    await main(Deno.args);
}
