import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <link rel="icon" href="/favicon.png" sizes="any" />
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
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
