import { loadAppConfigs } from "../lib/configs.ts";

const WEB_URL = "https://coloritdaily.com";

async function main() {
    const configs = loadAppConfigs();

    // invalidate web cache

    const response = await fetch(`${WEB_URL}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: configs.revalidateSecret }),
    });

    if (!response.ok) {
        console.error(`❌ Failed to invalidate cache.`);
        return;
    }

    console.log(`✅ Web cache invalidated`);
}

if (import.meta.main) {
    main();
}
