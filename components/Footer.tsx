'use server';

import React from 'react';
import Link from 'next/link';

export async function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-100 bg-[#FDFBF7] dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Learn<span className="font-sans font-light text-zinc-400">VaultSpot</span>
            </Link>
            <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
              Curated digital bookstore and insightful blog covering Education, Wealth, Health, and Relationships. High-quality guides for life optimization.
            </p>
          </div>

          {/* Links Column */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Explore
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  { label: 'All Books', href: '/books' },
                  { label: 'Latest Articles', href: '/blog' },
                  { label: 'Our Story', href: '/about' },
                  { label: 'Get in Touch', href: '/contact' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Legal & Access
              </h3>
              <ul className="mt-4 space-y-2">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms & Conditions', href: '/terms' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
        
        {/* Copyright Footer */}
        <div className="mt-12 border-t border-zinc-200/50 pt-8 flex flex-col md:flex-row items-center justify-between dark:border-zinc-800">
          <p className="text-xs text-zinc-400">
            &copy; {currentYear} Learn Vault Spot. All rights reserved. Built for immediate action.
          </p>
          <div className="mt-4 md:mt-0 flex gap-4 text-xs text-zinc-400">
            <span>No Accounts Required</span>
            <span>•</span>
            <span>Instant Downloads</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
