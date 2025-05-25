import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
    const { secret } = await req.json();
    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid revalidate key" }, {
            status: 401,
        });
    }
    try {
        await revalidatePath("/sitemap.xml");
        return NextResponse.json({ revalidated: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
