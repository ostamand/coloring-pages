"use client";

import styles from "./image-with-tools.styles.module.scss";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EllipsisVertical } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { Command, CommandItem, CommandList } from "@/components/ui/command";

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
                    <Popover>
                        <PopoverTrigger>
                            <div
                                className={`${styles.callToAction} ${
                                    coloredSrc ? styles.colored : ""
                                }`}
                            >
                                <EllipsisVertical size={30} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Command>
                                <CommandList>
                                    {coloredSrc && (
                                        <CommandItem
                                            onSelect={() => {
                                                if (isColored) {
                                                    setCurrentSrc(thumbnailSrc);
                                                } else {
                                                    setCurrentSrc(coloredSrc);
                                                }
                                            }}
                                        >
                                            {!isColored
                                                ? "Colorize"
                                                : "Coloring"}
                                        </CommandItem>
                                    )}

                                    <CommandItem
                                        onSelect={() => {
                                            router.push(href);
                                        }}
                                    >
                                        Details
                                    </CommandItem>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    );
}
