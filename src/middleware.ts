
// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// This is a basic middleware function.
// It currently does nothing and just passes the request along.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Optionally, you can define a config object to specify which paths
// the middleware should apply to. For now, it's empty,
// meaning it won't actively run on any specific paths unless configured.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * This effectively means it won't run on most common paths if left empty or
     * if you don't define specific paths above.
     * If you need middleware for specific paths, add them to the array above.
     * e.g. '/dashboard/:path*'
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)', // Example default matcher
  ],
};
