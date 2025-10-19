"use client";

import styles from "./download-button.styles.module.scss";

import { Download } from "lucide-react";
import { useDownloader } from "@/lib/download";

export default function DownloadButton({
    pageId,
    fileUrl,
    name,
    text,
}: {
    pageId: number;
    fileUrl: string;
    name: string;
    text?: string;
}) {
    const { handleDownload } = useDownloader();

    return (
        <div
            className={styles.downloadButton}
            onClick={() => handleDownload(pageId, fileUrl, name)}
        >
            <Download />
            {text || "Download"}
        </div>
    );
}
