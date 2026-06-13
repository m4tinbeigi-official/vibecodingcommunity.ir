import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // Get various analytics data
    const [
      userGrowth,
      projectGrowth,
      challengeStats,
      eventStats,
      resourceStats,
      topUsers,
      activityLogs,
    ] = await Promise.all([
      // User growth over time
      prisma.user.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Project growth over time
      prisma.project.groupBy({
        by: ["createdAt"],
        where: {
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Challenge statistics
      prisma.challenge.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          title: true,
          status: true,
          submissions: {
            select: {
              id: true,
            },
          },
        },
      }),

      // Event statistics
      prisma.event.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          title: true,
          status: true,
          registrations: {
            select: {
              id: true,
            },
          },
        },
      }),

      // Resource statistics
      prisma.resource.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          id: true,
          type: true,
          title: true,
          createdAt: true,
        },
      }),

      // Top users by points
      prisma.user.findMany({
        take: 20,
        orderBy: {
          points: "desc",
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          points: true,
          level: true,
        },
      }),

      // Recent activity
      prisma.activityLog.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      }),
    ]);

    return NextResponse.json({
      userGrowth,
      projectGrowth,
      challengeStats,
      eventStats,
      resourceStats,
      topUsers,
      activityLogs,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
