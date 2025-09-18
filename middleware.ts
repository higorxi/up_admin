import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // Check if the request is for admin routes
  if (pathname.startsWith("/admin")) {
    // Check for auth token in cookies or headers
    const token =
      request.cookies.get("upconnection_admin_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "")

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // If accessing login page while authenticated, redirect to admin
  if (pathname === "/login") {
    const token = request.cookies.get("upconnection_admin_token")?.value
    if (token) {
      const adminUrl = new URL("/admin", request.url)
      return NextResponse.redirect(adminUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
}
