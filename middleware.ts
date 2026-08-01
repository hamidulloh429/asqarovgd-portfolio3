import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "asqarovgd_session";

// Edge middleware only checks that a session cookie is present, for fast
// redirect UX. The real authorization check (JWT signature + expiry) runs
// server-side in every mutating API route handler — see src/lib/session.ts.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
