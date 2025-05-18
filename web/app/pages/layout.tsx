import styles from "./pages.styles.module.scss";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";
import { Footer } from "@/components/footer/footer.component";
export default function DetailedPageLayouy({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.mainContainer}>
            <NavigationBar currentPage="Pages" />
            {children}
            <Footer />
        </div>
    );
}
