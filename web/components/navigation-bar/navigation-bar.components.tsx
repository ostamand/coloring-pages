"use client";

import styles from "./navigation-bar.styles.module.scss";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActivePage = "Home" | "Featured" | "All Pages" | "About";

export default function NavigationBar({
    currentPage,
}: {
    currentPage: ActivePage;
}) {
    const isMobile = useIsMobile();
    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <div>
                    <Link href="/">
                        <img
                            className={styles.logo}
                            src="/Logo_ColorItDaily.svg"
                            alt="Coloring Pages Logo"
                        />
                    </Link>
                </div>
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
                            <DropdownMenuItem>
                                <Link href="/">Home</Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href="/pages">All Pages</Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href="/about">About</Link>
                            </DropdownMenuItem>
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
                                currentPage === "All Pages"
                                    ? styles.selected
                                    : ""
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
