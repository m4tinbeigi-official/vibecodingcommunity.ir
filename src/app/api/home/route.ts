import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get featured events (upcoming and recent past)
    const upcomingEvents = await prisma.event.findMany({
      where: {
        status: { in: ["upcoming", "active"] },
        date: { gte: new Date() },
      },
      orderBy: { date: "asc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        date: true,
        type: true,
        status: true,
      },
    });

    const pastEvents = await prisma.event.findMany({
      where: {
        status: "completed",
      },
      orderBy: { date: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        date: true,
        type: true,
      },
    });

    // Get recent activities
    const recentActivities = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            points: true,
            level: true,
          },
        },
      },
    });

    // Get featured members
    const featuredMembers = await prisma.user.findMany({
      where: {
        featured: true,
        suspended: false,
      },
      take: 6,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        points: true,
        level: true,
        featured: true,
      },
    });

    // Get top projects
    const topProjects = await prisma.project.findMany({
      where: {
        status: { in: ["completed", "mvp"] },
      },
      orderBy: { upvotesCount: "desc" },
      take: 6,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Mock blog posts (placeholder for now)
    const blogPosts = [
      {
        id: "1",
        title: "چطور با Next.js 14 شروع کنیم؟",
        excerpt: "راهنمای کامل برای شروع با Next.js 14 و App Router",
        date: "1403/04/15",
        author: "علی محمدی",
        readTime: "۵ دقیقه",
      },
      {
        id: "2",
        title: "بهترین پرکتیس‌های TypeScript در 2024",
        excerpt: "پرکتیس‌هایی که هر برنامه‌نویس TypeScript باید بداند",
        date: "1403/04/10",
        author: "سارا احمدی",
        readTime: "۷ دقیقه",
      },
      {
        id: "3",
        title: "ساخت API با Prisma و PostgreSQL",
        excerpt: "راهنمای قدم به قدم برای ساخت یک RESTful API",
        date: "1403/04/05",
        author: "محمد رضایی",
        readTime: "۱۰ دقیقه",
      },
    ];

    return NextResponse.json({
      upcomingEvents,
      pastEvents,
      recentActivities,
      featuredMembers,
      topProjects,
      blogPosts,
    });
  } catch (error) {
    console.error("Error fetching home data:", error);
    return NextResponse.json(
      { error: "Failed to fetch home data" },
      { status: 500 }
    );
  }
}
