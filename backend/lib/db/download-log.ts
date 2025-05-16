import { Client } from "@db/postgres";

export type DownloadLog = {
    pageId: number;
    userAgent: string | null;
    referrer: string | null;
    ip: string | null;
    url: string | null;
};

export async function addDownloadLog(
    db: Client,
    downloadLog: DownloadLog,
) {
    const { pageId, userAgent, referrer, ip, url } = downloadLog;
    const result = await db.queryArray(
        `
        INSERT INTO page_download_logs (page_id, user_agent, referrer, ip, url) VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
        `,
        [pageId, userAgent, referrer, ip, url],
    );
    return result.rows[0][0] as number;
}
