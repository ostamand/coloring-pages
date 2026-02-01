import styles from "./home.styles.module.scss";


import type { Metadata } from "next";

import { Page, Promotion } from "@/lib/api/types";
import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import PromoSection from "@/components/promo-section/promo-section.component";
import FeaturedSection from "@/components/featured-section/featured-section.component";
import CollectionSection from "@/components/collection-section/collection-section.component";

export const revalidate = 86400;

const title = "Color It Daily | Free Coloring Page of the Day";
const url = "https://coloritdaily.com";
const description =
    "Discover a new coloring page every day! Download today's featured free coloring page and explore past favorites. Start your creative journey now!";
export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title,
        description,
        url,
    },
    alternates: {
        canonical: url,
    },
};

async function getFeaturedPage() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages/featured`,
        );
        if (!response.ok) {
            throw new Error("Could not get featured pages.");
        }
        const data = await response.json();
        const page = data as Page;
        return page;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getPages() {
    const featuredPage = await getFeaturedPage();
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages/featured/history?limit=6&offset=1`,
        );
        if (!response.ok) {
            throw new Error("Could not get previously published pages.");
        }
        const data = await response.json();
        const pages = data as Page[];
        return { pages, featuredPage };
    } catch (error) {
        console.error(error);
        return { featuredPage };
    }
}

async function getActivePromotions(): Promise<Promotion[] | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/promotions`,
        );

        if (!response.ok) {
            throw new Error("Failed to get promotions");
        }
        const data = await response.json();

        const promotions = data as Promotion[];

        // try to get random page for each promotion if possible
        // else will fall back to showcase_page already in the response
        // all of this is cached daily
        for (const promotion of promotions) {
            try {
                const responsePage = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/pages?collection=${promotion.collection_name}&limit=1&random=true`,
                );
                if (responsePage.ok) {
                    const page = (await responsePage.json()) as Page[];
                    promotion.page = page[0];
                }
            } catch (error) {
                console.error(error);
            }
        }
        return promotions;
    } catch (error) {
        console.error(error);
    }
    return null;
}

export default async function Home() {
    const promotions = await getActivePromotions();
    const { pages, featuredPage } = await getPages();

    if (!pages || !featuredPage) return <></>;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Color It Daily",
        url: "https://coloritdaily.com",
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className={styles.mainContainer}>
                <NavigationBar currentPage="Home" />

                <div className={styles.featured}>
                    <FeaturedSection featuredPage={featuredPage} />
                </div>

                {promotions &&
                    promotions.map((promotion, index) => {
                        return (
                            <PromoSection key={index} promotion={promotion} />
                        );
                    })}

                <CollectionSection pages={pages} />
                <Footer />
            </div>
        </>
    );
}
