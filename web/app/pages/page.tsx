import styles from "./search-for-pages.styles.module.scss";

import SearchResults from "@/components/search-results/search-results.component";
import { Page } from "@/lib/api/types";

async function getPages(searchValue: string | null) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true&limit=6`
        );
        const data = await response.json();
        const pages = data as Page[];
        return pages;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function SearchForPages({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const searchValue = (await searchParams)["search"] || null;

    const pages = await getPages(searchValue);

    return (
        <div className={styles.searchContainer}>
            <SearchResults
                initialResults={pages}
                initialSearchValue={searchValue}
            />
        </div>
    );
}
