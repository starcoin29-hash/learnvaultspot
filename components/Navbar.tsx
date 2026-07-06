'use server';

import React from 'react';
import Link from 'next/link';

export async function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-100/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/40 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-95"
          >
            Learn<span className="font-sans font-light text-zinc-400">VaultSpot</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Books', href: '/books' },
            { label: 'Blog', href: '/blog' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/books"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-900 px-4 text-xs font-semibold text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm"
          >
            Browse Ebooks
          </Link>
        </div>
      </div>
    </header>
  );
}
