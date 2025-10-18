import { Outfit } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

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
                    src="https://umami-analytics-585499903514.us-central1.run.app/script.js"
                    data-website-id="b7da117a-91f9-4444-b8ca-9fc3d5eb4fca"
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
