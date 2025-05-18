"use client";

import styles from "./images-grid.styles.module.scss";
import tagStyles from "../../styles/tag.styles.module.scss";

import Link from "next/link";
import { useState, useEffect } from "react";

import { Page } from "@/lib/api/types";

const DEFAULT_LIMIT = 6;
const DEFAULT_BATCH_SIZE = 3;

export default function ImagesGrid({
    pages,
    limit,
}: {
    pages: Page[];
    limit?: number | null;
}) {
    const [showMore, setShowMore] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(limit || DEFAULT_LIMIT);

    useEffect(() => {
        setCurrentLimit(
            (limit || DEFAULT_LIMIT) + DEFAULT_BATCH_SIZE * showMore
        );
    }, [showMore]);

    const pagesToShow = pages.slice(0, currentLimit);

    return (
        <>
            <div className={styles.previouslyGridContainer}>
                {pagesToShow.map((page) => {
                    return (
                        <div
                            className={styles.previouslyImageContainer}
                            key={page.id}
                        >
                            <div className={styles.previouslyImageContent}>
                                <div className={tagStyles.tagsContainer}>
                                    {page.tags.map((tag, index) => {
                                        return (
                                            <div
                                                className={tagStyles.tagItem}
                                                key={index}
                                            >
                                                {tag}
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link href={`/pages/${page.id}`}>
                                    <img
                                        src={page.thumbnail_path}
                                        alt={page.prompt}
                                    />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {currentLimit < pages.length && (
                <div
                    className={styles.showMoreContainer}
                    onClick={() => {
                        setShowMore(showMore + 1);
                    }}
                >
                    <div className={styles.showMoreButton}>Show More</div>
                </div>
            )}
        </>
    );
}
