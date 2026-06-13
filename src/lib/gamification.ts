import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Points configuration
export const POINTS = {
  COMPLETE_PROFILE: 50,
  ADD_FIRST_PROJECT: 100,
  JOIN_CHALLENGE: 80,
  WIN_CHALLENGE: 300,
  ATTEND_EVENT: 50,
  SPEAK_EVENT: 200,
  PROJECT_UPVOTE: 10,
  INVITE_MEMBER: 50,
  ADD_RESOURCE: 40,
} as const;

// Levels configuration
export const LEVELS = [
  { level: 1, name: "تازه‌وارد", points: 0 },
  { level: 2, name: "سازنده", points: 100 },
  { level: 3, name: "دموکننده", points: 300 },
  { level: 4, name: "فعال جامعه", points: 600 },
  { level: 5, name: "منتور", points: 1000 },
  { level: 6, name: "لیدر جامعه", points: 1500 },
] as const;

// Badges configuration
export const BADGES = [
  {
    slug: "first-project",
    name: "اولین پروژه",
    nameEn: "First Project",
    description: "اولین پروژه خود را در جامعه منتشر کرده",
    icon: "🚀",
    requiredPoints: 0,
    category: "achievement",
  },
  {
    slug: "mvp-builder",
    name: "سازنده MVP",
    nameEn: "MVP Builder",
    description: "ساخت یک MVP کامل",
    icon: "🏆",
    requiredPoints: 0,
    category: "achievement",
  },
  {
    slug: "active-member",
    name: "عضو فعال",
    nameEn: "Active Member",
    description: "مشارکت فعال در جامعه",
    icon: "⭐",
    requiredPoints: 200,
    category: "community",
  },
  {
    slug: "challenge-winner",
    name: "برنده چالش",
    nameEn: "Challenge Winner",
    description: "برنده شدن در یک چالش",
    icon: "🥇",
    requiredPoints: 0,
    category: "achievement",
  },
  {
    slug: "mentor",
    name: "منتور جامعه",
    nameEn: "Community Mentor",
    description: "کمک به اعضای دیگر جامعه",
    icon: "🤝",
    requiredPoints: 500,
    category: "community",
  },
  {
    slug: "speaker",
    name: "سخنران رویداد",
    nameEn: "Event Speaker",
    description: "سخنرانی در یک رویداد",
    icon: "🎤",
    requiredPoints: 0,
    category: "achievement",
  },
  {
    slug: "ai-automation-expert",
    name: "متخصص AI Automation",
    nameEn: "AI Automation Expert",
    description: "متخصص در اتوماسیون با هوش مصنوعی",
    icon: "🤖",
    requiredPoints: 300,
    category: "skill",
  },
  {
    slug: "no-code-expert",
    name: "متخصص No-code",
    nameEn: "No-code Expert",
    description: "متخصص در ابزارهای No-code",
    icon: "🛠️",
    requiredPoints: 300,
    category: "skill",
  },
  {
    slug: "fullstack-expert",
    name: "متخصص Full-stack",
    nameEn: "Full-stack Expert",
    description: "متخصص توسعه Full-stack",
    icon: "💻",
    requiredPoints: 400,
    category: "skill",
  },
  {
    slug: "vibe-builder",
    name: "Vibe Builder",
    nameEn: "Vibe Builder",
    description: "سازنده اصلی جامعه Vibe",
    icon: "🌟",
    requiredPoints: 1000,
    category: "community",
  },
] as const;

// Award points to user
export async function awardPoints(
  userId: string,
  action: string,
  points: number,
  metadata?: any
) {
  // Update user points
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  if (user.suspended) {
    console.log(`Skipping points for suspended user ${userId}`);
    return;
  }

  const newPoints = user.points + points;
  const newLevel = calculateLevel(newPoints);

  await prisma.user.update({
    where: { id: userId },
    data: {
      points: newPoints,
      level: newLevel,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      points,
      metadata: metadata || {},
    },
  });

  // Check for new badges
  await checkAndAwardBadges(userId, newPoints);
}

// Calculate level based on points
export function calculateLevel(points: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].points) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

// Get level name
export function getLevelName(level: number): string {
  const levelData = LEVELS.find((l) => l.level === level);
  return levelData?.name || "تازه‌وارد";
}

// Check and award badges
export async function checkAndAwardBadges(userId: string, points: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: {
        include: {
          badge: true,
        },
      },
    },
  });

  if (!user) return;

  const existingBadgeIds = user.badges.map((ub) => ub.badgeId);

  // Get all badges once to avoid duplicate queries
  const allBadges = await prisma.badge.findMany();

  for (const badgeConfig of BADGES) {
    const existingBadge = allBadges.find(b => b.slug === badgeConfig.slug);

    if (!existingBadge) continue;
    if (existingBadgeIds.includes(existingBadge.id)) continue;

    // Check if user qualifies for badge
    let qualifies = false;

    if (badgeConfig.requiredPoints > 0 && points >= badgeConfig.requiredPoints) {
      qualifies = true;
    }

    // Special badges that require specific actions
    if (badgeConfig.slug === "first-project") {
      const projectCount = await prisma.project.count({
        where: { ownerId: userId },
      });
      if (projectCount >= 1) qualifies = true;
    }

    if (badgeConfig.slug === "mvp-builder") {
      const mvpProjects = await prisma.project.count({
        where: {
          ownerId: userId,
          status: "mvp",
        },
      });
      if (mvpProjects >= 1) qualifies = true;
    }

    if (badgeConfig.slug === "challenge-winner") {
      const winningSubmissions = await prisma.challengeSubmission.count({
        where: {
          userId,
          // @ts-ignore
          isWinner: true,
        },
      });
      if (winningSubmissions >= 1) qualifies = true;
    }

    if (badgeConfig.slug === "speaker") {
      const speakingEvents = await prisma.eventRegistration.count({
        where: {
          userId,
          // @ts-ignore
          isSpeaker: true,
        },
      });
      if (speakingEvents >= 1) qualifies = true;
    }

    // Award badge if qualifies - use upsert to prevent duplicates
    if (qualifies) {
      await prisma.userBadge.upsert({
        where: {
          userId_badgeId: {
            userId,
            badgeId: existingBadge.id,
          },
        },
        create: {
          userId,
          badgeId: existingBadge.id,
        },
        update: {}, // Do nothing if already exists
      });
    }
  }
}

// Initialize badges in database
export async function initializeBadges() {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: {
        slug: badge.slug,
        name: badge.name,
        nameEn: badge.nameEn,
        description: badge.description,
        icon: badge.icon,
        requiredPoints: badge.requiredPoints,
        category: badge.category,
      },
    });
  }
}
