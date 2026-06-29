import { createClient } from "@supabase/supabase-js";

const FLExtockAuthURL = "https://api.flextock.com/base/auth/";
const FLExtockCreateOrderURL = "https://api.flextock.com/external-integration/create-order/";
const FLExtockStatusURL = "https://api.flextock.com/external-integration/order-status/";

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function authenticateFlextock(): Promise<string> {
  const username = process.env.FLEXTOCK_USERNAME || process.env.VITE_FLEXTOCK_USERNAME;
  const password = process.env.FLEXTOCK_PASSWORD || process.env.VITE_FLEXTOCK_PASSWORD;
  const apiKey = process.env.FLEXTOCK_API_KEY || process.env.VITE_FLEXTOCK_API_KEY;

  if (!username || !password) {
    throw new Error(
      "Missing FLEXTOCK_USERNAME or FLEXTOCK_PASSWORD in server environment variables."
    );
  }

  const authBody: Record<string, string> = { username, password };
  if (apiKey) authBody.key = apiKey;

  const response = await fetch(FLExtockAuthURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authBody),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Flextock Auth Error:", response.status, responseText);
    throw new Error(`Flextock Auth Failed: ${response.status} ${responseText}`);
  }

  const data = JSON.parse(responseText);

  if (!data.access) {
    throw new Error("Flextock authentication succeeded but no access token returned");
  }

  return data.access;
}

async function handleCreateOrder(orderId: string) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured on the server.");
  }

  // 1. Fetch the order details
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderError?.message || "No order"}`);
  }

  // 2. Fetch the order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  // 3. Authenticate with Flextock
  const token = await authenticateFlextock();

  // 4. Construct payload
  const nameParts = (order.customer_name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ".";

  const payload = {
    order_code: order.order_number,
    order_date: new Date(order.created_at).toISOString().split("T")[0],
    shipping_fees: Number(order.shipping_fee || 0),
    is_free_shipping: Number(order.shipping_fee || 0) === 0,
    is_gift_order: false,
    order_currency: "EGP",
    integration_source: "Naseeg",
    vendor_name: "Naseeg",
    customer_address: {
      country: "Egypt",
      city: order.city?.trim() || order.governorate || "Cairo",
      area: order.area?.trim() || order.governorate || "N/A",
      address_line1: order.address,
      first_name: firstName,
      last_name: lastName,
      phone_number: order.phone,
      note: order.notes || "",
    },
    line_items: items && items.length > 0
      ? items.map((item) => ({
          sku_code: item.sku_code || "DEFAULT",
          quantity: Number(item.quantity || 1),
          sku_price: Number(item.price || 0),
        }))
      : [
          {
            sku_code: "DEFAULT",
            quantity: Number(order.quantity || 1),
            sku_price: Number(order.unit_price || 0),
          },
        ],
    payment_data: [
      {
        value: Number(order.total || 0),
        payment_type:
          order.payment_method === "prepaid" ? "prepaid" : "cash_on_delivery",
      },
    ],
    requires_self_delivery: false,
  };

  console.log("Flextock Payload:", JSON.stringify(payload, null, 2));

  // 5. Create Flextock order
  const response = await fetch(FLExtockCreateOrderURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Flextock Create Order Error:", response.status, responseText);
    throw new Error(`Flextock Create Order Failed: ${response.status} ${responseText}`);
  }

  const result = JSON.parse(responseText);

  // 6. Update order status in DB to processing/sent
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      flextock_order_sent: true,
      flextock_status: "created",
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("Failed to update order status in DB after Flextock creation:", updateError);
  }

  return result;
}

async function handleSyncStatus() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase is not configured on the server.");
  }

  // 1. Fetch pending/processing orders sent to Flextock
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("id, order_number, status, flextock_status")
    .eq("flextock_order_sent", true)
    .not("status", "eq", "delivered")
    .not("status", "eq", "cancelled");

  if (ordersError) {
    throw ordersError;
  }

  if (!orders || orders.length === 0) {
    return { message: "No orders to sync", synced: 0 };
  }

  const orderCodes = orders.map((o) => o.order_number);

  // 2. Authenticate
  const token = await authenticateFlextock();

  // 3. Retrieve status from Flextock
  const response = await fetch(FLExtockStatusURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      order_code_array: orderCodes,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    console.error("Flextock Status Error:", response.status, responseText);
    throw new Error(`Flextock Order Status Failed: ${response.status} ${responseText}`);
  }

  const statuses = JSON.parse(responseText);
  const statusArray = Array.isArray(statuses) ? statuses : [statuses];

  let updatedCount = 0;

  for (const flextockStatus of statusArray) {
    if (!flextockStatus || !flextockStatus.order_code) continue;

    const dbOrder = orders.find((o) => o.order_number === flextockStatus.order_code);
    if (dbOrder) {
      let localStatus = dbOrder.status;
      const fs = flextockStatus.order_status?.toLowerCase();

      if (fs === "delivered") {
        localStatus = "delivered";
      } else if (fs === "shipped" || fs === "out_for_delivery") {
        localStatus = "shipped";
      } else if (fs === "canceled" || fs === "cancelled" || fs === "returned") {
        localStatus = "cancelled";
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update({
          flextock_status: flextockStatus.order_status,
          tracking_number: flextockStatus.tracking_number,
          tracking_url: flextockStatus.tracking_url,
          status: localStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dbOrder.id);

      if (updateError) {
        console.error(`Failed to update order ${dbOrder.id} status in DB during sync:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  return { success: true, synced: updatedCount };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { action } = req.query;

  try {
    if (action === "create") {
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({ error: "Missing orderId in request body" });
        return;
      }
      const result = await handleCreateOrder(orderId);
      res.status(200).json(result);
    } else if (action === "sync") {
      const result = await handleSyncStatus();
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: "Invalid action parameter" });
    }
  } catch (error: any) {
    console.error("Flextock API Error:", error);
    
    // If we were creating an order and it failed, update database status to shipping_error
    if (action === "create" && req.body?.orderId) {
      try {
        const errorMsg = error?.message || "Failed to create Flextock order";
        await supabase
          .from("orders")
          .update({
            status: "shipping_error",
            flextock_status: errorMsg.slice(0, 200),
            updated_at: new Date().toISOString(),
          })
          .eq("id", req.body.orderId);
      } catch (dbErr) {
        console.error("Failed to update status to shipping_error in DB:", dbErr);
      }
    }

    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
}
