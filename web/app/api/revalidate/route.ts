import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

const CACHE_TAG_RANDOM_PAGES = "random-pages-of-the-day";

export async function POST(req: NextRequest) {
    const { secret } = await req.json();
    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid revalidate key" }, {
            status: 401,
        });
    }
    try {
        await revalidatePath("/sitemap.xml");
        await revalidateTag(CACHE_TAG_RANDOM_PAGES);
        return NextResponse.json({ revalidated: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
