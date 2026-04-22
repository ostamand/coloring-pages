"use client";

import styles from "./home-search-section.styles.module.scss";
import { useEffect, useState, useRef, useCallback } from "react";
import { Page, Promotion } from "@/lib/api/types";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PromoSection from "@/components/promo-section/promo-section.component";
import CollectionSection from "@/components/collection-section/collection-section.component";
import ImagesGrid from "@/components/images-grid/images-grid.component";
import NoResultRequest from "@/components/no-results-request/no-result-request.component";

interface HomeSearchSectionProps {
    promotions: Promotion[] | null;
    initialPages: Page[];
}

const DEBOUNCE_TIME = 300;

export default function HomeSearchSection({
    promotions,
    initialPages,
}: HomeSearchSectionProps) {
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<Page[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastSearchValue = useRef("");
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const getPages = useCallback(async (value: string) => {
        if (!value.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        try {
            setError(null);
            setIsSearching(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages?search=${encodeURIComponent(value)}`
            );
            if (!response.ok) {
                throw new Error("Could not get pages for search from API.");
            }
            const data = await response.json();
            setSearchResults(data as Page[]);
            lastSearchValue.current = value;
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (searchValue.trim() === "") {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        debounceTimer.current = setTimeout(() => {
            getPages(searchValue);
        }, DEBOUNCE_TIME);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchValue, getPages]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
            getPages(searchValue);
        }
    };

    const hasSearch = searchValue.trim() !== "";

    return (
        <div className={styles.container}>
            <div className={styles.searchBoxSection}>
                <div className={styles.searchHeader}>
                    <h2>Find Your Next Masterpiece</h2>
                    <p>Search through our collection of free coloring pages</p>
                </div>

                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={24} />
                    <Input
                        type="search"
                        className={styles.searchInput}
                        value={searchValue}
                        placeholder="Search themes, characters, or styles..."
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>

            {hasSearch ? (
                <div className={styles.resultsSection}>
                    {error ? (
                        <div className="text-center text-red-500 mt-4">{error}</div>
                    ) : isSearching ? (
                        <div className={styles.searchingContainer}>
                            <Loader2 className={styles.spinner} size={48} />
                            <p>Searching for "{searchValue}"...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <ImagesGrid pages={searchResults} />
                    ) : (
                        <div className={styles.noResults}>
                            <NoResultRequest
                                searchValue={searchValue}
                                hideHomeLink={true}
                            />
                            <div className={styles.suggestionSection}>
                                <div className={styles.suggestionHeader}>
                                    <h3>Browse our latest additions instead</h3>
                                </div>
                                <CollectionSection pages={initialPages} />
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {promotions &&
                        promotions.map((promotion, index) => (
                            <PromoSection key={index} promotion={promotion} />
                        ))}
                    <CollectionSection pages={initialPages} />
                </>
            )}
        </div>
    );
}
