import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, Package, ShoppingBag, Clock, TrendingUp, ArrowLeft } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import {
  computeStats,
  ordersByStatus,
  revenueLast7Days,
  recentOrders,
} from "@/lib/analytics";
import { StatusBadge } from "@/admin/components/StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PIE_COLORS = [
  "oklch(0.75 0.16 85)",
  "oklch(0.55 0.14 200)",
  "oklch(0.6 0.15 280)",
  "oklch(0.5 0.12 260)",
  "oklch(0.5 0.11 145)",
  "oklch(0.55 0.15 25)",
];

export function DashboardPage() {
  const { orders } = useStore();
  const stats = computeStats(orders);
  const statusData = ordersByStatus(orders).filter((s) => s.count > 0);
  const chartData = revenueLast7Days(orders);
  const recent = recentOrders(orders);

  const statCards = [
    {
      label: "إجمالي الطلبات",
      value: stats.totalOrders,
      icon: ShoppingBag,
      sub: `${stats.todayOrders} اليوم`,
    },
    {
      label: "إجمالي الإيرادات",
      value: `${stats.totalRevenue.toLocaleString("ar-EG")} ج`,
      icon: DollarSign,
      sub: `${stats.todayRevenue.toLocaleString("ar-EG")} ج اليوم`,
    },
    {
      label: "قيد الانتظار",
      value: stats.pendingCount,
      icon: Clock,
      sub: "تحتاج متابعة",
    },
    {
      label: "متوسط قيمة الطلب",
      value: `${stats.averageOrderValue.toLocaleString("ar-EG")} ج`,
      icon: TrendingUp,
      sub: `${stats.deliveredCount} تم التسليم`,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, sub }) => (
          <Card key={label}>
            <CardContent className="flex items-start justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 font-display text-2xl font-black text-forest-deep">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/10 text-forest">
                <Icon className="h-5 w-5" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">الإيرادات — آخر 7 أيام</CardTitle>
            <CardDescription>طلبات غير ملغاة</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "الإيرادات", color: "oklch(0.42 0.11 148)" },
              }}
              className="h-[260px] w-full"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="oklch(0.42 0.11 148)" radius={[6, 6, 0, 0]} name="الإيرادات" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">حالة الطلبات</CardTitle>
            <CardDescription>توزيع حسب الحالة</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">لا توجد طلبات بعد</p>
            ) : (
              <ChartContainer config={{ count: { label: "العدد" } }} className="mx-auto h-[260px] w-full max-w-[280px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={statusData} dataKey="count" nameKey="label" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-right">
            <CardTitle className="font-display">أحدث الطلبات</CardTitle>
            <CardDescription>آخر 8 طلبات واردة</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
            <Link to="/admin/orders">
              كل الطلبات
              <ArrowLeft className="mr-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <Package className="h-10 w-10 opacity-40" />
              <p className="text-sm">لم تُسجَّل طلبات بعد من صفحة الهبوط</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {recent.map((o) => (
                  <div
                    key={o.id}
                    className="rounded-xl border bg-card p-3 text-right shadow-sm"
                  >
                    <div className="flex flex-row-reverse items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-bold text-forest">{o.orderNumber}</p>
                        <p className="mt-1 font-medium">{o.customerName}</p>
                      </div>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-2 flex flex-row-reverse items-center justify-between text-sm">
                      <span className="font-display font-black text-forest">
                        {o.total.toLocaleString("ar-EG")} ج
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(o.createdAt), "d MMM yyyy HH:mm", { locale: ar })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الرقم</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">{o.orderNumber}</TableCell>
                        <TableCell className="font-medium">{o.customerName}</TableCell>
                        <TableCell>{o.total.toLocaleString("ar-EG")} ج</TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(parseISO(o.createdAt), "d MMM yyyy HH:mm", { locale: ar })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
