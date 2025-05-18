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

    useEffect(() => {
        setPages(pages.slice(1, undefined));
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
            <ImagesGrid pages={pages} />
        </div>
    );
}
