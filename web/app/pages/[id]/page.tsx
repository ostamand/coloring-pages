"use server";

import styles from "./detailed-page.styles.module.scss";
import tagStyles from "../../../styles/tag.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

import { Page } from "@/lib/api/types";
import DownloadButton from "@/components/download-button/download-button.components";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

export default async function DetailedPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let page: Page | null = null;

    // get page info
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
    } catch (error) {
        console.error(error);
        //! redirect to does not exist
        return <>DOES NOT EXIST</>;
    }

    return (
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
                            <Image
                                src={page.coloring_path}
                                alt="Coloring Pages Logo"
                                width={2550}
                                height={3300}
                            />
                        </div>
                    </div>
                    <div className={styles.rightSection}>
                        {page.name && <h1>{page.name}</h1>}

                        <DownloadButton
                            fileUrl={page.coloring_path}
                            name={page.name || "coloring-page"}
                            text="Download"
                        />
                        <div className={tagStyles.tagsContainer}>
                            {page.tags.map((tag, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={tagStyles.tagItem}
                                    >
                                        {tag}
                                    </div>
                                );
                            })}
                        </div>

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
    );
}
