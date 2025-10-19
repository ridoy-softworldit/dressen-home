"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrderProductLookup } from "@/hooks/useOrderProductLookup";
import type {
  CustomerInfo,
  IOrder,
  LineTotals,
  OrderLine,
} from "@/types/order";
import { statusLabel, toOrderLines, trackingNumber, ymd } from "@/utils/order";
import { Check } from "lucide-react";
import Image from "next/image";

export function OrderDetailsContent({
  order,
  onClose,
}: {
  order: IOrder;
  onClose: () => void;
}) {
  const lines: OrderLine[] = toOrderLines(order.orderInfo);

  // productId -> { title, image, price }
  const productMap = useOrderProductLookup(order);

  // show more control (many items)
  const [showAll, setShowAll] = useState(false);
  const VISIBLE = 8;
  const visibleLines = showAll ? lines : lines.slice(0, VISIBLE);
  const hasMore = lines.length > VISIBLE;

  // tracking + totals (prefer per-line totals; fallback to top-level number)
  const tracking = trackingNumber(order);
  const firstLineTotals: LineTotals | undefined = lines[0]?.totalAmount;
  const topLevelTotal =
    typeof order.totalAmount === "number" ? order.totalAmount : undefined;

  const customerAddress = useMemo(() => {
    const ci = order.customerInfo as CustomerInfo | string | undefined;
    if (ci && typeof ci === "object" && "address" in ci) {
      return ci.address;
    }
    return undefined;
  }, [order.customerInfo]);

  return (
    <>
      {/* Sticky header */}
      <div className="px-6 pt-6 pb-3 border-b bg-white sticky top-0 z-10">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold">
            Order Details - {order._id}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Check className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-600">
            {statusLabel(order)}
          </span>
          <span className="text-gray-500">• {ymd(order.createdAt)}</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="px-6 pb-6 max-h-[75svh] md:max-h-[80svh] overflow-y-auto">
        {/* Meta */}
        <div className="text-sm text-gray-600 mt-3">
          <div>Generated on: {ymd(order.createdAt)}</div>
          <div>Tracking Number: {tracking || "N/A"}</div>
        </div>

        {/* Items */}
        <div className="mt-5">
          <h3 className="font-medium text-gray-900 mb-3">Items</h3>
          <div className="space-y-3 relative">
            {visibleLines.map((item, idx) => {
              const pid =
                typeof item.productInfo === "string" ? item.productInfo : "";
              const pv = pid ? productMap[pid] : undefined;

              const imgSrc =
                pv?.image ??
                "/placeholder.svg"; /* backend না পেলে প্লেসহোল্ডার */

              const title = pv?.title ?? (pid ? `Product ${pid}` : "Product");

              return (
                <div
                  key={`${pid || "item"}-${idx}`}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                    <Image
                      src={imgSrc}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 48px, 56px"
                      unoptimized={imgSrc.startsWith("http")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity ?? 1}
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">
                    {item.totalAmount?.total ?? pv?.price ?? "-"}
                  </div>
                </div>
              );
            })}

            {/* Fade overlay before show more */}
            {!showAll && hasMore && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          {/* Show more / less */}
          {hasMore && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAll((s) => !s)}
              >
                {showAll ? "Show less" : `Show all items (${lines.length})`}
              </Button>
            </div>
          )}
        </div>

        {/* Totals grid */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Shipping Information
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-medium text-gray-900">
                {firstLineTotals?.shipping?.name ?? "N/A"}
              </div>
              <div>{customerAddress ?? lines[0]?.streetAddress ?? "N/A"}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Payment Information
            </h3>
            <div className="text-sm space-y-1">
              <div className="font-medium text-gray-900">N/A</div>
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{firstLineTotals?.subTotal ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span>{firstLineTotals?.shipping?.name ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>{firstLineTotals?.tax ?? "-"}</span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span>{firstLineTotals?.total ?? topLevelTotal ?? "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
            Buy Again
          </Button>
        </div>
      </div>
    </>
  );
}
