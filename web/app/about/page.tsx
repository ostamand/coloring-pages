import styles from "./about.styles.module.scss";

import Link from "next/link";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";

export default function About() {
    return (
        <div className={styles.mainContainer}>
            <NavigationBar currentPage="About" />

            <div className={styles.aboutContainer}>
                <div className={styles.aboutContent}>
                    <div className={styles.heading}>
                        <Link href="/">
                            <img
                                src="/ColorItDailyLogo.png"
                                alt="Coloring Pages Logo"
                                height="60px"
                                width="60px"
                            />
                        </Link>
                        <Link href="/">
                            <span>Color It Daily</span>
                        </Link>
                    </div>

                    <h1>Inspiring Creativity, One Page at a Time</h1>

                    <div className={styles.textContent}>
                        <h2>
                            Discover a fresh new coloring page every day,
                            designed to spark joy and creativity for both{" "}
                            <span>kids </span>
                            and <span>adults</span>.
                        </h2>

                        <div className={styles.features}>
                            <div className={styles.featuresTitle}>
                                Simple, Stylish Designs
                            </div>
                            <div className={styles.featuresDescription}>
                                Bold lines and thoughtfully crafted styles make
                                our pages perfect for coloring.
                            </div>
                            <div className={styles.featuresTitle}>
                                100% Free
                            </div>
                            <div className={styles.featuresDescription}>
                                No ads, no sign-ups, no distractions—just pure
                                creative fun.
                            </div>
                            <div className={styles.featuresTitle}>
                                No Frills, No Fuss
                            </div>
                            <div className={styles.featuresDescription}>
                                Say goodbye to watermarks, borders, and
                                unnecessary margins. It's all about your
                                creativity.
                            </div>
                            <div className={styles.featuresTitle}>
                                Print-Ready Excellence
                            </div>
                            <div className={styles.featuresDescription}>
                                Full-sized, high-definition images optimized for
                                effortless printing. Simply save and print, no
                                extra setup needed.
                            </div>
                        </div>

                        <h2>
                            Color It Daily is your go-to source for quality
                            coloring pages that let your imagination run free.
                        </h2>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

/*
    Color It Daily

    Inspiring Creativity, One Page at a Time

    Discover a fresh new coloring page every day, designed to spark joy and creativity for both kids and adults.
    
    - Simple, Stylish Designs
        Bold lines and thoughtfully crafted styles make our pages perfect for coloring.
    - 100% Free
        No ads, no sign-ups, no distractions—just pure creative fun.
    - No Frills, No Fuss
        Say goodbye to watermarks, borders, and unnecessary margins. It's all about your creativity.
    - Print-Ready Excellence
        Full-sized, high-definition images optimized for effortless printing. Simply save and print—no extra setup needed.

    Color It Daily is your go-to source for quality coloring pages that let your imagination run free.
*/
