"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { useGetAllOrdersQuery } from "@/redux/featured/order/orderApi";
import type { IOrder } from "@/types/order";
import {
  displayCustomer,
  statusLabel,
  itemsCount,
  orderTotal,
  ymd,
  statusBadgeClass,
} from "@/utils/order";
import { OrderDetailsContent } from "@/components/modules/OrderDetailsContent/OrderDetailsContent";


export default function MyOrdersTable() {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useGetAllOrdersQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // pagination (client-side)
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil((orders?.length ?? 0) / PAGE_SIZE));
  const paged = useMemo(
    () => (orders ?? []).slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [orders, page]
  );

  const handleViewOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  useEffect(() => {

    if (isError) console.error("❌ Orders API Error:", error);
  }, [orders, isError, error]);

  if (isLoading) return <p className="p-6 text-sm">Loading orders...</p>;
  if (isError)
    return (
      <p className="p-6 text-sm text-red-600">Error: {JSON.stringify(error)}</p>
    );

  return (
      <>
      {/* --- Table/Lite list wrapper --- */}
      <div className="w-full px-4 py-6 md:px-6">
        <div className="bg-white w-full max-w-6xl mx-auto rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">My Orders</h1>
          </div>

          {/* Mobile: Card list */}
          <div className="block md:hidden p-4 space-y-3">
            {paged.map((order) => {
              const name = displayCustomer(order);
              const status = statusLabel(order);
              const total = orderTotal(order);
              const count = itemsCount(order);
              return (
                <div
                  key={order._id}
                  className="rounded-lg border border-gray-200 p-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{name}</div>
                    <span
                      className={`text-xs rounded px-2 py-0.5 ${statusBadgeClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {ymd(order.createdAt)} • {count} item{count > 1 ? "s" : ""}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Total: {total}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <div className="px-6 py-4">
              <table className="w-full min-w-[860px]">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paged.map((order) => {
                    const name = displayCustomer(order);
                    const status = statusLabel(order);
                    const total = orderTotal(order);
                    const count = itemsCount(order);
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {name}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {ymd(order.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`text-xs rounded px-2 py-0.5 ${statusBadgeClass(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {total}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {count}
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-xs text-gray-600">
              Page {page} of {totalPages} • {orders?.length ?? 0} orders
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modal (responsive) --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="
            w-[calc(100vw-1rem)] 
            sm:w-full sm:max-w-lg 
            md:max-w-2xl 
            lg:max-w-4xl 
            p-0 sm:p-2 md:p-4
          "
        >
          {selectedOrder && (
            <OrderDetailsContent
              order={selectedOrder}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
