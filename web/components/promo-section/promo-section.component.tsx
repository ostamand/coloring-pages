"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./promo-section.styles.module.scss";
import buttonStyles from "../../styles/button.styles.module.scss";
import { Promotion } from "@/lib/api/types";

export default function PromoSection({ promotion }: { promotion: Promotion }) {
    const [isHovered, setIsHovered] = useState(false);
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
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
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
