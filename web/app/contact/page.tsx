import styles from "./contact.styles.module.scss";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
import ContactForm from "@/components/contact-form/contact-form.component";

export default function ContactPage() {
    return (
        <div className={styles.mainContainer}>
            <NavigationBar currentPage="About" />
            <div className={styles.contactContainer}>
                <div className={styles.contactContent}>
                    <h1>Contact Us</h1>
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
