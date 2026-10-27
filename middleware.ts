import { auth } from '@/lib/auth';

// PricePilot is browsable without an account (see README). Middleware only
// keeps already-signed-in users away from the auth screen; it must not gate
// the rest of the site.
export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  // `req.auth` can be an error payload (e.g. the string "Bad request.") when
  // the session cannot be decoded, which is truthy. Only a real session that
  // carries a user counts as signed in.
  const isSignedIn = Boolean(req.auth?.user);

  if (isSignedIn && isAuthPage) {
    return Response.redirect(new URL('/', req.nextUrl));
  }
});

export const config = {
  matcher: ['/auth'],
};
