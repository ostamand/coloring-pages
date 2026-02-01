"use client";

import styles from "./search-results.styles.module.scss";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Page } from "@/lib/api/types";
import ImagesGrid from "../images-grid/images-grid.component";
import NoResultRequest from "../no-results-request/no-result-request.component";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const DEBOUNCE_TIME = 0.25 * 1000;

export default function SearchResults({
    initialResults,
    initialSearchValue,
}: {
    initialResults: Page[];
    initialSearchValue: string | null;
}) {
    const router = useRouter();
    const [debounceTimerId, setDebounceTimerId] =
        useState<NodeJS.Timeout | null>(null);
    const [pages, setPages] = useState(initialResults);
    const [searchValue, setSearchValue] = useState(initialSearchValue || "");
    const [lastSearchValue, setLastSearchValue] = useState(
        initialSearchValue || ""
    );
    const [error, setError] = useState<string | null>(null);

    const updateUrl = (value: string) => {
        if (value) {
            router.push(`?search=${encodeURIComponent(value)}`, { scroll: false });
        } else {
            router.push(`/pages`, { scroll: false });
        }
    };

    const getPages = async (searchValue: string) => {
        try {
            setError(null);
            //! maybe add limit?
            let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?search=${searchValue}`;
            if (!searchValue) {
                endpoint = `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true&limit=100`;
            }
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("Could not get pages for search from API.");
            }
            const data = await response.json();
            const pages = data as Page[];
            setPages(pages);
            setLastSearchValue(searchValue);
            updateUrl(searchValue);
        } catch (error) {
            console.error(error);
            setError("Something went wrong while fetching pages. Please try again.");
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

    useEffect(() => {
        setPages(initialResults);
    }, [initialResults]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (debounceTimerId) {
                clearTimeout(debounceTimerId);
            }
            getPages(searchValue);
        }
    };

    return (
        <div className={styles.searchResultsContainer}>
            <div className={styles.searchInputContainer}>
                <div className={styles.searchInputContent}>
                    <h1>Search Coloring Pages</h1>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={28} />
                        <Input
                            type="search"
                            className={styles.searchInput}
                            value={searchValue}
                            placeholder="What do you want to color?"
                            onKeyDown={handleKeyDown}
                            onChange={(event) => {
                                if (event.target.value !== searchValue) {
                                    setSearchValue(event.target.value);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.resultsContent}>
                {error ? (
                    <div className="text-center text-red-500 mt-4">{error}</div>
                ) : pages.length > 0 ? (
                    <ImagesGrid pages={pages} limit={6} />
                ) : (
                    <NoResultRequest searchValue={searchValue} />
                )}
            </div>
        </div>
    );
}
