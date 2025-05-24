import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "Missing 'url' query parameter." }, {
            status: 400,
        });
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch the file." }, {
                status: response.status,
            });
        }

        const contentType = response.headers.get("content-type") ||
            "application/octet-stream";

        return new NextResponse(response.body, {
            headers: {
                "Content-Type": contentType,
            },
        });
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ error: "Internal server error." }, {
            status: 500,
        });
    }
}
