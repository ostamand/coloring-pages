import styles from "./search-for-pages.styles.module.scss";

import SearchResults from "@/components/search-results/search-results.component";
import { Page } from "@/lib/api/types";

async function getPages(searchValue: string | null) {
    try {
        let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true`;
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

export default async function SearchForPages({
    searchParams,
}: {
    searchParams: Promise<any>;
}) {
    const searchValue = (await searchParams)["search"] as string | undefined;

    const pages = await getPages(searchValue || null);

    return (
        <div className={styles.searchContainer}>
            <SearchResults
                initialResults={pages}
                initialSearchValue={searchValue || null}
            />
        </div>
    );
}
