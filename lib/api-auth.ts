import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./auth";

/** Extract + verify token from cookie in API route handlers */
export async function requireAuth(req: NextRequest): Promise<TokenPayload | NextResponse> {
  const token = req.cookies.get("ypl-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return payload;
}

/** Check if user has required role */
export function requireRole(payload: TokenPayload, roles: string[]): NextResponse | null {
  if (!roles.includes(payload.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
