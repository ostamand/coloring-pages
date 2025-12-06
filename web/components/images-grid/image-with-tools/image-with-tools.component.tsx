"use client";

import styles from "./image-with-tools.styles.module.scss";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Download,
    EllipsisVertical,
    Info,
    Palette,
    Printer,
} from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";

import CustomPopover from "@/components/ui/custom-popover/custom-popover.component";
import PopoverMenu from "@/components/ui/popover-menu/popover-menu.component";
import { Page } from "@/lib/api/types";
import { useDownloader } from "@/lib/download";
import { usePrinter } from "@/hooks/use-printer";

type ImageWithToolsProps = {
    page: Page;
    thumbnailSrc: string;
    coloredSrc: string | null;
    alt: string;
    href: string;
};

export default function ImageWithTools({
    page,
    thumbnailSrc,
    coloredSrc,
    alt,
    href,
}: ImageWithToolsProps) {
    const [onHover, setOnHover] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(thumbnailSrc);
    const [isColored, setIsColored] = useState(false);

    useEffect(() => {
        if (coloredSrc && Math.random() < 0.6) {
            setCurrentSrc(coloredSrc);
        }
    }, [coloredSrc]);

    const isMobile = useIsMobile();

    const router = useRouter();

    const { handleDownload } = useDownloader();
    const { handlePrint, PrintIframe } = usePrinter();

    useEffect(() => {
        setIsColored(currentSrc === coloredSrc);
    }, [currentSrc, coloredSrc]);

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

    menuItems.push({
        label: "Download",
        onClick: () => handleDownload(page.id, page.full_path, page.name),
        icon: <Download size={18} />,
    });

    menuItems.push({
        label: "Print",
        onClick: () => handlePrint(page.id, page.full_path),
        icon: <Printer size={18} />,
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
            {PrintIframe}
        </div>
    );
}
