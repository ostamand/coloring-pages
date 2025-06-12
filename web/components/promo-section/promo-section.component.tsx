import styles from "./promo-section.styles.module.scss";
import stylesButton from "../../styles/button.styles.module.scss";

import Link from "next/link";

import { Promotion } from "@/lib/api/types";

export default function PromoSection({ promotion }: { promotion: Promotion }) {
    return (
        <div className={styles.promotionContainer}>
            <div className={styles.promotionHeading}>
                <h2>{`Collection: ${promotion.heading}`}</h2>
                <h3>{promotion.sub_heading}</h3>
            </div>

            <div className={styles.promotionContent}>
                <div className={styles.backgroundOverlay} />
                <div className={styles.imageContainer}>
                    <Link href={`/collections/${promotion.collection_name}`}>
                        <img
                            src={promotion.page.thumbnail_path}
                            alt={promotion.page.prompt}
                        />
                    </Link>
                </div>
                <div className={styles.seeCollectionContent}>
                    <Link href={`/collections/${promotion.collection_name}`}>
                        <div className={stylesButton.actionButton}>
                            See Full Collection
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
