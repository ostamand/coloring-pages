import styles from "./home.styles.module.scss";
import tagStyles from "../styles/tag.styles.module.scss";

import Image from "next/image";
import { Download } from "lucide-react";
import Link from "next/link";

import { Page } from "@/lib/api/types";
import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";

// Set revalidate to 86400 seconds (24 hours)
export const revalidate = 86400;

async function getFeaturedPages() {
    try {
        const response = await fetch(`${process.env.API_URL}/pages?limit=10`);
        if (!response.ok) {
            throw new Error("Could not get featured pages.");
        }
        const data = await response.json();
        const pages = data as Page[];
        return pages;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function Home() {
    const pages = await getFeaturedPages();

    const previousPages = pages.slice(1, pages.length);

    const featuredPage = pages[0];

    return (
        <div className={styles.mainContainer}>
            <NavigationBar currentPage="home" />
            <div className={styles.featured}>
                <div className={styles.leftSection}>
                    <h1>New Coloring Page</h1>
                    <h2>Each day, a new coloring page. It's free, grab it!</h2>
                    <div className={styles.downloadButton}>
                        <Download />
                        Download Page
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <div className={tagStyles.tagsContainer}>
                        {featuredPage.tags.map((tag, index) => {
                            return (
                                <div className={tagStyles.tagItem} key={index}>
                                    {tag}
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.imageContainer}>
                        <Link href={`/pages/${featuredPage.id}`}>
                            <Image
                                src={featuredPage.coloring_path}
                                alt={featuredPage.prompt}
                                width={500}
                                height={750}
                            />
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.previously}>
                <div className={styles.previouslyHeading}>
                    <h1>More Coloring Pages</h1>
                    <h2>Take A Look At Some of Our Previous Ones</h2>
                </div>
                <div className={styles.previouslyGridContainer}>
                    {previousPages.map((page) => {
                        return (
                            <div
                                className={styles.previouslyImageContent}
                                key={page.id}
                            >
                                <div className={tagStyles.tagsContainer}>
                                    {page.tags.map((tag, index) => {
                                        return (
                                            <div
                                                className={tagStyles.tagItem}
                                                key={index}
                                            >
                                                {tag}
                                            </div>
                                        );
                                    })}
                                </div>
                                <Link href={`/pages/${page.id}`}>
                                    <Image
                                        src={page.coloring_path}
                                        alt={page.prompt}
                                        width={500}
                                        height={750}
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.seeMore}>
                    <Link href="/pages">
                        <div className={styles.seeMoreButton}>
                            See All Coloring Pages
                        </div>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
