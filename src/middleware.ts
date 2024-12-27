import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.pathname;

  if (!token) {
    if (url.startsWith('/api') && url !== '/api/auth/session') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized from middleware' },
        { status: 401 }
      );
    }

    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/book/:path*',
    '/api/user/:path*',
    '/input-profile',
    '/book-form',
    '/:username/:path',
    '/setting',
  ],
};
