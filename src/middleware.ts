import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "archflow_token";

// Routes only accessible by admin
const ADMIN_PATHS = ["/dashboard", "/projects", "/calendar", "/map", "/report"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let session: { role?: string; projectId?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as unknown as { role?: string; projectId?: string };
    } catch {
      // invalid or expired token — treat as unauthenticated
    }
  }

  // Already authenticated users visiting /login → redirect to their area
  if (pathname === "/login") {
    if (session) return redirectByRole(session.role ?? "normal", request);
    return NextResponse.next();
  }

  // Protect admin routes
  const isAdminRoute = ADMIN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.role !== "admin") {
      return redirectByRole(session.role ?? "normal", request);
    }
  }

  return NextResponse.next();
}

function redirectByRole(role: string, request: NextRequest) {
  if (role === "client") return NextResponse.redirect(new URL("/portal", request.url));
  if (role === "admin") return NextResponse.redirect(new URL("/dashboard", request.url));
  // normal users → landing page
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
