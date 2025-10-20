import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to login, register, and other guest pages
  if (pathname.startsWith('/dashboard/login') || 
      pathname.startsWith('/dashboard/register') || 
      pathname.startsWith('/dashboard/forgot-password')) {
    return NextResponse.next();
  }
  
  // Allow access to API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check for auth token in cookies
  const authToken = request.cookies.get('auth_token')?.value;
  
  if (pathname.startsWith('/dashboard/')) {
    if (!authToken) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL("/dashboard/login/v2", request.url));
    }
    // Token found, allow access (we'll verify it on the client side)
    return NextResponse.next();
  }
  
  // Redirect root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL("/dashboard/default", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/"
  ]
};
