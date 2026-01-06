"use server";

import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { buildAdminSession } from "@/lib/auth";

// REGISTER ACTION
export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const role = ((formData.get("role") as Role) || "EDITOR") as Role;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "User already exists" };

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, role, name },
  });

  return { success: "Account created successfully!" };
}

// LOGIN ACTION (ADMIN-ONLY)
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "No account found for this email." };

  const match = await bcrypt.compare(password, user.password);
  if (!match) return { error: "Incorrect password." };

  if (user.role !== "ADMIN") {
    return { error: "Only admin can log in here." };
  }

  const token = await buildAdminSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // 7 days
    maxAge: 60 * 60 * 24 * 7,
  });

  return { success: "Logged in successfully!" };
}
