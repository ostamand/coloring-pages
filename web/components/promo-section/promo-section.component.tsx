"use client";


import Link from "next/link";
import styles from "./promo-section.styles.module.scss";

import { Promotion } from "@/lib/api/types";

export default function PromoSection({ promotion }: { promotion: Promotion }) {
    const page = promotion.page;

    if (!page) return <></>;

    return (
        <div className={styles.promoContainer}>
            <div className={styles.leftSection}>
                <h2>Collection: {promotion.heading}</h2>
                <p>{promotion.sub_heading}</p>
                <Link href={`/collections/${promotion.collection_name}`} className={styles.ctaButton}>
                    See Full Collection
                </Link>
            </div>
            <div
                className={styles.rightSection}
            >
                <Link href={`/collections/${promotion.collection_name}`}>
                    <img
                        src={page.colored_path || page.thumbnail_path}
                        alt={page.prompt}
                    />
                </Link>
            </div>
        </div>
    );
}
