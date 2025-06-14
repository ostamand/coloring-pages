import { NextRequest, NextResponse } from "next/server";

import { Collection, Page } from "@/lib/api/types";

export const revalidate = 86400;

type SiteData = {
    path: string;
    freq: "daily" | "weekly" | "monthly" | "yearly";
    priority: number;
};

export async function GET(req: NextRequest) {
    const { protocol, host } = new URL(req.url);
    const baseUrl = `${protocol}//${host}`;

    const staticPages: SiteData[] = [
        { path: "/", freq: "daily", priority: 1.0 },
        { path: "/contact", freq: "monthly", priority: 0.8 },
        { path: "/about", freq: "monthly", priority: 0.8 },
        { path: "/pages", freq: "daily", priority: 0.9 },
    ];

    // get dynamic pages
    //! review to remove limit

    let dynamicPages: SiteData[] = [];

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages?limit=10000`,
        {
            next: {
                revalidate: 60 * 60 * 24,
                tags: ["pages"],
            },
        },
    );

    if (response.ok) {
        const data = await response.json();
        const pages = data as Page[];

        dynamicPages = pages.map((page) => {
            const siteData: SiteData = {
                path: `/pages/${page.unique_name}`,
                freq: "monthly",
                priority: 0.7,
            };
            return siteData;
        });
    }

    // collections

    let collectionPages: SiteData[] = [];

    const responseCollections = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/collections`,
        {
            next: {
                revalidate: 60 * 60 * 24,
                tags: ["pages", "collections"],
            },
        },
    );

    if (responseCollections.ok) {
        const data = await responseCollections.json();
        const collections = data as Collection[];

        collectionPages = collections.map((collection) => {
            const sideData: SiteData = {
                path: `/collections/${collection.name}`,
                freq: "daily",
                priority: 0.9,
            };
            return sideData;
        });
    }

    // join everything

    const allPages = [...staticPages, ...dynamicPages, ...collectionPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${
        allPages.map((page) => {
            return `
            <url>
                <loc>${baseUrl}${page.path}</loc>
                <changefreq>${page.freq}</changefreq>
                <priority>${page.priority}</priority>
            </url>
        `;
        }).join("")
    }
    </urlset>
    `;

    return new NextResponse(sitemap, {
        headers: { "Content-Type": "application/xml" },
    });
}
