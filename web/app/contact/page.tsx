import styles from "./contact.styles.module.scss";

import { Metadata } from "next";

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
                <div className={styles.contactContent}>
                    <div className={styles.textContent}>
                        <h2>We'd love to hear from you!</h2>
                        <p>
                            Whether you have questions, feedback, or ideas for
                            new coloring pages, feel free to reach out to us.
                        </p>
                    </div>

                    <ContactForm />
                </div>
            </div>

            <Footer />
        </div>
    );
}
