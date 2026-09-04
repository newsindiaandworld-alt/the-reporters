'use client';

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Bookmark, Menu, Plus, X } from "lucide-react";
import SearchDialog from "@/components/SearchDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import NavLink from "@/components/NavLink";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-navy-800 dark:bg-navy-950/90">
      <div className="mx-auto flex h-20 w-full max-w-6xl flex-nowrap items-center justify-between gap-4 px-4 md:h-24 md:gap-8">
        <Link
          href="/"
          aria-label="The Reporter's home"
          className="flex flex-shrink-0 items-center"
        >
          <img
            src="/logo.png"
            alt="The Reporter's"
            className="h-[35px] w-auto shrink-0 object-contain mix-blend-screen md:h-[45px]"
          />
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex md:items-center md:gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/category/politics">Politics</NavLink>
            <NavLink href="/category/tech">Tech</NavLink>
            <NavLink href="/category/sports">Sports</NavLink>
            <NavLink href="/category/editorial">Editorial Desk</NavLink>
          </div>
          <Link
            href="/studio"
            className="hidden flex-shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-brand-gold bg-brand-gold/10 px-3 py-1.5 text-xs font-semibold text-brand-gold transition-all duration-300 ease-out hover:bg-brand-gold hover:text-navy-950 dark:bg-transparent dark:border-[#B8934B] dark:text-[#B8934B] dark:hover:bg-[#B8934B] dark:hover:text-navy-950 sm:flex sm:px-3.5 sm:text-sm"
          >
            <Plus size={14} strokeWidth={2.5} />
            Submit News
          </Link>
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <form action="/search" method="GET" className="hidden md:block">
              <input
                type="text"
                name="q"
                placeholder="Search articles..."
                className="w-36 lg:w-52 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-gray-200 placeholder:text-neutral-500 focus:border-brand-gold focus:outline-none"
              />
            </form>
            <Link
              href="/bookmarks"
              aria-label="Saved"
              className="text-slate-600 transition-colors duration-300 ease-out hover:text-slate-900 dark:text-navy-300 dark:hover:text-white"
            >
              <Bookmark size={17} />
            </Link>
            <SearchDialog />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {session?.user ? (
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsAccountOpen((open) => !open)}
                aria-label="Account menu"
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-neutral-700 bg-neutral-800 text-sm font-semibold text-white"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name ?? "Account"} className="h-full w-full object-cover" />
                ) : (
                  (session.user.name ?? session.user.email ?? "?").charAt(0).toUpperCase()
                )}
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-800 bg-[#12141c] py-1 shadow-2xl z-50">
                  <Link
                    href="/settings"
                    onClick={() => setIsAccountOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Account Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAccountOpen(false);
                      signOut();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex-shrink-0 whitespace-nowrap rounded-full border border-neutral-600 px-4 py-1.5 text-sm text-gray-300 transition hover:bg-neutral-800"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsOpen((open) => !open)}
            className="block flex-shrink-0 text-slate-600 dark:text-navy-300 md:hidden"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#12141c]/95 backdrop-blur-md border-b border-neutral-800 z-50 shadow-2xl flex flex-col md:hidden">
          <form action="/search" method="GET" className="px-6 py-4 border-b border-neutral-800/50">
            <input
              type="text"
              name="q"
              placeholder="Search articles..."
              className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-gray-200 placeholder:text-neutral-500 focus:border-brand-gold focus:outline-none"
            />
          </form>
          <Link
            href="/studio"
            className="flex items-center gap-2 px-6 py-4 border-b border-neutral-800/50 text-lg font-semibold text-brand-gold hover:bg-white/5 transition-colors"
          >
            <Plus size={18} strokeWidth={2.5} />
            Submit News
          </Link>
          <Link
            href="/"
            className="px-6 py-4 border-b border-neutral-800/50 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/category/politics"
            className="px-6 py-4 border-b border-neutral-800/50 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Politics
          </Link>
          <Link
            href="/category/tech"
            className="px-6 py-4 border-b border-neutral-800/50 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Tech
          </Link>
          <Link
            href="/category/sports"
            className="px-6 py-4 border-b border-neutral-800/50 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Sports
          </Link>
          <Link
            href="/category/editorial"
            className="px-6 py-4 border-b border-neutral-800/50 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Editorial Desk
          </Link>
          <Link
            href="/bookmarks"
            className="px-6 py-4 border-b border-neutral-800/50 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Saved
          </Link>
          <div className="px-6 py-4 flex items-center gap-6 bg-black/20">
            <SearchDialog />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="px-6 py-4 border-t border-neutral-800/50">
            {session?.user ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                className="text-left text-sm font-medium text-gray-300 hover:text-white"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="inline-block rounded-full border border-neutral-600 px-4 py-1.5 text-sm text-gray-300 transition hover:bg-neutral-800"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
