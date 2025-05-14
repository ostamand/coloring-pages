import styles from "./home.styles.module.scss";

import Image from "next/image";
import { Download } from "lucide-react";

import NavigationBar from "@/components/navigation-bar/navigation-bar.components";

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <NavigationBar currentPage="home" />
      <div className={styles.featured}>
        <div className={styles.leftSection}>
          <h1>New Coloring Page</h1>
          <h2>Each day, a new coloring page. It's free, grab it!</h2>
          <div className={styles.downloadButton}>
            <Download />
            Download Image
          </div>
        </div>
        <div>
          <Image
            src="https://placehold.co/500x750"
            alt="Coloring Pages Logo"
            width={500}
            height={750}
            unoptimized
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
