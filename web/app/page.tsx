import styles from "./home.styles.module.scss";
import tagStyles from "../styles/tag.styles.module.scss";

import Image from "next/image";
import Link from "next/link";

import { Page } from "@/lib/api/types";
import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import DownloadButton from "@/components/download-button/download-button.components";

// Set revalidate to 43200 seconds (12 hours)
export const revalidate = 43200;

async function getFeaturedPages() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages?limit=7`
        );
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
            <NavigationBar currentPage="Home" />
            <div className={styles.featured}>
                <div className={styles.leftSection}>
                    <h1>New Coloring Page</h1>
                    <h2>Each day, a new coloring page. It's free, grab it!</h2>
                    <DownloadButton
                        pageId={featuredPage.id}
                        text="Download Page"
                        fileUrl={featuredPage.coloring_path}
                        name={featuredPage.name || "coloring-page"}
                    />
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
                                width={2550}
                                height={3300}
                            />
                        </Link>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.previously}>
                    <div className={styles.previouslyHeading}>
                        <h1>More Coloring Pages</h1>
                        <h2>Take A Look At Some of Our Previous Ones</h2>
                    </div>
                    <div className={styles.previouslyGridContainer}>
                        {previousPages.map((page) => {
                            return (
                                <div
                                    className={styles.previouslyImageContainer}
                                    key={page.id}
                                >
                                    <div
                                        className={
                                            styles.previouslyImageContent
                                        }
                                    >
                                        <div
                                            className={tagStyles.tagsContainer}
                                        >
                                            {page.tags.map((tag, index) => {
                                                return (
                                                    <div
                                                        className={
                                                            tagStyles.tagItem
                                                        }
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
                                                width={2550}
                                                height={3300}
                                            />
                                        </Link>
                                    </div>
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
            </div>
            <Footer />
        </div>
    );
}
