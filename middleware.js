import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // Allow auth endpoints and public auth pages
  if (pathname.startsWith('/api/auth')) return NextResponse.next();
  if (pathname === '/login' || pathname === '/register') return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Admin protection
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // User-protected pages
  const isLibrary = pathname === '/library' || pathname.startsWith('/library/');
  const isEbookContent = pathname.startsWith('/ebooks/') && pathname.endsWith('/content');

  if ((isLibrary || isEbookContent) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname + (search || ''));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/library/:path*', '/ebooks/:path*/content', '/profile/:path*']
};
