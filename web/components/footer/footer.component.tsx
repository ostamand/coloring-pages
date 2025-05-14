import styles from "./footer.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerLeft}>
                <div className={styles.heading}>
                    <Link href="/">
                        <Image
                            src="https://placehold.co/50x50"
                            alt="Coloring Pages Logo"
                            width={35}
                            height={35}
                            unoptimized
                        />
                    </Link>
                    <Link href="/">
                        <span>Coloring Pages</span>
                    </Link>
                </div>
                <p>Free! Creative and High Quality Coloring Pages</p>
            </div>
            <div className={styles.foorterRight}>
                © 2025 Coloring Pages. All rights reserved.
            </div>
        </div>
    );
}
