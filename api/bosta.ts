import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BOSTA_API_BASE = "https://app.bosta.co/api/v2";
const BOSTA_API_KEY =
  process.env.BOSTA_API_KEY ||
  "f8c183ceb2695318580be2107d174f1c6650b4ef7dbb7349aecf6cc16f449062";

// Lazy Supabase client — created on first request so env vars are available
let _supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.VITE_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    "";
  if (!url) throw new Error("VITE_SUPABASE_URL is not set in environment variables.");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_PUBLISHABLE_KEY is not set.");
  _supabase = createClient(url, key);
  return _supabase;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function bostaHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: BOSTA_API_KEY,
  };
}

/**
 * Map a local governorate name to a Bosta city name.
 * Bosta requires city names in English exactly as their system knows them.
 * Add more mappings as needed.
 */
import { getBostaCityData } from "../src/lib/bosta-cities";

// ─── Create Bosta Delivery ───────────────────────────────────────────────────

async function handleCreateOrder(orderId: string) {

  // 1. Fetch the order
  const { data: order, error: orderError } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Order not found: ${orderError?.message ?? "No order"}`);
  }

  // 2. Split customer name
  const nameParts = (order.customer_name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "Customer";
  const lastName = nameParts.slice(1).join(" ") || firstName;

  // 3. Map address
  const bostaCity = getBostaCityData(order.governorate);
  const districtName = (order.city || order.area || bostaCity.name).trim();
  
  const firstLine =
    [order.area, order.address].filter(Boolean).join(", ").slice(0, 200) ||
    order.address ||
    "N/A address";

  // Bosta requires firstLine > 5 characters
  const safeFirstLine =
    firstLine.length >= 6 ? firstLine : `${firstLine} - توصيل`;

  // 6. Validate Payload Before Sending (per user requirements)
  if (!order.bosta_district_id && districtName && !bostaCity.id) {
    throw new Error("Validation Error: districtName is present but cityId is missing. Bosta requires cityId when passing districtName.");
  }

  // 4. Build Bosta payload
  //    type 10 = deliver (COD)
  const payload = {
    type: 10,
    specs: {
      size: "SMALL",
      packageType: "Parcel",
    },
    cod: Number(order.total ?? 0),
    businessReference: order.order_number,
    receiver: {
      firstName,
      lastName,
      phone: String(order.phone),
      ...(order.email ? { email: order.email } : {}),
    },
    dropOffAddress: {
      city: bostaCity.name,
      ...(bostaCity.id ? { cityId: bostaCity.id } : {}),
      ...(order.bosta_district_id
        ? { districtId: order.bosta_district_id }
        : { districtName }),
      firstLine: safeFirstLine,
      ...(order.area ? { secondLine: String(order.area) } : {}),
    },
    notes: order.notes || "",
    allowToOpenPackage: true,
  };

  console.log("Bosta Payload", JSON.stringify(payload, null, 2));

  // 5. POST to Bosta
  const response = await fetch(
    `${BOSTA_API_BASE}/deliveries?apiVersion=1`,
    {
      method: "POST",
      headers: bostaHeaders(),
      body: JSON.stringify(payload),
    }
  );

  const responseText = await response.text();

  if (!response.ok) {
    console.error("[Bosta] Create Order Error:", response.status, responseText);
    throw new Error(
      `Bosta Create Order Failed: ${response.status} ${responseText}`
    );
  }

  const result = JSON.parse(responseText);
  const trackingNumber: string | undefined =
    result?.data?.trackingNumber ?? result?.trackingNumber;
  const bostaId: string | undefined = result?.data?._id ?? result?._id;

  console.log("[Bosta] Order created:", trackingNumber, bostaId);

  // 6. Update our DB
  const { error: updateError } = await getSupabase()
    .from("orders")
    .update({
      bosta_order_sent: true,
      bosta_status: "created",
      tracking_number: trackingNumber ?? null,
      tracking_url: trackingNumber
        ? `https://app.bosta.co/track-shipment?trackingNumber=${trackingNumber}`
        : null,
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    console.error("[Bosta] Failed to update DB after order creation:", updateError);
  }

  return { ...result, trackingNumber, bostaId };
}

// ─── Vercel Serverless Handler ───────────────────────────────────────────────

export default async function handler(req: any, res: any) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { action } = req.query;

  try {
    if (action === "create") {
      if (req.method !== "POST") {
        res.status(405).json({ error: "POST method required for create action" });
        return;
      }
      const { orderId } = req.body;
      if (!orderId) {
        res.status(400).json({ error: "Missing orderId in request body" });
        return;
      }
      const result = await handleCreateOrder(orderId);
      res.status(200).json(result);
    } else if (action === "districts") {
      if (req.method !== "GET") {
        res.status(405).json({ error: "GET method required for districts action" });
        return;
      }
      const cityId = req.query.cityId as string;
      if (!cityId) {
        res.status(400).json({ error: "Missing cityId" });
        return;
      }
      const response = await fetch(`${BOSTA_API_BASE}/cities/${cityId}/districts`);
      if (!response.ok) {
        res.status(response.status).json({ error: "Failed to fetch districts" });
        return;
      }
      const data = await response.json();
      res.status(200).json(data);
    } else {
      res.status(400).json({ error: "Invalid action parameter" });
    }
  } catch (error: any) {
    console.error("[Bosta] API Error:", error);

    // Mark order as shipping_error in DB
    if (action === "create" && req.body?.orderId) {
      try {
        const errorMsg = error?.message || "Failed to create Bosta delivery";
        await getSupabase()
          .from("orders")
          .update({
            status: "shipping_error",
            bosta_status: errorMsg.slice(0, 200),
            updated_at: new Date().toISOString(),
          })
          .eq("id", req.body.orderId);
      } catch (dbErr) {
        console.error("[Bosta] Failed to update status to shipping_error:", dbErr);
      }
    }

    res.status(500).json({ error: error?.message || "Internal Server Error" });
  }
}
