import styles from "./search-for-pages.styles.module.scss";

import SearchResults from "@/components/search-results/search-results.component";
import { Page } from "@/lib/api/types";

async function getPages() {
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

export default async function SearchForPages() {
    const pages = await getPages();

    return (
        <div className={styles.searchContainer}>
            <SearchResults initialResults={pages} />
        </div>
    );
}
