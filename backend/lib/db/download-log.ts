import { Client } from "@db/postgres";

export type DownloadLog = {
    userAgent: string | null;
    referrer: string;
    ip: string;
    pageId: number;
    url: string;
    actionType: "download" | "print";
};

export async function addDownloadLog(
    db: Client,
    downloadLog: DownloadLog,
) {
    const { pageId, userAgent, referrer, ip, url, actionType } = downloadLog;
    const result = await db.queryArray(
        `
        INSERT INTO page_download_logs (page_id, user_agent, referrer, ip, url, action_type) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id;
        `,
        [pageId, userAgent, referrer, ip, url, actionType],
    );
    return result.rows[0][0] as number;
}
