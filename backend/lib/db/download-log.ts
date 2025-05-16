import { Client } from "@db/postgres";

export async function addDownloadLog(
    db: Client,
    options: {
        pageId: number;
        userAgent: string | null;
        referrer: string | null;
        ip: string | null;
    },
) {
    const { pageId, userAgent, referrer, ip } = options;

    const result = db.queryObject(
        `
        `,
        [],
    );
}
