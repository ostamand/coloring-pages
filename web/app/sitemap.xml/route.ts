import { NextRequest, NextResponse } from "next/server";

import { Page } from "@/lib/api/types";

//! change to: await res.revalidate("/sitemap.xml");
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

    const allPages = [...staticPages, ...dynamicPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${
        allPages.map((page) => {
            return `
            <url>
                <loc>${baseUrl}${page.path}</loc>
                <changefreq>${page.freq}</changefreq>
                <changefreq>${page.priority}</changefreq>
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
