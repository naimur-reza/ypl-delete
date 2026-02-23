import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/about", "/contact", "/services", "/jobs", "/job-seekers", "/employers", "/insights", "/careers"];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  // Allow public API GETs and static assets
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/images/") || pathname.startsWith("/logo")) return true;
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js)$/)) return true;
  // Public pages with dynamic segments
  if (pathname.startsWith("/jobs/")) return true;
  if (pathname.startsWith("/services/")) return true;
  if (pathname.startsWith("/insights/")) return true;
  if (pathname.startsWith("/careers/")) return true;
  // Public API reads (GET only handled at route level)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) return true;
  return false;
}

export default async function proxyRequest(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public paths
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("ypl-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("ypl-token");
      return res;
    }

    // Pass user info to server components via headers
    const headers = new Headers(req.headers);
    headers.set("x-user-id", payload.id);
    headers.set("x-user-role", payload.role);
    headers.set("x-user-name", payload.name);
    headers.set("x-user-email", payload.email);

    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
