import { NextResponse } from "next/server";

export async function GET() {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/pages/count`;
        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json({
                status: response.status,
                error: response.statusText,
            }, { status: response.status });
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            error: "Internal server error.",
        }, {
            status: 500,
        });
    }
}
