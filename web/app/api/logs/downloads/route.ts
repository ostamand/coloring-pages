import { NextRequest, NextResponse } from "next/server";

import { z } from "zod/v4";

const DownloadLog = z.object({
    pageId: z.number(),
    url: z.string(),
    actionType: z.enum(["download", "print"]),
});

function anonymizeIp(ip: string) {
    return ip.replace(/(\.\d+)$|((?<=::ffff:\d+\.\d+\.\d+)\.\d+$)/, ".xxx");
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    const downloadLog = DownloadLog.safeParse(data);
    if (!downloadLog.success) {
        return NextResponse.json({ error: downloadLog.error }, {
            status: 400,
        });
    }

    const xForwardedFor = req.headers.get("x-forwarded-for");
    const userAgent = req.headers.get("user-agent");
    const referrer = req.headers.get("referer") || "Direct";
    const clientIp = xForwardedFor?.split(",")[0]?.trim();

    const anonClientIp = clientIp ? anonymizeIp(clientIp) : null;

    const payload = {
        ...downloadLog.data,
        userAgent,
        referrer,
        ip: anonClientIp || "unknown",
    };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/logs/downloads`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            },
        );
        if (!response.ok) {
            throw new Error();
        }
    } catch (error) {
        const errorMessage = "Failed to save download log.";
        console.error(errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json(payload);
}
