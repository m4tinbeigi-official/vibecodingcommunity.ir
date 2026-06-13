import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createChallenge,
  updateChallenge,
  closeChallenge,
  logAdminAction,
} from "@/lib/admin-helpers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await requireAdmin();

    const challenges = await prisma.challenge.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();

    const result = await createChallenge(body);

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      "create",
      "challenge",
      result.id,
      body
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error creating challenge:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const { challengeId, action, ...data } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: "challengeId is required" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "update":
        result = await updateChallenge(challengeId, data);
        break;
      case "close":
        result = await closeChallenge(challengeId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Log admin action
    await logAdminAction(
      // @ts-ignore
      session.user.id,
      action,
      "challenge",
      challengeId,
      data
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error updating challenge:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}
