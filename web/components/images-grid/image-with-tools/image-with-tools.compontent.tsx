"use client";

import styles from "./image-with-tools.styles.module.scss";

import { useState } from "react";
import Link from "next/link";
import { Palette } from "lucide-react";

type ImageWithToolsProps = {
    thumbnailSrc: string;
    coloredSrc: string | null;
    alt: string;
    href: string;
};

export default function ImageWithTools({
    thumbnailSrc,
    coloredSrc,
    alt,
    href,
}: ImageWithToolsProps) {
    const [onHover, setOnHover] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(thumbnailSrc);
    return (
        <div
            className={styles.imageContainer}
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
        >
            <Link href={href}>
                <img src={currentSrc} alt={alt} />
            </Link>

            {onHover && coloredSrc && (
                <div
                    className={styles.colorizeOverlay}
                    onClick={() => {
                        if (currentSrc === thumbnailSrc) {
                            setCurrentSrc(coloredSrc);
                        } else if (currentSrc === coloredSrc) {
                            setCurrentSrc(thumbnailSrc);
                        }
                    }}
                >
                    <Palette size={25} />
                </div>
            )}
        </div>
    );
}
