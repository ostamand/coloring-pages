"use client";

import styles from "./download-button.styles.module.scss";

import { Download } from "lucide-react";

import { logDownload } from "@/lib/download";

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
    const handleDownload = async () => {
        try {
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
        } catch (error) {
            console.error(error);
        }

        // download successful, let's log it. no need to wait.
        fetch("/api/logs/downloads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pageId,
                url: window.location.href,
                actionType: "download",
            }),
        });
    };

    return (
        <div className={styles.downloadButton} onClick={handleDownload}>
            <Download />
            {text || "Download"}
        </div>
    );
}
