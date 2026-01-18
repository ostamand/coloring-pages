import styles from "./collections.styles.module.scss";

import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { redirect } from "next/navigation";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import ImagesGrid from "@/components/images-grid/images-grid.component";
import { Page, Collection } from "../../../lib/api/types";

const DEFAULT_COLLECTION_BACKGROUND = "/promotions/thick-lines.webp";
const DEFAULT_COLLECTION_DISPLAY_NAME = "Thick Lines";

async function getCollectionPages(collectionName: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages?collection=${collectionName}&random=true`,
            {
                next: {
                    revalidate: 60 * 60 * 24,
                    tags: [
                        "pages",
                        "collection-pages",
                        `collection-${collectionName}`,
                    ],
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
            return data as Page[];
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

async function getCollection(collectionName: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionName}`,
            {
                next: {
                    revalidate: 60 * 60 * 24,
                    tags: [
                        "pages",
                        "collections",
                        `collection-${collectionName}`,
                    ],
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
            return data as Collection;
        }
    } catch (error) {
        console.error(error);
    }
    return null;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;

    const collection = await getCollection(name);

    const title = `${
        collection?.display_name || ""
    } Collection | Free Coloring Page | Color It Daily`;

    const description = `Check out our unique ${
        collection?.display_name || ""
    } collection and start coloring today. Perfect for all ages! Always free.`;

    const url = `https://coloritdaily.com/collections/${name}`;

    return {
        title: title,
        description,
        openGraph: {
            title,
            description,
            url,
            images: [
                {
                    url:
                        collection?.background_url ||
                        DEFAULT_COLLECTION_BACKGROUND,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        alternates: {
            canonical: url,
        },
    };
}

export async function generateStaticParams() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/collections`
        );
        if (!response.ok) {
            throw new Error("Could not get collections");
        }
        const data = await response.json();
        const collections = data as Collection[];
        return collections.map((collection) => {
            return {
                name: collection.name,
            };
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name: collectionName } = await params;

    const pages = await getCollectionPages(collectionName);
    const collection = await getCollection(collectionName);

    if (!collection) {
        redirect("/not-found");
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collection.display_name,
        description: collection.sub_heading || `Collection of ${collection.display_name} coloring pages`,
        url: `https://coloritdaily.com/collections/${collectionName}`,
        image: collection.background_url,
    };

    return (
        <div className={styles.mainContainer}>
             <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <NavigationBar currentPage="All Pages" />
            <div className={styles.collectionContainer}>
                <div className={styles.breadCrumbContent}>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/">Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <p>Collections</p>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <p>{collection.display_name || "Unknown"}</p>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div
                    className={styles.heroSection}
                    style={{
                        backgroundImage: `url("${
                            collection?.background_url ||
                            DEFAULT_COLLECTION_BACKGROUND
                        }")`,
                    }}
                >
                    <div className={styles.heroContent}>
                        <h1>{`${
                            collection.display_name ||
                            DEFAULT_COLLECTION_DISPLAY_NAME
                        }`}</h1>
                        <h2>{collection.sub_heading || ""}</h2>
                    </div>
                </div>
                <div className={styles.collectionContent}>
                    <div className={styles.imagesContainer}>
                        {pages && <ImagesGrid pages={pages} />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
