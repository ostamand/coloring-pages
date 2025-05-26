import styles from "./search-for-pages.styles.module.scss";

import { Metadata } from "next";
import { unstable_cache } from "next/cache";

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
        let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true&limit=100`;
        if (searchValue) {
            endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?search=${searchValue}`;
        }
        const response = await fetch(endpoint);
        const data = await response.json();
        const pages = data as Page[];
        return pages;
    } catch (error) {
        console.error(error);
        return [];
    }
}

const getCachedRandomPages = unstable_cache(
    async () => {
        console.log("server, get pages");
        const pages = await getPages(null);
        return pages;
    },
    ["random-pages-of-the-day"],
    {
        tags: ["pages", "random-pages-of-the-day"],
        revalidate: 24 * 60 * 60,
    }
);

export default async function SearchForPages({
    searchParams,
}: {
    searchParams: Promise<any>;
}) {
    const searchValue = (await searchParams)["search"] as string | undefined;

    let pages: Page[] = [];
    if (!searchValue) {
        pages = await getCachedRandomPages();
    } else {
        pages = await getPages(searchValue);
    }

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
