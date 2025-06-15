import styles from "./not-found.styles.module.scss";
import stylesButton from "../../styles/button.styles.module.scss";

import Link from "next/link";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";

export default function NotFound() {
    return (
        <div className={styles.mainContainer}>
            <NavigationBar />

            <div className={styles.notFoundContainer}>
                <div className={styles.notFoundContent}>
                    <h1>Got Lost?</h1>
                    <h2>
                        Unfortunately, Page or Collection you were looking for
                        does not exists.
                    </h2>

                    <img
                        src="/not-found.webp"
                        alt="Coloring Pages Logo"
                        height="auto"
                        width="600px"
                    />
                    <h2>
                        <span>Don't worry, we have plenty more!</span>
                    </h2>
                    <Link href="/">
                        <div className={styles.actionContainer}>
                            <div className={stylesButton.actionButton}>
                                Go Back Home
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
