import styles from "./collections.styles.module.scss";

import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import ImagesGrid from "@/components/images-grid/images-grid.component";
import { Page, Collection } from "../../../lib/api/types";

const DEFAULT_COLLECTION_BACKGROUND = "/promotions/thick-lines.webp";
const DEFAULT_COLLECTION_DISPLAY_NAME = "Thick Lines";

async function getCollectionPages(collectionName: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages?collection=${collectionName}&random=true`
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
            `${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionName}`
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

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name: collectionName } = await params;

    const pages = await getCollectionPages(collectionName);
    const collection = await getCollection(collectionName);

    return (
        <div className={styles.mainContainer}>
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
                                <p>{collection?.display_name || "Unknown"}</p>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <h1>{`Collection: ${
                    collection?.display_name || DEFAULT_COLLECTION_DISPLAY_NAME
                }`}</h1>
                <div className={styles.collectionContent}>
                    <div
                        className={styles.promoBackground}
                        style={{
                            backgroundImage: `url("${
                                collection?.background_url ||
                                DEFAULT_COLLECTION_BACKGROUND
                            }")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center center",
                            backgroundSize: "cover",
                        }}
                    >
                        <div className={styles.backgroundOverlay} />
                    </div>

                    <div className={styles.imagesContainer}>
                        {pages && <ImagesGrid pages={pages} />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
