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
                <h2>New Collection</h2>
                <h1>{promotion.title}</h1>
                <p>
                    Explore a new world of creativity with our latest collection.
                    Dozens of new pages to discover.
                </p>
                <Link href={`/collections/${promotion.collection_name}`}>
                    <div
                        className={`${buttonStyles.actionButton} ${
                            isHovered ? styles.buttonHovered : ""
                        }`}
                    >
                        See Full Collection
                    </div>
                </Link>
            </div>
            <div
                className={styles.rightSection}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={`/collections/${promotion.collection_name}`}>
                    <img src={page.thumbnail_path} alt={page.prompt} />
                </Link>
            </div>
        </div>
    );
}
