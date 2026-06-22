import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { awardPointsOnce, POINTS } from "@/lib/gamification";

// POST /api/admin/backfill-points
// Retroactively awards points (idempotent) for:
//  - every approved project   -> owner gets project_approved (100)
//  - every event registration -> attendee gets event_attended (50) for
//    completed events, otherwise event_registered (20)
// Safe to re-run: awardPointsOnce skips anything already recorded.
export async function POST() {
  try {
    await requireAdmin();

    const result = {
      projectsAwarded: 0,
      eventsAwarded: 0,
    };

    // Approved projects -> owners
    const approvedProjects = await prisma.project.findMany({
      where: { approved: true },
      select: { id: true, ownerId: true, title: true },
    });

    for (const project of approvedProjects) {
      if (!project.ownerId) continue;
      const awarded = await awardPointsOnce(
        project.ownerId,
        "project_approved",
        POINTS.APPROVE_PROJECT,
        "projectId",
        project.id,
        { projectTitle: project.title }
      );
      if (awarded) result.projectsAwarded++;
    }

    // Event registrations -> attendees
    const registrations = await prisma.eventRegistration.findMany({
      select: {
        userId: true,
        event: { select: { id: true, title: true, status: true } },
      },
    });

    for (const reg of registrations) {
      const isCompleted = reg.event.status === "completed";
      const awarded = await awardPointsOnce(
        reg.userId,
        isCompleted ? "event_attended" : "event_registered",
        isCompleted ? POINTS.ATTEND_EVENT : POINTS.REGISTER_EVENT,
        "eventId",
        reg.event.id,
        { eventTitle: reg.event.title }
      );
      if (awarded) result.eventsAwarded++;
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error backfilling points:", error);
    return NextResponse.json(
      { error: "Failed to backfill points" },
      { status: 500 }
    );
  }
}
