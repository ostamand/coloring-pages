import styles from "./search-for-pages.styles.module.scss";

import { Metadata } from "next";

import SearchResults from "@/components/search-results/search-results.component";
import { Page } from "@/lib/api/types";

const title = "Browse Free Coloring Pages | Color It Daily";
const url = "https://coloritdaily.com/pages";
const description =
    "Explore a wide collection of free coloring pages. Search by theme, discover new designs, and download your favorites. Unleash your creativity today!";
export const metadata: Metadata = {
    title,
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

async function getPages(searchValue: string | null) {
    //! revisit limits, add pagination?
    try {
        let response: Response | null = null;

        if (searchValue) {
            response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages?search=${searchValue}`,
                {
                    next: {
                        revalidate: 60 * 60 * 12,
                        tags: ["pages", `page-search-${searchValue}`],
                    },
                }
            );
        } else {
            response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true&limit=100`,
                {
                    next: {
                        revalidate: 60 * 60 * 24,
                        tags: ["pages", "page-search-random"],
                    },
                }
            );
        }

        if (response) {
            const data = await response.json();
            const pages = data as Page[];
            return pages;
        }
        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function SearchForPages({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchValue = (await searchParams)["search"] as string | undefined;

    const pages = await getPages(searchValue || null);

    return (
        <>
            <div className={styles.searchContainer}>
                <SearchResults
                    initialResults={pages}
                    initialSearchValue={searchValue || null}
                />
            </div>
        </>
    );
}
