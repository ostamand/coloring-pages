"use client";

import styles from "./search-results.styles.module.scss";

import { useEffect, useState } from "react";

import { Page } from "@/lib/api/types";
import ImagesGrid from "../images-grid/images-grid.component";

import { Input } from "@/components/ui/input";

export default function SearchResults({
    initialResults,
}: {
    initialResults: Page[];
}) {
    const [pages, setPages] = useState(initialResults);
    const [searchValue, setSearchValue] = useState("");

    const getPages = async (searchValue: string) => {
        try {
            //! maybe add limit?
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages?search=${searchValue}`
            );
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
        getPages(searchValue);
    }, [searchValue]);

    return (
        <div className={styles.searchResultsContainer}>
            <div className={styles.searchInputContainer}>
                <div className={styles.searchInputContent}>
                    <h1>Search For A Coloring Page</h1>
                    <Input
                        type="search"
                        value={searchValue}
                        onChange={(event) => {
                            setSearchValue(event.target.value);
                        }}
                    />
                </div>
            </div>
            <ImagesGrid pages={pages} limit={3} />
        </div>
    );
}
