"use server";

import styles from "./detailed-page.styles.module.scss";

import Link from "next/link";

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

async function getPage(id: string) {
    let page: Page | null = null;
    // get page
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages/${id}`
        );
        if (!response.ok) {
            throw new Error(`Could not get page id ${id} from API.`);
        }
        const data = await response.json();
        page = data as Page;
        if (!page) {
            throw new Error(`Failed to get page id ${id} data.`);
        }
        return page;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function generateStaticParams() {
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
                id: page.id.toFixed(0),
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
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const page = await getPage(id);

    const name =
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

    const url = `https://coloritdaily.com/pages/${id}`;

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
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const page = await getPage(id);
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
                            {page.name && <h1>{page.name}</h1>}

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
                            <div className={styles.labelWithContent}>
                                <h2>Featured On</h2>
                                <p>
                                    {new Date(
                                        page.featured_on || ""
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
