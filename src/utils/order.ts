// src/utils/order.ts
import type {
  CustomerInfo,
  IOrder,
  OrderInfo,
  OrderLine,
  LineTotals,
} from "@/types/order";

export const toOrderLines = (oi?: OrderInfo): OrderLine[] => {
  if (!oi) return [];
  return Array.isArray(oi) ? oi : [oi];
};

export const displayCustomer = (order: IOrder): string => {
  const raw = order.customerInfo;
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  const c = raw as CustomerInfo | undefined;
  if (!c) return "Customer";
  const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
  return name || c.email || "Customer";
};

export const statusLabel = (order: IOrder): string => {
  const lines = toOrderLines(order.orderInfo);
  const statuses = lines.map((l) => l.status).filter(Boolean);

  if (!statuses.length) return "Pending";
  if (statuses.every((s) => s === "completed")) return "Delivered";
  if (statuses.some((s) => s === "cancelled")) return "Cancelled";
  if (statuses.some((s) => s === "out-for-delivery")) return "Out for delivery";
  if (statuses.some((s) => s === "processing")) return "Processing";
  if (statuses.some((s) => s === "at-local-facility"))
    return "At local facility";
  return "Pending";
};

export const itemsCount = (order: IOrder): number =>
  toOrderLines(order.orderInfo).length;

export const orderTotal = (order: IOrder): number => {
  if (typeof order.totalAmount === "number") return order.totalAmount;
  const t = order.totalAmount as LineTotals | undefined;
  return t?.total ?? 0;
};

export const trackingNumber = (order: IOrder): string | undefined =>
  toOrderLines(order.orderInfo)[0]?.trackingNumber;

export const ymd = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isFinite(d.getTime())
    ? d.toISOString().slice(0, 10)
    : iso.slice(0, 10);
};

export const statusBadgeClass = (label: string): string => {
  switch (label.toLowerCase()) {
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "out for delivery":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "at local facility":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};
