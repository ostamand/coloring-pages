import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://coloritdaily.com"),
    title: {
        default: "Color It Daily | Free Coloring Pages",
        template: "%s | Color It Daily",
    },
    description:
        "Download and print free coloring pages for kids and adults. New coloring pages added daily! Join our community and start coloring today.",
    keywords: [
        "coloring pages",
        "free coloring pages",
        "printable coloring pages",
        "kids coloring pages",
        "adult coloring pages",
        "daily coloring pages",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://coloritdaily.com",
        siteName: "Color It Daily",
        images: [
            {
                url: "/Logo_ColorItDaily.png",
                width: 1200,
                height: 630,
                alt: "Color It Daily",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@coloritdaily",
        creator: "@coloritdaily",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <link rel="icon" href="/favicon.png" sizes="any" type="image/png" />
            <link rel="shortcut icon" href="/favicon.png" />
            <body className={`${outfit.className} antialiased`}>
                {children}
                {/* disable umami tracking: localStorage.setItem("umami.disabled", "true") */}
                <Script
                    src="https://umami-analytics-453586259507.us-central1.run.app/script.js"
                    data-website-id="0cbab402-a8ed-4da7-a27a-fd0301eb1eb6"
                    strategy="lazyOnload"
                />
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-16721039369"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'AW-16721039369');
                    `}
                </Script>
            </body>
        </html>
    );
}
