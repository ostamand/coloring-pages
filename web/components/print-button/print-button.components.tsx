"use client";

import stylesButton from "../../styles/button.styles.module.scss";

import { useRef } from "react";
import { Printer } from "lucide-react";

import { logDownload } from "@/lib/download";

export default function PrintButton({
    pageId,
    fileUrl,
}: {
    pageId: number;
    fileUrl: string;
}) {
    const printRef = useRef<HTMLIFrameElement | null>(null);

    const handlePrint = async () => {
        const iframe = printRef.current;

        if (iframe) {
            const contentWindow = iframe.contentWindow;
            const contentDocument =
                iframe.contentDocument || contentWindow?.document;

            if (contentDocument) {
                const style = document.createElement("style");
                style.textContent = `
                    @media print {
                        body {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        img {
                            display: block;
                            max-width: 100%;
                            height: auto;
                        }
                        @page {
                            size: A4 portrait;
                            margin: 0;
                        }
                    }
                `;

                contentDocument.head.appendChild(style);

                contentWindow?.focus();
                contentWindow?.print();

                // print successful, let's log it. no need to wait.
                fetch("/api/logs/downloads", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pageId,
                        url: window.location.href,
                        actionType: "print",
                    }),
                });
            }
        }
    };

    return (
        <>
            <div className={stylesButton.actionButton} onClick={handlePrint}>
                <Printer />
                Print
            </div>
            <iframe
                ref={printRef}
                src={`/api/proxy-file?url=${encodeURIComponent(fileUrl)}`}
                style={{ display: "none" }}
                title="Print Frame"
                onLoad={() => {
                    const iframe = printRef.current;
                    const contentDocument = iframe?.contentDocument;
                    if (contentDocument) {
                        const img = contentDocument.querySelector("img");
                        if (img) {
                            img.style.maxWidth = "100%";
                            img.style.height = "auto";
                            img.style.margin = "0 auto";
                            img.style.display = "block";
                        }
                    }
                }}
            ></iframe>
        </>
    );
}
