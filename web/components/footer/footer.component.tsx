import styles from "./footer.styles.module.scss";

import Link from "next/link";

export function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerLeft}>
                <div className={styles.heading}>
                    <Link href="/">
                        <div>
                            <img
                                className={styles.logo}
                                src="/Logo_ColorItDaily.svg"
                                alt="Color It Daily Logo"
                            />
                        </div>
                    </Link>
                </div>
            </div>
            <div className={styles.foorterRight}>
                © 2026 All rights reserved.
            </div>
        </div>
    );
}
