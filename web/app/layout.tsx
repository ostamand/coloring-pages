import { Outfit } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <link rel="icon" href="/favicon.png" sizes="any" />
            <body className={`${outfit.className} antialiased`}>
                {children}
                {/* disable umami tracking: localStorage.setItem("umami.disabled", "true") */}
                <Script
                    src="https://analytics.ostamand.com/script.js"
                    data-website-id="af533c89-10ea-4f06-a17f-ebd190f0a7b9"
                    strategy="lazyOnload"
                />
            </body>
        </html>
    );
}
