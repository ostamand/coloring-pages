"use client";

import styles from "./search-results.styles.module.scss";

import { useEffect, useState } from "react";

import { Page } from "@/lib/api/types";
import ImagesGrid from "../images-grid/images-grid.component";
import NoResultRequest from "../no-results-request/no-result-request.component";

import { Input } from "@/components/ui/input";

const DEBOUNCE_TIME = 0.25 * 1000;

export default function SearchResults({
    initialResults,
    initialSearchValue,
}: {
    initialResults: Page[];
    initialSearchValue: string | null;
}) {
    const [debounceTimerId, setDebounceTimerId] =
        useState<NodeJS.Timeout | null>(null);
    const [pages, setPages] = useState(initialResults);
    const [searchValue, setSearchValue] = useState(initialSearchValue || "");
    const [lastSearchValue, setLastSearchValue] = useState(
        initialSearchValue || ""
    );

    const getPages = async (searchValue: string) => {
        try {
            //! maybe add limit?
            let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?search=${searchValue}`;
            if (!searchValue) {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true&limit=6`;
            }
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("Could not get pages for search from API.");
            }
            const data = await response.json();
            const pages = data as Page[];
            setPages(pages);
        } catch (error) {
            console.error(error);
            //TODO display error on page
        }
    };

    useEffect(() => {
        if (lastSearchValue === searchValue) {
            return; // no need to fetch
        }
        if (debounceTimerId) {
            clearTimeout(debounceTimerId);
        }
        const timerId = setTimeout(async () => {
            await getPages(searchValue);
            setLastSearchValue(searchValue);
        }, DEBOUNCE_TIME);
        setDebounceTimerId(timerId);
        return () => {
            if (debounceTimerId) {
                clearTimeout(debounceTimerId);
            }
        };
    }, [searchValue]);

    useEffect(() => {
        if (searchValue !== initialSearchValue) {
            setSearchValue(initialSearchValue || "");
        }
    }, [initialSearchValue]);

    return (
        <div className={styles.searchResultsContainer}>
            <div className={styles.searchInputContainer}>
                <div className={styles.searchInputContent}>
                    <h1>Search Coloring Pages</h1>
                    <Input
                        type="search"
                        value={searchValue}
                        onChange={(event) => {
                            if (event.target.value !== searchValue) {
                                setSearchValue(event.target.value);
                            }
                        }}
                    />
                </div>
            </div>
            <div className={styles.resultsContent}>
                {pages.length > 0 ? (
                    <ImagesGrid pages={pages} limit={3} />
                ) : (
                    <NoResultRequest searchValue={searchValue} />
                )}
            </div>
        </div>
    );
}
