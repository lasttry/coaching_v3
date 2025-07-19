// middleware.ts

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for API routes, static files, and auth routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('/auth/')
  ) {
    return NextResponse.next();
  }

  // Apply internationalization middleware first
  const intlResponse = intlMiddleware(request);
  
  // Get session for club routing logic
  const session = await auth();
  
  // If user is not authenticated, let next-intl handle the routing
  if (!session?.user) {
    return intlResponse;
  }

  // Extract locale from pathname
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.substring(locale.length + 1);

  // Club-specific routing logic
  if (pathWithoutLocale.startsWith('/dashboard')) {
    // If user is not ADMIN and trying to access dashboard without club context
    if (session.user.role !== 'ADMIN' && !request.nextUrl.searchParams.has('clubId')) {
      // Check if user has a default club or needs to select one
      // This will be handled by the dashboard page itself
      return intlResponse;
    }
  }

  // Admin-only routes
  if (
    (pathWithoutLocale.startsWith('/dashboard/clubs') || 
     pathWithoutLocale.startsWith('/dashboard/users')) &&
    session.user.role !== 'ADMIN'
  ) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};