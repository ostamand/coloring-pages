"use client";

import { useRef, useState, useCallback } from "react";

export const usePrinter = () => {
    const printRef = useRef<HTMLIFrameElement | null>(null);
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);

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

    const handlePrint = useCallback(
        (pageId: number, fileUrl: string) => {
            setIframeSrc(`/api/proxy-file?url=${encodeURIComponent(fileUrl)}`);

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
                                if (window.umami) {
                                    window.umami.track("print", {
                                        pageId: pageId.toString(),
                                        url: window.location.href,
                                    });
                                }
                            } catch (error) {
                                console.error("Print failed", error);
                            }
                        }, 300);
                    }
                } else {
                    if (attempts < MAX_RETRIES) {
                        attempts++;
                    } else {
                        clearInterval(interval);
                        setIframeSrc(null);
                    }
                }
            }, REFRESH_RATE);
        },
        [waitForImageLoad]
    );

    const PrintIframe = iframeSrc ? (
        <iframe
            ref={printRef}
            src={iframeSrc}
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
    ) : null;

    return { handlePrint, PrintIframe };
};
