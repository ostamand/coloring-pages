"use client";

import stylesButton from "../../styles/button.styles.module.scss";

import { Printer } from "lucide-react";
import { usePrinter } from "@/hooks/use-printer";

export default function PrintButton({
    pageId,
    fileUrl,
}: {
    pageId: number;
    fileUrl: string;
}) {
    const { handlePrint, PrintIframe } = usePrinter();

    return (
        <>
            <div
                className={stylesButton.actionButton}
                onClick={() => handlePrint(pageId, fileUrl)}
            >
                <Printer />
                Print
            </div>
            {PrintIframe}
        </>
    );
}
