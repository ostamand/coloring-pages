import styles from "./navigation-bar.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

type ActivePage = "home" | "featured" | "pages" | "about";

export default function NavigationBar({
    currentPage,
}: {
    currentPage: ActivePage;
}) {
    return (
        <nav className={styles.navbar}>
            <div className={styles.navLeft}>
                <Link href="/">
                    <Image
                        src="https://placehold.co/50x50"
                        alt="Coloring Pages Logo"
                        width={35}
                        height={35}
                        unoptimized
                    />
                </Link>
                <Link href="/">Color It Daily</Link>
            </div>
            <div className={styles.navCenter}>
                <Link href="/">
                    <div
                        className={`${styles.navItem} ${
                            currentPage === "home" ? styles.selected : ""
                        }`}
                    >
                        Home
                    </div>
                </Link>
                <Link href="/pages">
                    <div
                        className={`${styles.navItem} ${
                            currentPage === "pages" ? styles.selected : ""
                        }`}
                    >
                        Pages
                    </div>
                </Link>
                <Link href="/about">
                    <div
                        className={`${styles.navItem} ${
                            currentPage === "about" ? styles.selected : ""
                        }`}
                    >
                        About
                    </div>
                </Link>
            </div>
            <div></div>
        </nav>
    );
}
