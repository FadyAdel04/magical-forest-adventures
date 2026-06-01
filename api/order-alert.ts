import { Resend } from "resend";

type OrderPayload = {
  order: {
    orderNumber: string;
    customerName: string;
    phone: string;
    governorate: string;
    address: string;
    notes: string;
    quantity: number;
    unitPrice: number;
    shippingFee: number;
    subtotal: number;
    total: number;
    status: string;
    createdAt: string;
  };
};

const ADMIN_ORDERS_URL = "https://nasseg.vercel.app/admin/orders";
const TO_EMAIL = "naseeg.stories@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing RESEND_API_KEY" });
    return;
  }

  const body = (req.body ?? {}) as Partial<OrderPayload>;
  const order = body.order;
  if (!order?.orderNumber) {
    res.status(400).json({ error: "Missing order payload" });
    return;
  }

  const resend = new Resend(apiKey);

  const subject = `طلب جديد — رقم ${order.orderNumber}`;
  const safeNotes = order.notes?.trim() ? escapeHtml(order.notes.trim()) : "—";

  const html = `
  <div style="font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial; direction: rtl; text-align: right; background:#f6f5f1; padding:24px">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e7e2d8;border-radius:16px;overflow:hidden">
      <div style="padding:18px 20px;background:#0d2d1f;color:#fff">
        <div style="font-size:14px;opacity:.9">تنبيه لوحة الإدارة</div>
        <div style="font-size:18px;font-weight:800;margin-top:6px">طلب جديد تم استلامه</div>
      </div>
      <div style="padding:18px 20px">
        <p style="margin:0 0 12px 0;font-size:14px;color:#223">
          رقم الطلب: <b>${escapeHtml(order.orderNumber)}</b>
        </p>

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tbody>
            <tr><td style="padding:10px 0;color:#556">الاسم</td><td style="padding:10px 0"><b>${escapeHtml(order.customerName)}</b></td></tr>
            <tr><td style="padding:10px 0;color:#556">الهاتف</td><td style="padding:10px 0" dir="ltr"><b>${escapeHtml(order.phone)}</b></td></tr>
            <tr><td style="padding:10px 0;color:#556">المحافظة</td><td style="padding:10px 0"><b>${escapeHtml(order.governorate)}</b></td></tr>
            <tr><td style="padding:10px 0;color:#556">العنوان</td><td style="padding:10px 0"><b>${escapeHtml(order.address)}</b></td></tr>
            <tr><td style="padding:10px 0;color:#556">ملاحظات</td><td style="padding:10px 0"><b>${safeNotes}</b></td></tr>
          </tbody>
        </table>

        <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tbody>
            <tr><td style="padding:6px 0;color:#556">الكمية</td><td style="padding:6px 0"><b>${order.quantity}</b></td></tr>
            <tr><td style="padding:6px 0;color:#556">سعر الوحدة</td><td style="padding:6px 0"><b>${order.unitPrice} جنيه</b></td></tr>
            <tr><td style="padding:6px 0;color:#556">المجموع</td><td style="padding:6px 0"><b>${order.subtotal} جنيه</b></td></tr>
            <tr><td style="padding:6px 0;color:#556">الشحن</td><td style="padding:6px 0"><b>${order.shippingFee} جنيه</b></td></tr>
            <tr><td style="padding:6px 0;color:#556">الإجمالي</td><td style="padding:6px 0"><b>${order.total} جنيه</b></td></tr>
          </tbody>
        </table>

        <div style="margin-top:18px">
          <a href="${ADMIN_ORDERS_URL}" target="_blank" rel="noreferrer"
             style="display:inline-block;background:#1f6f3b;color:#fff;text-decoration:none;padding:12px 16px;border-radius:999px;font-weight:800">
            إدارة الطلب من لوحة التحكم
          </a>
        </div>

        <p style="margin:14px 0 0 0;font-size:12px;color:#777">
          رابط لوحة الطلبات: <a href="${ADMIN_ORDERS_URL}" target="_blank" rel="noreferrer">${ADMIN_ORDERS_URL}</a>
        </p>
      </div>
    </div>
  </div>
  `;

  try {
    await resend.emails.send({
      from: "Naseeg Orders <onboarding@resend.dev>",
      to: TO_EMAIL,
      subject,
      html,
    });
    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Failed to send email" });
  }
}

