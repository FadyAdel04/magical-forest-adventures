import { format, parseISO, startOfDay, subDays } from "date-fns";
import { ar } from "date-fns/locale";
import type { OrderRecord, OrderStatus } from "./types";
import { ORDER_STATUS_LABELS } from "./types";

export type DashboardStats = {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
  deliveredCount: number;
  averageOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
};

export function computeStats(orders: OrderRecord[]): DashboardStats {
  const today = startOfDay(new Date());
  const active = orders.filter((o) => o.status !== "cancelled");

  const todayOrders = orders.filter((o) => {
    const d = startOfDay(parseISO(o.createdAt));
    return d.getTime() === today.getTime();
  });

  const totalRevenue = active.reduce((s, o) => s + o.total, 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    pendingCount: orders.filter((o) => o.status === "pending").length,
    deliveredCount: orders.filter((o) => o.status === "delivered").length,
    averageOrderValue: active.length ? Math.round(totalRevenue / active.length) : 0,
    todayOrders: todayOrders.length,
    todayRevenue: todayOrders.reduce((s, o) => s + o.total, 0),
  };
}

export function ordersByStatus(orders: OrderRecord[]) {
  const counts = new Map<OrderStatus, number>();
  for (const o of orders) {
    counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
  }
  return (Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => ({
    status,
    label: ORDER_STATUS_LABELS[status],
    count: counts.get(status) ?? 0,
  }));
}

export function revenueLast7Days(orders: OrderRecord[]) {
  const days = Array.from({ length: 7 }, (_, i) => subDays(startOfDay(new Date()), 6 - i));

  return days.map((day) => {
    const key = format(day, "yyyy-MM-dd");
    const dayOrders = orders.filter((o) => {
      if (o.status === "cancelled") return false;
      return format(startOfDay(parseISO(o.createdAt)), "yyyy-MM-dd") === key;
    });
    return {
      date: key,
      label: format(day, "EEE d MMM", { locale: ar }),
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
    };
  });
}

export function recentOrders(orders: OrderRecord[], limit = 8) {
  return [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
