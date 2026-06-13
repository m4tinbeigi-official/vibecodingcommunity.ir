import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { searchUsers, getLatestUsers, logAdminAction } from "@/lib/admin-helpers";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const users = query ? await searchUsers(query) : await getLatestUsers(50);

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { userId, action, value } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId and action are required" },
        { status: 400 }
      );
    }

    let result;
    let targetType = "user";

    switch (action) {
      case "suspend":
        result = await (
          await import("@/lib/admin-helpers")
        ).suspendUser(userId, value);
        break;
      case "changeRole":
        result = await (
          await import("@/lib/admin-helpers")
        ).changeUserRole(userId, value);
        break;
      case "feature":
        result = await (
          await import("@/lib/admin-helpers")
        ).featureUser(userId, value);
        break;
      case "assignBadge":
        result = await (
          await import("@/lib/admin-helpers")
        ).assignBadgeToUser(userId, value);
        targetType = "badge";
        break;
      case "removeBadge":
        result = await (
          await import("@/lib/admin-helpers")
        ).removeBadgeFromUser(userId, value);
        targetType = "badge";
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      action,
      targetType,
      userId,
      { value }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
