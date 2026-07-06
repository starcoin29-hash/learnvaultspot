import React from 'react';
import { getDashboardOverview } from '../../../actions/settings';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Badge } from '../../../components/Badge';
import { formatNumericDate } from '../../../utils/date';
import { DollarSign, ShoppingCart, Download, CircleDot, BookOpen } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const analytics = await getDashboardOverview();

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard Overview</h1>
        <p className="text-xs text-zinc-400">Real-time bookstore transaction analytics and files logging.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Gross Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none pb-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Gross Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              ₦{parseFloat(analytics.totalRevenue).toLocaleString()}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Aggregated payments confirmed via Flutterwave.</p>
          </CardContent>
        </Card>

        {/* Ebooks Sold */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none pb-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Completed Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {analytics.totalSales}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Successful guest ebook purchases.</p>
          </CardContent>
        </Card>

        {/* Downloads count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none pb-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {analytics.totalDownloads}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">Aggregated watermark PDF files streamed.</p>
          </CardContent>
        </Card>

      </div>

      {/* Recent Transactions List */}
      <Card>
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <CircleDot className="h-4 w-4 text-emerald-500 animate-pulse" />
            Recent Guest Purchases
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {analytics.orders.length === 0 ? (
            <div className="text-center py-12 text-sm text-zinc-400">
              No transactions logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 font-semibold">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Ebook Purchased</th>
                    <th className="p-4">Paid (NGN)</th>
                    <th className="p-4">TxRef</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Downloads</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {analytics.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="p-4">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">{order.customerName}</div>
                        <div className="text-[10px] text-zinc-400">{order.customerEmail}</div>
                      </td>
                      <td className="p-4 font-medium text-zinc-700 dark:text-zinc-300">
                        {order.book?.title || 'N/A'}
                      </td>
                      <td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">
                        ₦{parseFloat(order.amount).toLocaleString()}
                      </td>
                      <td className="p-4 text-[10px] font-mono text-zinc-400">
                        {order.paymentReference}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            order.status === 'completed'
                              ? 'success'
                              : order.status === 'pending'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-bold text-zinc-600 dark:text-zinc-400">
                        {order.downloadCount}
                      </td>
                      <td className="p-4 text-zinc-400">
                        {formatNumericDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
