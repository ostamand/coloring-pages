"use client";

import styles from "./download-button.styles.module.scss";

import { Download } from "lucide-react";

export default function DownloadButton({
    fileUrl,
    name,
    text,
}: {
    fileUrl: string;
    name: string;
    text?: string;
}) {
    const handleDownload = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/proxy?url=${fileUrl}`
        );
        if (!response.ok) {
            //TODO display error;
            return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        const fileExtension = fileUrl.split(".").pop() || "";
        const fileName = `${name}.${fileExtension}`;

        link.href = url;
        link.download = fileName;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className={styles.downloadButton} onClick={handleDownload}>
            <Download />
            {text || "Download"}
        </div>
    );
}
