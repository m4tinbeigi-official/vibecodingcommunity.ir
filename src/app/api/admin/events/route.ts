import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createEvent,
  updateEvent,
  closeEventRegistration,
  logAdminAction,
} from "@/lib/admin-helpers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await requireAdmin();

    const events = await prisma.event.findMany({
      orderBy: {
        date: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();

    const result = await createEvent(body);

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      "create",
      "event",
      result.id,
      body
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
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
    const result = await updateEvent(id, body);

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      "update",
      "event",
      id,
      body
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { eventId, action, ...data } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId is required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "update":
        result = await updateEvent(eventId, data);
        break;
      case "close":
        result = await closeEventRegistration(eventId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      action,
      "event",
      eventId,
      data
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
