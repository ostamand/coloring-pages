import styles from "./images-grid.styles.module.scss";
import tagStyles from "../../styles/tag.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

import { Page } from "@/lib/api/types";

export default function ImagesGrid({ pages }: { pages: Page[] }) {
    return (
        <div className={styles.previouslyGridContainer}>
            {pages.map((page) => {
                return (
                    <div
                        className={styles.previouslyImageContainer}
                        key={page.id}
                    >
                        <div className={styles.previouslyImageContent}>
                            <div className={tagStyles.tagsContainer}>
                                {page.tags.map((tag, index) => {
                                    return (
                                        <div
                                            className={tagStyles.tagItem}
                                            key={index}
                                        >
                                            {tag}
                                        </div>
                                    );
                                })}
                            </div>
                            <Link href={`/pages/${page.id}`}>
                                <img
                                    src={page.thumbnail_path}
                                    alt={page.prompt}
                                />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
