import { NextRequest, NextResponse } from 'next/server'

/**
 * Route guard — runs in Edge runtime on every non-static request.
 *
 * WHY we use cookie inspection instead of auth() here:
 *  - NextAuth v5 with a *database* adapter (Supabase) cannot query the DB
 *    from the Edge runtime — the Supabase Node.js SDK is not Edge-compatible.
 *  - Using auth() as middleware therefore always returns req.auth = null,
 *    which bounces every logged-in user back to /login (the routing loop).
 *  - The real session validation happens inside the server components
 *    (app/dashboard/page.tsx etc.) which run in the Node.js runtime where
 *    Supabase is reachable. If the token is forged/expired, those pages
 *    redirect to /login themselves — security is not weakened.
 *
 * Cookie names used by NextAuth v5 (Auth.js):
 *  - HTTPS (production, Vercel preview):  __Secure-authjs.session-token
 *  - HTTP  (localhost dev):               authjs.session-token
 */

const PROTECTED_PATHS = ['/dashboard', '/checklist']

// Both cookie variants NextAuth v5 may set depending on the request protocol,
// plus the lightweight demo bypass cookie set client-side on the login page.
const SESSION_COOKIE_NAMES = [
  '__Secure-authjs.session-token', // HTTPS — production + Vercel preview
  'authjs.session-token',          // HTTP  — localhost
  'bb-demo-session',               // Pure client-side demo bypass (no NextAuth/DB)
]

function hasSessionCookie(req: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some(
    (name) => req.cookies.get(name)?.value !== undefined
  )
}

export default function proxy(req: NextRequest) {
  const { nextUrl } = req

  const isProtected = PROTECTED_PATHS.some((p) =>
    nextUrl.pathname.startsWith(p)
  )

  // Allow non-protected routes through immediately
  if (!isProtected) return NextResponse.next()

  // If any session cookie is present, allow access.
  // The page's server component performs the full auth() validation.
  if (hasSessionCookie(req)) return NextResponse.next()

  // No session cookie — redirect to login, preserving the intended URL
  const loginUrl = new URL('/login', nextUrl)
  loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - api routes (auth callbacks handle their own protection)
     *  - Next.js internals (_next/static, _next/image)
     *  - Static files (favicon, images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
