import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export async function requireAdmin() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  // @ts-ignore - role is added in auth callback
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // Check if admin user is suspended
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { suspended: true },
  });

  if (user?.suspended) {
    redirect("/suspended");
  }

  return session;
}

export async function isAdmin() {
  const session = await getServerSession();

  if (!session || !session.user) {
    return false;
  }

  // @ts-ignore
  if (session.user.role !== "admin") {
    return false;
  }

  // Check if admin user is suspended
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { suspended: true },
  });

  return !user?.suspended;
}

export async function requireUser() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Check if user is suspended
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { suspended: true },
  });

  if (user?.suspended) {
    redirect("/suspended");
  }

  return session;
}
