'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { Heart, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:shadow-rose-500/40 transition-shadow">
            <Heart className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-white text-lg">BreakupBox</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Pricing
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-rose-400" />
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              id="nav-signin-btn"
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-700 transition-all"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/5 px-4 py-4 flex flex-col gap-4"
          style={{ background: 'rgba(10,10,15,0.95)' }}
        >
          <Link
            href="/pricing"
            className="text-zinc-400 text-sm hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-400 text-sm hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-zinc-400 text-sm text-left hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-rose-400 text-sm font-medium hover:text-rose-300 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
