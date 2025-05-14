import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL("https://d28enhend29azq.cloudfront.net/**"),
            new URL("https://placehold.co/**"),
        ],
    },
};

export default nextConfig;
