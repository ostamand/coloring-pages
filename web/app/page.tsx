import styles from "./home.styles.module.scss";

import Link from "next/link";

import { Page } from "@/lib/api/types";
import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import DownloadButton from "@/components/download-button/download-button.components";
import ImagesGrid from "@/components/images-grid/images-grid.component";
import PageTags from "@/components/page-tags/page-tags.component";

// Set revalidate to 43200 seconds (12 hours)
export const revalidate = 43200;

async function getFeaturedPage() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages?limit=1`
        );
        if (!response.ok) {
            throw new Error("Could not get featured pages.");
        }
        const data = await response.json();
        const pages = data as Page[];
        return pages[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getPages() {
    const featuredPage = await getFeaturedPage();
    if (!featuredPage) return {};
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages?random=true&limit=7`
        );
        if (!response.ok) {
            throw new Error("Could not get previously featured pages.");
        }
        const data = await response.json();
        let pages = data as Page[];
        pages = pages.filter((page) => page.id !== featuredPage.id).slice(0, 6);
        return { featuredPage, pages };
    } catch (error) {
        console.error(error);
        return {};
    }
}

export default async function Home() {
    const { pages, featuredPage } = await getPages();

    if (!pages || !featuredPage) return <></>;

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
                        fileUrl={featuredPage.full_path}
                        name={featuredPage.name || "coloring-page"}
                    />
                </div>
                <div className={styles.rightSection}>
                    <PageTags
                        tags={featuredPage.tags}
                        className={styles.tagsContainer}
                    />

                    <div className={styles.imageContainer}>
                        <Link href={`/pages/${featuredPage.id}`}>
                            <img
                                src={featuredPage.thumbnail_path}
                                alt={featuredPage.prompt}
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

                    <ImagesGrid pages={pages} />

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
