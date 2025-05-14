import styles from "./navigation-bar.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

type ActivePage = "home" | "featured" | "search" | "about";

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
        <Link href="/">Coloring Pages</Link>
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
        <a>
          <div className={styles.navItem}>Featured</div>
        </a>
        <Link href="/all">
          <div
            className={`${styles.navItem} ${
              currentPage === "search" ? styles.selected : ""
            }`}
          >
            Search
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
