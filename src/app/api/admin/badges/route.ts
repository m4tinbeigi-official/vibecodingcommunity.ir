import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllBadges, removeBadgeFromUser, logAdminAction } from "@/lib/admin-helpers";
import { initializeBadges } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

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

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { badgeId, action, value } = body;

    if (!badgeId || !action) {
      return NextResponse.json(
        { error: "badgeId and action are required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "revoke":
        // value should be userId
        result = await removeBadgeFromUser(value, badgeId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      action,
      "badge",
      badgeId,
      { userId: value }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating badge:", error);
    return NextResponse.json(
      { error: "Failed to update badge" },
      { status: 500 }
    );
  }
}
