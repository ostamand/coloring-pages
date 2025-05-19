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

    await runGenerate(
        SYSTEM_INSTRUCTIONS_v1,
        generateConfig.worflowPath,
        (workflow, prompt, seed, outputPrefix) => {
            workflow["250"]["inputs"]["value"] = seed;
            workflow["11"]["inputs"]["text"] =
                `${generateConfig.trigger}, ${prompt}`;
            workflow["251"]["inputs"]["value"] = outputPrefix;
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
// example: deno run --allow-all ai/run-sdxl-v1.ts --config ai/configs/sdxl-v1.json --out tmp/VZmYUK27Z0Fj --gen-file tmp/VZmYUK27Z0Fj/VZmYUK27Z0Fj.json
if (import.meta.main) {
    await main(Deno.args);
}
