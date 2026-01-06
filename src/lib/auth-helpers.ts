import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "./prisma";
import { verifySessionToken } from "./auth";

export type UserRole = "SUPERADMIN" | "ADMIN" | "MANAGER";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-here"
);

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();

    // Primary: legacy auth-token JWT
    const jwtToken = cookieStore.get("auth-token")?.value;
    if (jwtToken) {
      const { payload } = await jwtVerify(jwtToken, JWT_SECRET);
      return payload as unknown as SessionUser;
    }

    // Fallback: HMAC session token used by current login flow
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) return null;

    const payload = await verifySessionToken(sessionToken);
    if (!payload) return null;

    // Fetch user to enrich role/name/email if available
    const user = await prisma.user.findUnique({
      where: { id: payload.uid },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      return {
        id: payload.uid,
        email: "",
        name: "",
        role: "ADMIN",
      };
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function hasRole(user: SessionUser, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(user.role);
}

export function isSuperAdmin(user: SessionUser): boolean {
  return user.role === "SUPERADMIN";
}

export function canManageUsers(user: SessionUser): boolean {
  return user.role === "SUPERADMIN";
}

export function canManageContent(user: SessionUser): boolean {
  return user.role === "SUPERADMIN" || user.role === "ADMIN";
}

export function canViewContent(user: SessionUser): boolean {
  return true; // All roles can view
}

// Response helpers for API routes
export function unauthorizedResponse(message = "Unauthorized") {
  return Response.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden - Insufficient permissions") {
  return Response.json({ error: message }, { status: 403 });
}
