import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    await requireAdmin();

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get various analytics data
    const [
      thisMonthUsers,
      lastMonthUsers,
      totalUsers,
      thisMonthProjects,
      lastMonthProjects,
      totalProjects,
      totalActivities,
      totalPointsAwarded,
      totalBadgesAwarded,
      adminActionsCount,
      userLevelDistribution,
      recentActivities,
    ] = await Promise.all([
      // User growth
      prisma.user.count({
        where: { createdAt: { gte: thisMonthStart } },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
      prisma.user.count(),

      // Project growth
      prisma.project.count({
        where: { createdAt: { gte: thisMonthStart } },
      }),
      prisma.project.count({
        where: {
          createdAt: {
            gte: lastMonthStart,
            lte: lastMonthEnd,
          },
        },
      }),
      prisma.project.count(),

      // Activity stats
      prisma.activityLog.count(),
      prisma.activityLog.aggregate({ _sum: { points: true } }),
      prisma.userBadge.count(),

      // Admin actions
      prisma.adminActionLog.count(),

      // Level distribution
      prisma.$queryRaw`
        SELECT level, COUNT(*) as count
        FROM "User"
        GROUP BY level
        ORDER BY level
      `,

      // Recent activities
      prisma.activityLog.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
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
      }),
    ]);

    // Format level names
    const levelNames: Record<number, string> = {
      1: "تازه‌وارد",
      2: "سازنده",
      3: "دموکننده",
      4: "فعال جامعه",
      5: "منتور",
      6: "لیدر جامعه",
    };

    const levelDistribution = (userLevelDistribution as any[]).map((lvl) => ({
      level: lvl.level,
      name: levelNames[lvl.level] || `سطح ${lvl.level}`,
      count: parseInt(lvl.count),
    }));

    // Get admin action breakdown
    const [userUpdates, projectUpdates] = await Promise.all([
      prisma.adminActionLog.count({ where: { targetType: "user" } }),
      prisma.adminActionLog.count({ where: { targetType: "project" } }),
    ]);

    return NextResponse.json({
      userGrowth: {
        thisMonth: thisMonthUsers,
        lastMonth: lastMonthUsers,
        total: totalUsers,
      },
      projectGrowth: {
        thisMonth: thisMonthProjects,
        lastMonth: lastMonthProjects,
        total: totalProjects,
      },
      activityStats: {
        totalActivities,
        totalPointsAwarded: totalPointsAwarded._sum.points || 0,
        totalBadgesAwarded,
        adminActions: adminActionsCount,
        userUpdates,
        projectUpdates,
      },
      levelDistribution,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
