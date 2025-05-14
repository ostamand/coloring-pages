import styles from "./pages.styles.module.scss";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";

export default function DetailedPageLayouy({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={styles.mainContainer}>
            <NavigationBar currentPage="pages" />
            {children}
        </div>
    );
}
