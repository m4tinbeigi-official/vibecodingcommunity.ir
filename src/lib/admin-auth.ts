import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  // @ts-ignore - role is added in auth callback
  if (session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  return session;
}

export async function isAdmin() {
  const session = await getServerSession();

  if (!session || !session.user) {
    return false;
  }

  // @ts-ignore
  return session.user.role === "admin";
}
