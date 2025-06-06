"use client";

import stylesButton from "../../styles/button.styles.module.scss";

import { useRef, useState, useCallback } from "react";
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

    const waitForImageLoad = useCallback(
        (contentDocument: Document): Promise<void> => {
            return new Promise((resolve) => {
                const img = contentDocument.querySelector("img");
                if (!img) {
                    resolve();
                    return;
                }
                if (img.complete && img.naturalHeight !== 0) {
                    setTimeout(() => resolve(), 300);
                } else {
                    img.onload = () => {
                        setTimeout(() => resolve(), 300);
                    };
                    img.onerror = () => resolve();
                    setTimeout(() => resolve(), 3000);
                }
            });
        },
        []
    );

    const handlePrint = async () => {
        setIframeVisible(true);

        const REFRESH_RATE = 100;
        const MAX_RETRIES = 3;
        let attempts = 0;

        const interval = setInterval(async () => {
            const iframe = printRef.current;

            if (iframe?.contentDocument?.readyState === "complete") {
                clearInterval(interval);

                const contentWindow = iframe.contentWindow;
                const contentDocument =
                    iframe.contentDocument || contentWindow?.document;

                if (contentDocument && contentWindow) {
                    await waitForImageLoad(contentDocument);

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
                                size: letter portrait;
                                margin: 0;
                            }
                        }
                    `;

                    contentDocument.head.appendChild(style);

                    contentWindow.focus();

                    setTimeout(() => {
                        try {
                            contentWindow.print();
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
                        } catch (error) {
                            console.error("Print failed", error);
                        }

                        // don't clear iframe, print fails on iOS (prints empty white page)
                        // setTimeout(() => setIframeVisible(false), 3000);
                    }, 300);
                }
            } else {
                if (attempts < MAX_RETRIES) {
                    attempts++;
                } else {
                    clearInterval(interval);
                    setIframeVisible(false);
                }
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
