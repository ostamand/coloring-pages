import styles from "./promo-section.styles.module.scss";
import stylesButton from "../../styles/button.styles.module.scss";

import Link from "next/link";

import { Page } from "@/lib/api/types";
import ImagesGrid from "../images-grid/images-grid.component";

type PromotionData = {
    pages: Page[];
    heading: string;
    sub_heading: string;
    background_url: string;
    collection_name: string;
    active: boolean;
};

export default function PromoSection({
    promotion,
}: {
    promotion: PromotionData;
}) {
    console.log(promotion);
    return (
        <div className={styles.promotionContainer}>
            <div className={styles.promotionHeading}>
                <h2>{`Collection: ${promotion.heading}`}</h2>
                <h3>{promotion.sub_heading}</h3>
            </div>

            <div className={styles.promotionContent}>
                <div className={styles.backgroundOverlay} />
                <div className={styles.imageContainer}>
                    <Link href={`/pages/${promotion.pages[0].unique_name}`}>
                        <img
                            src={promotion.pages[0].thumbnail_path}
                            alt={promotion.pages[0].prompt}
                        />
                    </Link>
                </div>
                <div className={styles.seeCollectionContent}>
                    <Link href="/pages">
                        <div className={stylesButton.actionButton}>
                            See Full Collection
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
