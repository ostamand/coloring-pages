"use client";

import styles from "./images-grid.styles.module.scss";

import Link from "next/link";
import { useState, useEffect } from "react";

import { Page } from "@/lib/api/types";
import PageTags from "../page-tags/page-tags.component";
import ImageWithTools from "./image-with-tools/image-with-tools.component";

const DEFAULT_LIMIT = 6;
const DEFAULT_BATCH_SIZE = 3;

export default function ImagesGrid({
    pages,
    limit,
    hideTags,
    showBorder,
    gridTemplateClassName,
}: {
    pages: Page[];
    limit?: number | null;
    hideTags?: boolean;
    showBorder?: boolean;
    gridTemplateClassName?: string;
}) {
    const [showMore, setShowMore] = useState(0);
    const [currentLimit, setCurrentLimit] = useState(limit || DEFAULT_LIMIT);
    const [pagesToShow, setPagesToShow] = useState(
        pages.slice(0, currentLimit)
    );

    useEffect(() => {
        const currentLimit =
            (limit || DEFAULT_LIMIT) + DEFAULT_BATCH_SIZE * showMore;
        setCurrentLimit(currentLimit);
        setPagesToShow(pages.slice(0, currentLimit));
    }, [showMore, pages]);

    return (
        <>
            <div
                className={`${styles.previouslyGridContainer} ${
                    gridTemplateClassName || styles.imageGridTemplateContainer
                } ${showBorder ? styles.previouslyGridContainerBorder : ""}`}
            >
                {pagesToShow.map((page) => {
                    return (
                        <div
                            className={styles.previouslyImageContainer}
                            key={page.id}
                        >
                            <div className={styles.previouslyImageContent}>
                                {!hideTags && page.tags && (
                                    <PageTags tags={page.tags} />
                                )}
                                <ImageWithTools
                                    page={page}
                                    thumbnailSrc={page.thumbnail_path}
                                    coloredSrc={page.colored_path}
                                    href={`/pages/${page.unique_name}`}
                                    alt={page.prompt}
                                />
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
