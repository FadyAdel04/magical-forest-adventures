import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Search, Trash2, Eye, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { triggerCreateBostaOrder } from "@/services/bosta";
import { useStore } from "@/hooks/useStore";
import { deleteOrder, updateOrderStatus, refreshStore } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { AdminPageShell } from "@/admin/components/AdminPageShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ALL = "all";

export function OrdersPage() {
  const { orders } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== ALL && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.governorate.toLowerCase().includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  const handleStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      // Silently refresh from DB to pick up any Flextock status changes
      void refreshStore({ silent: true });
      toast.success("تم تحديث حالة الطلب");
    } catch {
      toast.error("تعذّر تحديث الحالة");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      setSelectedId(null);
      toast.success("تم حذف الطلب");
    } catch {
      toast.error("تعذّر حذف الطلب");
    }
  };

  const handleSyncBosta = async () => {
    // Bosta tracking is embedded in the delivery response at creation time.
    // A manual refresh from DB is all that is needed.
    toast.info("جاري تحديث بيانات الشحن...");
    try {
      await refreshStore({ silent: false });
      toast.success("تم تحديث حالات الشحن.");
    } catch {
      toast.error("تعذّر التحديث. حاول مرة أخرى.");
    }
  };

  const handleResendToBosta = async (id: string) => {
    toast.info("جاري الإرسال إلى Bosta...");
    try {
      await triggerCreateBostaOrder(id);
      await refreshStore({ silent: true });
      toast.success("تم إرسال الطلب إلى Bosta بنجاح.");
    } catch (err: any) {
      const msg = err?.message || "فشل الإرسال";
      toast.error(`فشل الإرسال: ${msg}`);
    }
  };

  return (
    <AdminPageShell
      title="إدارة الطلبات"
      description={`${orders.length} طلب إجمالاً`}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الطلب، الاسم، الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" onClick={handleSyncBosta} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              مزامنة الشحن
            </Button>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>كل الحالات</SelectItem>
                {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {ORDER_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">لا توجد طلبات مطابقة</p>
          ) : (
            <>
            <div className="space-y-3 lg:hidden">
              {filtered.map((o) => (
                <article
                  key={o.id}
                  className={`rounded-xl border p-4 text-right shadow-sm bg-card ${
                    o.status === "shipping_error"
                      ? "border-rose-200 bg-rose-50/20 dark:border-rose-900/30 dark:bg-rose-950/5"
                      : ""
                  }`}
                >
                  <div className="flex flex-row-reverse items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-forest">{o.orderNumber}</p>
                      <p className="mt-1 font-semibold">{o.customerName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground" dir="ltr">
                        {o.phone}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {!o.bostaOrderSent && (
                        <Button variant="ghost" size="icon" onClick={() => void handleResendToBosta(o.id)} title="إرسال إلى Bosta">
                          <Send className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setSelectedId(o.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl" className="max-w-[min(100vw-2rem,28rem)]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف الطلب؟</AlertDialogTitle>
                            <AlertDialogDescription>
                              سيتم حذف {o.orderNumber} نهائياً ولا يمكن التراجع.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col-reverse gap-2 sm:flex-row-reverse">
                            <AlertDialogCancel className="w-full sm:w-auto">إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="w-full sm:w-auto"
                              onClick={() => void handleDelete(o.id)}
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-muted-foreground">المحافظة</dt>
                      <dd className="font-medium">{o.governorate}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">الكمية</dt>
                      <dd className="font-medium">{o.quantity}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">الإجمالي</dt>
                      <dd className="font-display font-black text-forest">
                        {o.total.toLocaleString("ar-EG")} ج
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">شحن Bosta</dt>
                      <dd className="font-medium text-[10px] uppercase">
                        {o.bostaStatus || "لم يرسل"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">التاريخ</dt>
                      <dd>{format(parseISO(o.createdAt), "d MMM yyyy", { locale: ar })}</dd>
                    </div>
                  </dl>
                  <div className="mt-3">
                    <Select
                      value={o.status}
                      onValueChange={(v) => void handleStatus(o.id, v as OrderStatus)}
                    >
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>الهاتف</TableHead>
                    <TableHead>المحافظة</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>الإجمالي</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>حالة Bosta</TableHead>
                    <TableHead>التتبع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-left">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((o) => (
                    <TableRow 
                      key={o.id}
                      className={o.status === "shipping_error" ? "bg-rose-50/40 dark:bg-rose-950/10 hover:bg-rose-100/40 dark:hover:bg-rose-950/20" : ""}
                    >
                      <TableCell className="font-mono text-xs font-bold">{o.orderNumber}</TableCell>
                      <TableCell>{o.customerName}</TableCell>
                      <TableCell dir="ltr" className="text-left text-xs">
                        {o.phone}
                      </TableCell>
                      <TableCell>{o.governorate}</TableCell>
                      <TableCell>{o.quantity}</TableCell>
                      <TableCell className="font-semibold">
                        {o.total.toLocaleString("ar-EG")} ج
                      </TableCell>
                      <TableCell>
                        <Select
                          value={o.status}
                          onValueChange={(v) => void handleStatus(o.id, v as OrderStatus)}
                        >
                          <SelectTrigger className="h-9 w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                              <SelectItem key={s} value={s}>
                                {ORDER_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs font-semibold uppercase whitespace-nowrap">
                        {o.bostaStatus || (o.bostaOrderSent ? "مرسل" : "لم يرسل بعد")}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {o.trackingNumber || "-"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(parseISO(o.createdAt), "d MMM yyyy", { locale: ar })}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {!o.bostaOrderSent && (
                            <Button variant="ghost" size="icon" onClick={() => void handleResendToBosta(o.id)} title="إرسال إلى Bosta">
                              <Send className="h-4 w-4 text-blue-500" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => setSelectedId(o.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف الطلب؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف {o.orderNumber} نهائياً ولا يمكن التراجع.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2 sm:gap-0">
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction onClick={() => void handleDelete(o.id)}>
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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

      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto" dir="rtl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">تفاصيل {selected.orderNumber}</DialogTitle>
              </DialogHeader>
              <dl className="grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">العميل</dt>
                  <dd className="font-medium">{selected.customerName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">الهاتف</dt>
                  <dd dir="ltr">{selected.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">المحافظة</dt>
                  <dd>{selected.governorate}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">العنوان</dt>
                  <dd className="text-left">{selected.address}</dd>
                </div>
                {selected.notes && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">ملاحظات</dt>
                    <dd className="text-left">{selected.notes}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">الكمية × السعر</dt>
                  <dd>
                    {selected.quantity} × {selected.unitPrice} ج
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">المجموع</dt>
                  <dd>{selected.subtotal.toLocaleString("ar-EG")} ج</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">الشحن</dt>
                  <dd>{selected.shippingFee.toLocaleString("ar-EG")} ج</dd>
                </div>
                <div className="flex justify-between gap-4 border-t pt-3">
                  <dt className="font-bold">الإجمالي</dt>
                  <dd className="font-display text-lg font-black text-forest">
                    {selected.total.toLocaleString("ar-EG")} ج
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-t pt-3">
                  <dt className="text-muted-foreground">حالة Bosta</dt>
                  <dd className="font-medium uppercase">
                    {selected.bostaStatus || "لم يرسل"}
                  </dd>
                </div>
                 <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">رقم التتبع</dt>
                  <dd className="font-mono">{selected.trackingNumber || "-"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">الحالة</dt>
                  <Select
                    value={selected.status}
                    onValueChange={(v) => {
                      void handleStatus(selected.id, v as OrderStatus);
                      setSelectedId(null);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {ORDER_STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
