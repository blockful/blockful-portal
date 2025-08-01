import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Definir rotas protegidas
  const isEmployeePath = path.startsWith("/employee");
  const isAdminPath = path.startsWith("/admin");
  const isHomePath = path === "/";
  const isProtectedPath = isEmployeePath || isAdminPath || isHomePath;

  // Get the token using the correct configuration
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If trying to access a protected route without authentication
  if (isProtectedPath && !token) {
    // Store the original URL to redirect back after login
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

// Config to apply middleware to all protected routes
export const config = {
  matcher: ["/employee/:path*", "/admin/:path*", "/"],
};
