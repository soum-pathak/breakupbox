import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import Credentials from 'next-auth/providers/credentials'
import { SupabaseAdapter } from '@auth/supabase-adapter'

// ─────────────────────────────────────────────────────────────────────────────
// Demo bypass — only active when DEMO_MODE=true is explicitly set.
// Set this in Vercel Preview environment only. NEVER in Production.
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_ACTIVE = process.env.DEMO_MODE === 'true'
const DEMO_EMAIL = 'demo@breakupbox.com'
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

const demoProvider = Credentials({
  id: 'demo',
  name: 'Demo',
  credentials: {},
  async authorize() {
    if (!DEMO_ACTIVE) return null

    // Upsert demo user row into Supabase so the adapter can find it
    const { getSupabaseAdmin } = await import('@/lib/supabase')
    const db = getSupabaseAdmin()

    await db.from('users').upsert(
      {
        id: DEMO_USER_ID,
        email: DEMO_EMAIL,
        name: 'Demo User',
        email_verified: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    await db.from('user_profiles').upsert(
      {
        id: DEMO_USER_ID,
        email: DEMO_EMAIL,
        tier: 'subscription', // Full access so every feature can be tested
      },
      { onConflict: 'id' }
    )

    return {
      id: DEMO_USER_ID,
      email: DEMO_EMAIL,
      name: 'Demo User',
      image: null,
    }
  },
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: process.env.EMAIL_FROM ?? 'noreply@breakupbox.app',
    }),
    // Demo provider is included in the list unconditionally so Next.js
    // doesn't tree-shake the import, but authorize() returns null unless
    // DEMO_MODE=true — so it's a no-op in production.
    demoProvider,
  ],
  session: { strategy: 'database' },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})

