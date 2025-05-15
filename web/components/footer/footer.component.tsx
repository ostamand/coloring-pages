import styles from "./footer.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerLeft}>
                <div className={styles.heading}>
                    <Link href="/">
                        <div className={styles.logo}>
                            <Image
                                src="/ColorItDailyLogo.png"
                                alt="Coloring Pages Logo"
                                width={880}
                                height={477}
                                layout="responsive"
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
                © 2025 Color It Daily. All rights reserved.
            </div>
        </div>
    );
}
