"use client";

import styles from "./featured-section.styles.module.scss";
import Link from "next/link";
import { Page } from "@/lib/api/types";
import DownloadButton from "@/components/download-button/download-button.components";
import PrintButton from "@/components/print-button/print-button.components";
import PageTags from "@/components/page-tags/page-tags.component";

interface FeaturedSectionProps {
    featuredPage: Page;
}

export default function FeaturedSection({ featuredPage }: FeaturedSectionProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.textContent}>
                    <div className={styles.badge}>Daily Freebie</div>
                    <h1 className={styles.title}>
                        Today&apos;s Collection: <span className={styles.highlight}>Fresh & Fun</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Unleash your creativity with our daily curated coloring page.
                        Perfect for all ages and skill levels.
                    </p>

                    <div className={styles.actions}>
                        <div>
                            <DownloadButton
                                pageId={featuredPage.id}
                                text="Download Now"
                                fileUrl={featuredPage.full_path}
                                name={featuredPage.name || "coloring-page"}
                            />
                        </div>
                        <div>
                            <PrintButton
                                pageId={featuredPage.id}
                                fileUrl={featuredPage.full_path}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.visualContent}>
                    <div className={styles.card}>
                        <Link href={`/pages/${featuredPage.unique_name}`}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={featuredPage.thumbnail_path}
                                    alt={featuredPage.prompt}
                                    className={styles.image}
                                />
                            </div>
                        </Link>
                        <div className={styles.cardFooter}>
                            <span className={styles.fileName}>{featuredPage.name || "Untitled"}</span>
                            <PageTags tags={featuredPage.tags} className={styles.tags} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.backgroundBlur} />
        </div>
    );
}
