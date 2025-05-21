import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    console.log("Requested Path:", req.nextUrl.pathname);
    const isMaintenance = process.env.MAINTENANCE === "true";
    if (isMaintenance) {
        const { pathname } = req.nextUrl;
        const isStaticAsset = pathname.startsWith("/_next") || // Next.js internal files
            pathname.startsWith("/favicon.ico") || // Favicon
            pathname.startsWith("/favicon.png") || // Alternative favicon
            pathname.startsWith("/static") || // Custom static files
            pathname.startsWith("/.well-known") || // Browser/validation files
            pathname.endsWith(".map") || // Source map files (for development)
            pathname.startsWith("/api") || // API routes
            pathname.startsWith("/beaver-maintenance.png");

        if (isStaticAsset) {
            return NextResponse.next();
        }

        if (pathname !== "/maintenance") {
            return NextResponse.redirect(new URL("/maintenance", req.url));
        }
    }
    return NextResponse.next();
}
