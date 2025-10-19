"use client";

import styles from "./image-with-tools.styles.module.scss";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EllipsisVertical, Palette, Info } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

import CustomPopover from "@/components/ui/custom-popover/custom-popover.component";
import PopoverMenu from "@/components/ui/popover-menu/popover-menu.component";

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
    const [isColored, setIsColored] = useState(false);

    const isMobile = useIsMobile();

    const router = useRouter();

    useEffect(() => {
        setIsColored(currentSrc === coloredSrc);
    }, [currentSrc]);

    const showPopover = isMobile || onHover;

    const menuItems = [];

    if (coloredSrc) {
        menuItems.push({
            label: !isColored ? "Colorize" : "Coloring",
            onClick: () => {
                if (isColored) {
                    setCurrentSrc(thumbnailSrc);
                } else {
                    setCurrentSrc(coloredSrc);
                }
            },
            icon: <Palette size={18} />,
        });
    }

    menuItems.push({
        label: "Details",
        onClick: () => {
            router.push(href);
        },
        icon: <Info size={18} />,
    });

    return (
        <div
            className={styles.imageContainer}
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
        >
            <Link href={href}>
                <img src={currentSrc} alt={alt} />
            </Link>

            {showPopover && (
                <div className={styles.colorizeOverlay}>
                    <CustomPopover
                        trigger={
                            <div
                                className={`${styles.callToAction} ${
                                    coloredSrc ? styles.glow : ""
                                }`}
                            >
                                <EllipsisVertical size={30} />
                            </div>
                        }
                    >
                        <PopoverMenu items={menuItems} />
                    </CustomPopover>
                </div>
            )}
        </div>
    );
}
