import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// SchoolCity is currently waitlist-only. Keep the public root available and
// redirect every product route so direct URLs cannot bypass the launch gate.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
