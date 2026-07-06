import React from 'react';
import { getAdminOrders } from '../../../../actions/settings';
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/Badge';
import { formatNumericDate } from '../../../../utils/date';
import { ShoppingBag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const ordersList = await getAdminOrders();

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-50">Transaction & Sales Logs</h1>
        <p className="text-xs text-zinc-400">View guest ebook purchases, verification references, and file download statistics.</p>
      </div>

      <Card>
        <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-zinc-400" />
            Complete Order Directory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {ordersList.length === 0 ? (
            <div className="text-center py-16 text-sm text-zinc-400">
              No transactions have been recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 font-semibold">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Ebook Purchased</th>
                    <th className="p-4">Amount Paid</th>
                    <th className="p-4">Payment Reference</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Downloads Count</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {ordersList.map((order) => (
                    <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30">
                      <td className="p-4">
                        <div className="font-semibold text-zinc-800 dark:text-zinc-200">{order.customerName}</div>
                        <div className="text-[10px] text-zinc-400">{order.customerEmail}</div>
                      </td>
                      <td className="p-4 font-medium text-zinc-700 dark:text-zinc-300">
                        {order.book?.title || 'Deleted Book'}
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
                      <td className="p-4 text-center">
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 px-2 py-0.5 rounded">
                          {order.downloadCount} downloads
                        </span>
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

// Add local mock ShoppingCart import reference if not exported from lucide
import { ShoppingCart } from 'lucide-react';
