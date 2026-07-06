import React from 'react';
import { AdminSidebar } from '../../../components/AdminSidebar';

export const dynamic = 'force-dynamic';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Workspace (Cleared for 64rem/16rem sidebar width) */}
      <main className="flex-1 pl-64 min-h-screen flex flex-col">
        <div className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
