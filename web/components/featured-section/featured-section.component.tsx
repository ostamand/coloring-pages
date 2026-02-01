"use client";

import styles from "./featured-section.styles.module.scss";
import Link from "next/link";
import { Page } from "@/lib/api/types";
import DownloadButton from "@/components/download-button/download-button.components";
import PrintButton from "@/components/print-button/print-button.components";
import PageTags from "@/components/page-tags/page-tags.component";
import { Sparkles } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface FeaturedSectionProps {
    featuredPage: Page;
}

export default function FeaturedSection({ featuredPage }: FeaturedSectionProps) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.textContent}>
                    <div className={`${styles.badge} ${styles.animateFadeInUp}`}>Always Free</div>
                    <h1 className={`${styles.title} ${styles.animateFadeInUp} ${styles.delay1}`}>
                        New Coloring Page: <span className={styles.highlight}>{featuredPage.name}</span>
                    </h1>
                    <p className={`${styles.subtitle} ${styles.animateFadeInUp} ${styles.delay2}`}>
                        Unleash your creativity with our daily curated coloring page.
                        Perfect for all ages and skill levels.
                    </p>

                    <div className={`${styles.actions} ${styles.animateFadeInUp} ${styles.delay3}`}>
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

                        {featuredPage.reasoning && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className={styles.reasoningButton} title="Why this page?">
                                        <Sparkles className={styles.sparkleIcon} />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className={styles.dialogContent}>
                                    <DialogHeader>
                                        <DialogTitle className={styles.dialogTitle}>
                                            <Sparkles className={styles.titleIcon} /> Why this page?
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className={styles.reasoningText}>
                                        {featuredPage.reasoning}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}

                        <div className={styles.cardFooter}>

                            <PageTags tags={featuredPage.tags} className={styles.tags} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.backgroundBlur} />
        </div>
    );
}
