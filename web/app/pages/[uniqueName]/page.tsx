"use server";

import styles from "./detailed-page.styles.module.scss";

import Link from "next/link";
import { cache } from "react";

import { Page } from "@/lib/api/types";
import DownloadButton from "@/components/download-button/download-button.components";
import PrintButton from "@/components/print-button/print-button.components";
import PageTags from "@/components/page-tags/page-tags.component";

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
    // TODO be smarter, cache featured + promoted + ranndom sample of the day
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?limit=10`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error("Could not get pages from API.");
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
        return <>DOES NOT EXIST</>;
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
                                <Link href="/pages">Pages</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <p>{page.collection_name}</p>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className={styles.centerContainer}>
                    <div className={styles.content}>
                        <div className={styles.leftSection}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={page.thumbnail_path}
                                    alt={page.prompt}
                                />
                            </div>
                        </div>
                        <div className={styles.rightSection}>
                            {page.name && (
                                <h1>{page.overwrite_name || page.name}</h1>
                            )}

                            <div className={styles.actionsPanel}>
                                <DownloadButton
                                    pageId={page.id}
                                    fileUrl={page.full_path}
                                    name={page.name || "coloring-page"}
                                    text="Download"
                                />
                                <PrintButton
                                    pageId={page.id}
                                    fileUrl={page.full_path}
                                />
                            </div>

                            <PageTags tags={page.tags} />

                            <div className={styles.promptContent}>
                                <h2>Description</h2>
                                <p>{page.prompt}</p>
                            </div>
                            <div className={styles.labelWithContent}>
                                <h2>Collection</h2>
                                <p>{page.collection_name}</p>
                            </div>
                            {page.featured_on && (
                                <div className={styles.labelWithContent}>
                                    <h2>Featured On</h2>
                                    <p>
                                        {new Date(
                                            page.featured_on || ""
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
