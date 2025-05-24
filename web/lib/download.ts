export async function logDownload(pageId: number, url: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logs/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pageId,
            url,
        }),
    });
}
