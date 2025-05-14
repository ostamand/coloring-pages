"use server";

import styles from "../pages.styles.module.scss";

import Image from "next/image";

import { Page } from "@/lib/api/types";

export async function generateStaticParams() {
    const endpoint = `${process.env.API_URL}/pages?limit=10`;
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
        const response = await fetch(`${process.env.API_URL}/pages/${id}`);
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
            <div className={styles.content}>
                <div className={styles.leftSection}></div>
                <div className={styles.rightSection}>
                    <Image
                        src={page.coloring_path}
                        alt="Coloring Pages Logo"
                        width={500}
                        height={750}
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}
