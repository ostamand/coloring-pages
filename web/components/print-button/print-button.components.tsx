"use client";

import stylesButton from "../../styles/button.styles.module.scss";

import { useRef, useState } from "react";
import { Printer } from "lucide-react";

export default function PrintButton({
    pageId,
    fileUrl,
}: {
    pageId: number;
    fileUrl: string;
}) {
    const printRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeVisible, setIframeVisible] = useState(false);

    const handlePrint = async () => {
        setIframeVisible(true);

        const REFRESH_RATE = 100;
        const interval = setInterval(() => {
            //TODO add max timer?
            const iframe = printRef.current;

            if (iframe?.contentDocument?.readyState === "complete") {
                clearInterval(interval);

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
                    }`;

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

                setTimeout(() => setIframeVisible(false), 1000); // Cleanup iframe after printing
            }
        }, REFRESH_RATE);
    };

    return (
        <>
            <div className={stylesButton.actionButton} onClick={handlePrint}>
                <Printer />
                Print
            </div>
            {iframeVisible && (
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
                />
            )}
        </>
    );
}
