"use client";

import { redirect } from "next/navigation";

export default function AnalyticsRedirect() {
    redirect(process.env.NEXT_PUBLIC_ANALYTICS_URL || "/");
}
