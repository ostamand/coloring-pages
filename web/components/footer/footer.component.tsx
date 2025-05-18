import styles from "./footer.styles.module.scss";

import Link from "next/link";

export function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerLeft}>
                <div className={styles.heading}>
                    <Link href="/">
                        <div className={styles.logo}>
                            <img
                                src="/ColorItDailyLogo.png"
                                alt="Color It Daily Logo"
                            />
                        </div>
                    </Link>
                    <Link href="/">
                        <span>Color It Daily</span>
                    </Link>
                </div>
                <p>Always Free! Creative and High Quality Coloring Pages</p>
            </div>
            <div className={styles.foorterRight}>
                © 2025 All rights reserved.
            </div>
        </div>
    );
}
