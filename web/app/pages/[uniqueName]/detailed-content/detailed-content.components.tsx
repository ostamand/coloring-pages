"use client";

import styles from "../detailed-page.styles.module.scss";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

import { Page } from "@/lib/api/types";
import DownloadButton from "@/components/download-button/download-button.components";
import PrintButton from "@/components/print-button/print-button.components";
import PageTags from "@/components/page-tags/page-tags.component";

export default function DetailedContent({ page }: { page: Page }) {
    const [imageSrc, setImageSrc] = useState(page.thumbnail_path);
    const [isColored, setIsColored] = useState(false);

    useEffect(() => {
        setIsColored(imageSrc === page.colored_path);
    }, [imageSrc]);

    return (
        <div className={styles.glassCard}>
            <div className={styles.leftSection}>
                <div className={styles.imageContainer}>
                    <img src={imageSrc} alt={page.prompt} />
                </div>
            </div>
            <div className={styles.rightSection}>
                {page.name && <h1>{page.overwrite_name || page.name}</h1>}

                <div className={styles.actionsPanel}>
                    <DownloadButton
                        pageId={page.id}
                        fileUrl={page.full_path}
                        name={page.name || "coloring-page"}
                        text="Download"
                    />
                    <PrintButton pageId={page.id} fileUrl={page.full_path} />
                    {page.colored_path && (
                        <div
                            className={`${styles.colorizeButtonElement} ${isColored ? styles.activeState : ''}`}
                            onClick={() => {
                                if (isColored) {
                                    setImageSrc(page.thumbnail_path);
                                } else {
                                    setImageSrc(
                                        page.colored_path || page.thumbnail_path
                                    );
                                }
                            }}
                        >
                            <Palette />
                            {isColored ? "Reset (Original)" : "Colorize!"}
                        </div>
                    )}
                </div>

                <div className="mt-1">
                    <PageTags tags={page.tags} />
                </div>

                <div className={styles.promptContent}>
                    <h2>Description</h2>
                    <p>{page.prompt}</p>
                </div>
                <div className={styles.labelWithContent}>
                    <h2>Collection</h2>
                    <Link href={`/collections/${page.upd_collection_name}`}>
                        {page.collection_name}
                    </Link>
                </div>
                {page.featured_on && (
                    <div className={styles.labelWithContent}>
                        <h2>Featured On</h2>
                        <p>
                            {new Date(
                                page.featured_on || ""
                            ).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
