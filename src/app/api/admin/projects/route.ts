import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { featureProject, deleteProject, logAdminAction } from "@/lib/admin-helpers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await requireAdmin();

    const projects = await prisma.project.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { projectId, action, value } = body;

    if (!projectId || !action) {
      return NextResponse.json(
        { error: "projectId and action are required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "feature":
        result = await featureProject(projectId, value);
        break;
      case "delete":
        result = await deleteProject(projectId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      action,
      "project",
      projectId,
      { value }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}
