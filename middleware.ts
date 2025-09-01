import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/builder']; // Example protected routes
const authRoutes = ['/auth/signin', '/auth/signup'];

export function middleware(req: NextRequest) {
  const session = req.cookies.get('next-auth.session-token')
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  if (isAuthRoute && session) {
    // Redirect authenticated users away from auth routes
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (isProtectedRoute) {
    if (!session) {
      // Redirect unauthenticated users to the sign-in page
      return NextResponse.redirect(new URL('/auth/signin', req.nextUrl));
    }
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/profile', '/builder', '/auth/signin', '/auth/signup'],
};