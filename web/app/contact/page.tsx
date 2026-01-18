import styles from "./contact.styles.module.scss";

import { Metadata } from "next";
import Link from "next/link";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import ContactForm from "@/components/contact-form/contact-form.component";

const title = "Contact Us | Color It Daily";
const url = "https://coloritdaily.com/contact";
const description =
    "Have questions or feedback? Contact us at Color It Daily. We'd love to hear from you!";
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

export default function ContactPage() {
    return (
        <div className={styles.mainContainer}>
            <NavigationBar currentPage="Contact" />

            <div className={styles.contactContainer}>
                <div className={styles.backgroundBlur} />
                <div className={styles.contentWrapper}>
                    <div className={styles.glassCard}>
                        <div className={styles.heading}>
                            <Link href="/">
                                <img
                                    src="/Visage_ColorItDaily.png"
                                    alt="Coloring Pages Logo"
                                    height="auto"
                                    width="200px"
                                />
                            </Link>
                        </div>

                        <div className={styles.textContent}>
                            <h2>We&apos;d love to hear from you!</h2>
                            <p>
                                Whether you have questions, feedback, or ideas for
                                new coloring pages, feel free to reach out to us.
                            </p>
                        </div>

                        <ContactForm />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
