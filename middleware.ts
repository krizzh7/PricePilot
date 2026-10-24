import { auth } from '@/lib/auth';

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

  if (!isAuth && !isAuthPage) {
    return Response.redirect(new URL('/auth', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};