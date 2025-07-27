"use server";

import styles from "./detailed-page.styles.module.scss";

import Link from "next/link";
import { cache } from "react";
import { redirect } from "next/navigation";

import { Page } from "@/lib/api/types";
import DetailedContent from "./detailed-content/detailed-content.components";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const getPage = cache(async (uniqueName: string) => {
    let page: Page | null = null;
    // get page
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages/${uniqueName}`,
            {
                next: {
                    revalidate: 60 * 60 * 24,
                    tags: ["pages", `page-${uniqueName}`],
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Could not get page id ${uniqueName} from API.`);
        }
        const data = await response.json();
        page = data as Page;
        if (!page) {
            throw new Error(`Failed to get page id ${uniqueName} data.`);
        }
        return page;
    } catch (error) {
        console.error(error);
        return null;
    }
});

export async function generateStaticParams() {
    // TODO be smarter, cache featured + promoted + random sample of the day
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?limit=10`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("Could not get pages");
        }
        const data = await response.json();
        const pages = data as Page[];
        return pages.map((page) => {
            return {
                uniqueName: page.unique_name,
            };
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ uniqueName: string }>;
}) {
    const { uniqueName } = await params;

    const page = await getPage(uniqueName);

    const name =
        page?.overwrite_name ||
        page?.name ||
        page?.tags.reduce((agg, tag, index) => {
            if (index > 0) {
                agg += ", ";
            }
            return agg + tag[0].toUpperCase() + tag.slice(1);
        }, "") ||
        "";

    const title = `${name} | Free Coloring Page | Color It Daily`;

    const description = `Download the free coloring page "${name}" and start coloring today. Perfect for all ages!`;

    const url = `https://coloritdaily.com/pages/${uniqueName}`;

    return {
        title: title,
        description,
        openGraph: {
            title,
            description,
            url,
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function DetailedPage({
    params,
}: {
    params: Promise<{ uniqueName: string }>;
}) {
    const { uniqueName } = await params;

    const page = await getPage(uniqueName);

    if (!page) {
        redirect("/not-found");
    }

    return (
        <>
            <div className={styles.detailedContainer}>
                <div className={styles.breadCrumbContent}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <p>Collections</p>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link
                                    href={`/collections/${page.upd_collection_name}`}
                                >
                                    {page.collection_name}
                                </Link>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className={styles.centerContainer}>
                    <DetailedContent page={page} />
                </div>
            </div>
        </>
    );
}
