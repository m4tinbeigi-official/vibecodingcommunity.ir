import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllBadges } from "@/lib/admin-helpers";
import { initializeBadges } from "@/lib/gamification";

export async function GET() {
  try {
    await requireAdmin();

    // Make sure badges are initialized
    await initializeBadges();

    const badges = await getAllBadges();

    return NextResponse.json({ badges });
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
