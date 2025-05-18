import styles from "./page-tags.styles.module.scss";

import Link from "next/link";

export default function PageTags({
    tags,
    className,
}: {
    tags: string[];
    className?: string;
}) {
    return (
        <div className={`${styles.tagsContainer} ${styles.tagsContainer}`}>
            {tags.map((tag, index) => {
                return (
                    <Link href={`/pages?search=${tag}`} key={index}>
                        <div
                            className={`${styles.tagItem} ${className || ""}`}
                            key={index}
                        >
                            {tag}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
