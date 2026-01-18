"use client";

import styles from "./collection-section.styles.module.scss";
import Link from "next/link";
import { Page } from "@/lib/api/types";
import ImagesGrid from "@/components/images-grid/images-grid.component";

interface CollectionSectionProps {
    pages: Page[];
}

export default function CollectionSection({ pages }: CollectionSectionProps) {
    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h2 className={styles.title}>More Coloring Pages!</h2>
                    <p className={styles.subtitle}>A Sample From All our Collections</p>
                </div>

                <div className={styles.gridWrapper}>
                    <ImagesGrid pages={pages} />
                </div>

                <div className={styles.footer}>
                    <Link href="/pages" className={styles.seeAllButton}>
                        See All Coloring Pages
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
