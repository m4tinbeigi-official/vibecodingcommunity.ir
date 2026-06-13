import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createResource,
  updateResource,
  deleteResource,
  featureResource,
  logAdminAction,
} from "@/lib/admin-helpers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await requireAdmin();

    const resources = await prisma.resource.findMany({
      include: {
        author: {
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

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();

    const result = await createResource(body);

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      "create",
      "resource",
      result.id,
      body
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await updateResource(id, body);

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      "update",
      "resource",
      id,
      body
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { resourceId, action, value, ...data } = body;

    if (!resourceId || !action) {
      return NextResponse.json(
        { error: "resourceId and action are required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "update":
        result = await updateResource(resourceId, data);
        break;
      case "feature":
        result = await featureResource(resourceId, value);
        break;
      case "delete":
        result = await deleteResource(resourceId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      action,
      "resource",
      resourceId,
      { value, data }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}
