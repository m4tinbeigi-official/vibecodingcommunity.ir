import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get dashboard stats
export async function getDashboardStats() {
  const [
    totalUsers,
    newUsers,
    completedProfiles,
    totalProjects,
    totalChallenges,
    totalEvents,
    totalResources,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
    prisma.user.count({
      where: {
        onboardingCompleted: true,
      },
    }),
    prisma.project.count(),
    prisma.challenge.count(),
    prisma.event.count(),
    prisma.resource.count(),
  ]);

  return {
    totalUsers,
    newUsers,
    completedProfiles,
    totalProjects,
    totalChallenges,
    totalEvents,
    totalResources,
  };
}

// Get latest users
export async function getLatestUsers(limit = 10) {
  return prisma.user.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      email: true,
      phone: true,
      role: true,
      points: true,
      level: true,
      featured: true,
      suspended: true,
      createdAt: true,
    },
  });
}

// Get latest projects
export async function getLatestProjects(limit = 10) {
  return prisma.project.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
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
}

// Get top members
export async function getTopMembers(limit = 10) {
  return prisma.user.findMany({
    take: limit,
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
      featured: true,
    },
  });
}

// Get most upvoted projects
export async function getMostUpvotedProjects(limit = 10) {
  return prisma.project.findMany({
    take: limit,
    orderBy: {
      upvotesCount: "desc",
    },
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
}

// Search users
export async function searchUsers(query: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { displayName: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { phone: { contains: query } },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      email: true,
      phone: true,
      role: true,
      points: true,
      level: true,
      featured: true,
      suspended: true,
      createdAt: true,
    },
    take: 50,
  });
}

// Suspend user
export async function suspendUser(userId: string, suspended: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { suspended },
  });
}

// Change user role
export async function changeUserRole(userId: string, role: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

// Feature user
export async function featureUser(userId: string, featured: boolean) {
  return prisma.user.update({
    where: { id: userId },
    data: { featured },
  });
}

// Feature project
export async function featureProject(projectId: string, featured: boolean) {
  return prisma.project.update({
    where: { id: projectId },
    data: { featured },
  });
}

// Delete project
export async function deleteProject(projectId: string) {
  return prisma.project.delete({
    where: { id: projectId },
  });
}

// Close challenge
export async function closeChallenge(challengeId: string) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: { status: "completed" },
  });
}

// Create challenge
export async function createChallenge(data: any) {
  return prisma.challenge.create({
    data,
  });
}

// Update challenge
export async function updateChallenge(challengeId: string, data: any) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data,
  });
}

// Create event
export async function createEvent(data: any) {
  return prisma.event.create({
    data,
  });
}

// Update event
export async function updateEvent(eventId: string, data: any) {
  return prisma.event.update({
    where: { id: eventId },
    data,
  });
}

// Close event registration
export async function closeEventRegistration(eventId: string) {
  return prisma.event.update({
    where: { id: eventId },
    data: { status: "completed" },
  });
}

// Create resource
export async function createResource(data: any) {
  return prisma.resource.create({
    data,
  });
}

// Update resource
export async function updateResource(resourceId: string, data: any) {
  return prisma.resource.update({
    where: { id: resourceId },
    data,
  });
}

// Delete resource
export async function deleteResource(resourceId: string) {
  return prisma.resource.delete({
    where: { id: resourceId },
  });
}

// Feature resource
export async function featureResource(resourceId: string, featured: boolean) {
  return prisma.resource.update({
    where: { id: resourceId },
    data: { featured },
  });
}

// Get all badges
export async function getAllBadges() {
  return prisma.badge.findMany({
    include: {
      users: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          awardedAt: true,
        },
        orderBy: {
          awardedAt: "desc",
        },
        take: 10,
      },
    },
    orderBy: {
      requiredPoints: "asc",
    },
  });
}

// Assign badge to user
export async function assignBadgeToUser(userId: string, badgeId: string) {
  return prisma.userBadge.create({
    data: {
      userId,
      badgeId,
    },
  });
}

// Remove badge from user
export async function removeBadgeFromUser(userId: string, badgeId: string) {
  return prisma.userBadge.deleteMany({
    where: {
      userId,
      badgeId,
    },
  });
}

// Log admin action
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  metadata?: any
) {
  return prisma.adminActionLog.create({
    data: {
      adminId,
      action,
      targetType,
      targetId,
      metadata,
    },
  });
}

// Get recent admin actions
export async function getRecentAdminActions(limit = 20) {
  return prisma.adminActionLog.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      admin: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
}
