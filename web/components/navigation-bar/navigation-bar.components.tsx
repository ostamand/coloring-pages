"use client";

import styles from "./navigation-bar.styles.module.scss";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActivePage = "Home" | "Featured" | "Pages" | "About";

export default function NavigationBar({
    currentPage,
}: {
    currentPage: ActivePage;
}) {
    const isMobile = useIsMobile();
    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <div className={styles.logo}>
                    <Link href="/">
                        <Image
                            src="/ColorItDailyLogo.png"
                            alt="Coloring Pages Logo"
                            width={880}
                            height={477}
                        />
                    </Link>
                </div>
                <Link href="/">Color It Daily</Link>
            </div>
            {isMobile ? (
                <div className={styles.navRight}>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div className={styles.dropdownNav}>
                                <span>{`${currentPage}`}</span> <ChevronDown />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {currentPage !== "Home" && (
                                <DropdownMenuItem>
                                    <Link href="/">Home</Link>
                                </DropdownMenuItem>
                            )}

                            {currentPage !== "Pages" && (
                                <DropdownMenuItem>
                                    <Link href="/pages">All Pages</Link>
                                </DropdownMenuItem>
                            )}

                            {currentPage !== "About" && (
                                <DropdownMenuItem>
                                    <Link href="/about">About</Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <div className={styles.navCenter}>
                    <Link href="/">
                        <div
                            className={`${styles.navItem} ${
                                currentPage === "Home" ? styles.selected : ""
                            }`}
                        >
                            Home
                        </div>
                    </Link>
                    <Link href="/pages">
                        <div
                            className={`${styles.navItem} ${
                                currentPage === "Pages" ? styles.selected : ""
                            }`}
                        >
                            All Pages
                        </div>
                    </Link>
                    <Link href="/about">
                        <div
                            className={`${styles.navItem} ${
                                currentPage === "About" ? styles.selected : ""
                            }`}
                        >
                            About
                        </div>
                    </Link>
                </div>
            )}
        </nav>
    );
}
