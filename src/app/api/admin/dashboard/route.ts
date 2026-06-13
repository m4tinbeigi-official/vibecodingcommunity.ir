import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getDashboardStats,
  getLatestUsers,
  getLatestProjects,
  getTopMembers,
  getMostUpvotedProjects,
} from "@/lib/admin-helpers";

export async function GET() {
  try {
    await requireAdmin();

    const [stats, latestUsers, latestProjects, topMembers, mostUpvoted] =
      await Promise.all([
        getDashboardStats(),
        getLatestUsers(),
        getLatestProjects(),
        getTopMembers(),
        getMostUpvotedProjects(),
      ]);

    return NextResponse.json({
      stats,
      latestUsers,
      latestProjects,
      topMembers,
      mostUpvoted,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
