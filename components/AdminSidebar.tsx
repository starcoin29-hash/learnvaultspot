'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ShoppingCart,
  Settings,
  LogOut,
  Home
} from 'lucide-react';
import { logoutAdmin } from '../actions/auth';
import { cn } from '../lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Books', href: '/admin/dashboard/books', icon: BookOpen },
    { label: 'Blog Posts', href: '/admin/dashboard/blog', icon: FileText },
    { label: 'Orders & Sales', href: '/admin/dashboard/orders', icon: ShoppingCart },
    { label: 'Settings & SEO', href: '/admin/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const res = await logoutAdmin();
      if (res.success) {
        router.push('/admin/login');
        router.refresh();
      } else {
        alert('Logout failed. Please try again.');
      }
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
        <Link href="/admin/dashboard" className="font-serif text-lg font-bold text-zinc-900 dark:text-zinc-50">
          Learn<span className="font-sans font-light text-zinc-400">Vault</span> <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'
              )}
            >
              <Icon className={cn('mr-3 h-4 w-4 flex-shrink-0', isActive ? 'text-current' : 'text-zinc-400 group-hover:text-zinc-500')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Links (Public Site & Logout) */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <Link
          href="/"
          target="_blank"
          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
        >
          <Home className="mr-3 h-4 w-4 text-zinc-400" />
          View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
