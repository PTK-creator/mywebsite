import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;
const app = express();

// Middleware
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Supabase Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "https://eocpjpkmjwhajqodtkre.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_aOUtLd0rViabaK0bzqoDGQ_ILw89unY";

let supabase: SupabaseClient | null = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
}

// In-Memory Hybrid Store & Initial Seed Data
const DEFAULT_SEED_LISTINGS = [
  {
    id: "seed-1",
    category: "electronics",
    cropId: "smartphones",
    cropName: "Smartphones & Tablets",
    role: "seller" as const,
    name: "Apex Digital Hub",
    phone: "+263 778 788 197",
    country: "Zimbabwe",
    marketType: "LOCAL" as const,
    deliveryOption: "Express Delivery" as const,
    location: "Harare CBD, Shop 14",
    quantity: "15 units",
    price: "380",
    notes: "Brand new 5G Smartphones, 256GB storage, dual SIM, 1-year manufacturer warranty.",
    image: null,
    images: [],
    status: "active" as const,
    date: new Date().toISOString(),
  },
  {
    id: "seed-2",
    category: "automobiles",
    cropId: "sedans_hatchbacks",
    cropName: "Sedans & Hatchbacks",
    role: "seller" as const,
    name: "Premier Motors Zim",
    phone: "+263 712 461 904",
    country: "Zimbabwe",
    marketType: "LOCAL" as const,
    deliveryOption: "Pickup" as const,
    location: "Bulawayo Industrial Site",
    quantity: "2 vehicles",
    price: "4500",
    notes: "2016 Fuel-efficient 1.5L automatic sedan in pristine mechanical condition.",
    image: null,
    images: [],
    status: "active" as const,
    date: new Date().toISOString(),
  },
  {
    id: "seed-3",
    category: "horticulture",
    cropId: "avocado",
    cropName: "Avocados",
    role: "seller" as const,
    name: "Highland Orchards",
    phone: "+263 778 788 197",
    country: "Zimbabwe",
    marketType: "INTERNATIONAL" as const,
    deliveryOption: "International Shipping" as const,
    location: "Chipinge Valley Estate",
    quantity: "500 boxes",
    price: "18",
    notes: "Export grade Hass Avocados, pest certified, ready for air freight and refrigerated sea container shipment.",
    image: null,
    images: [],
    status: "active" as const,
    date: new Date().toISOString(),
  },
  {
    id: "seed-4",
    category: "clothes",
    cropId: "mens_wear",
    cropName: "Men's Clothing",
    role: "seller" as const,
    name: "Savile Stitch Emporium",
    phone: "+27 82 555 4321",
    country: "South Africa",
    marketType: "INTERNATIONAL" as const,
    deliveryOption: "Standard Shipping" as const,
    location: "Johannesburg City Centre",
    quantity: "80 sets",
    price: "65",
    notes: "Tailored luxury cotton business suits and formal shirts with corporate embroidery options.",
    image: null,
    images: [],
    status: "active" as const,
    date: new Date().toISOString(),
  },
];

interface ServerListing {
  id: string;
  category: string;
  cropId: string;
  cropName: string;
  role: "seller" | "buyer";
  name: string;
  phone: string;
  country: string;
  location: string;
  marketType: "LOCAL" | "INTERNATIONAL";
  deliveryOption: string;
  quantity: string;
  price: string;
  notes?: string;
  image?: string | null;
  images?: string[];
  status: "active" | "sold" | "archived";
  date: string;
}

let fallbackListings: ServerListing[] = [...DEFAULT_SEED_LISTINGS];
let fallbackBuyers: Array<{
  id: string;
  name: string;
  phone: string;
  country: string;
  location: string;
  interest: string;
  created_at: string;
}> = [
  {
    id: "buyer-seed-1",
    name: "Global Grain Traders",
    phone: "+263 771 900 112",
    country: "Zimbabwe",
    location: "Harare Grain Terminal",
    interest: "Grains, Rice & Flour",
    created_at: new Date().toISOString(),
  },
];

let fallbackSellers: Array<{
  id: string;
  name: string;
  phone: string;
  country: string;
  location: string;
  product: string;
  created_at: string;
}> = [
  {
    id: "seller-seed-1",
    name: "Apex Digital Hub",
    phone: "+263 778 788 197",
    country: "Zimbabwe",
    location: "Harare CBD, Shop 14",
    product: "Smartphones & Tablets",
    created_at: new Date().toISOString(),
  },
  {
    id: "seller-seed-2",
    name: "Premier Motors Zim",
    phone: "+263 712 461 904",
    country: "Zimbabwe",
    location: "Bulawayo Industrial Site",
    product: "Sedans & Hatchbacks",
    created_at: new Date().toISOString(),
  },
];

let fallbackOrders: Array<{
  id: string;
  time: string;
  buyerName: string;
  buyerPhone: string;
  destination: string;
  items: any[];
  itemsSummary: string;
  total: number;
  status: string;
  notes?: string;
}> = [];

// Helper: Sanitize Text Input
function sanitizeString(str: any, maxLen = 500): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen);
}

// SQL Migration Script for Supabase SQL Editor
const SUPABASE_MIGRATION_SQL = `-- ==============================================================================
-- PTK-LINK MARKETPLACE SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  crop_id TEXT NOT NULL,
  crop_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('seller', 'buyer')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  market_type TEXT NOT NULL DEFAULT 'LOCAL',
  delivery_option TEXT NOT NULL DEFAULT 'Standard Shipping',
  quantity TEXT NOT NULL,
  price TEXT,
  notes TEXT,
  image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Buyers Directory Table
CREATE TABLE IF NOT EXISTS public.buyers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  interest TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Sellers Directory Table
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  location TEXT NOT NULL,
  product TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Orders & Sales Log Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  items_summary TEXT NOT NULL,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'dispatched', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Permissive policies for marketplace public access via Publishable/Anon Key
DROP POLICY IF EXISTS "Public select listings" ON public.listings;
CREATE POLICY "Public select listings" ON public.listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert listings" ON public.listings;
CREATE POLICY "Public insert listings" ON public.listings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update listings" ON public.listings;
CREATE POLICY "Public update listings" ON public.listings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public delete listings" ON public.listings;
CREATE POLICY "Public delete listings" ON public.listings FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public select buyers" ON public.buyers;
CREATE POLICY "Public select buyers" ON public.buyers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public upsert buyers" ON public.buyers;
CREATE POLICY "Public upsert buyers" ON public.buyers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select sellers" ON public.sellers;
CREATE POLICY "Public select sellers" ON public.sellers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public upsert sellers" ON public.sellers;
CREATE POLICY "Public upsert sellers" ON public.sellers FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders FOR UPDATE USING (true);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_role ON public.listings(role);
CREATE INDEX IF NOT EXISTS idx_listings_country ON public.listings(country);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
`;

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    supabaseConfigured: !!(SUPABASE_URL && SUPABASE_KEY),
    supabaseUrl: SUPABASE_URL,
    timestamp: new Date().toISOString(),
  });
});

// Supabase Status & Connection Diagnostic
app.get("/api/supabase/status", async (_req: Request, res: Response) => {
  if (!supabase) {
    return res.json({
      configured: false,
      url: SUPABASE_URL || "",
      connected: false,
      tables: { listings: false, buyers: false, sellers: false, orders: false },
      error: "Supabase client not initialized.",
      message: "Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.",
    });
  }

  const startTime = Date.now();
  const tablesStatus = { listings: false, buyers: false, sellers: false, orders: false };
  let hasError = false;
  let errorMsg = null;

  try {
    // Probe listings
    const { data: _lData, error: lErr } = await supabase.from("listings").select("id").limit(1);
    if (!lErr) tablesStatus.listings = true;
    else if (lErr.code === "PGRST205") errorMsg = "Table 'listings' not found in schema cache. Run the SQL migration script.";
    else errorMsg = lErr.message;

    // Probe buyers
    const { error: bErr } = await supabase.from("buyers").select("id").limit(1);
    if (!bErr) tablesStatus.buyers = true;

    // Probe sellers
    const { error: sErr } = await supabase.from("sellers").select("id").limit(1);
    if (!sErr) tablesStatus.sellers = true;

    // Probe orders
    const { error: oErr } = await supabase.from("orders").select("id").limit(1);
    if (!oErr) tablesStatus.orders = true;

    const latencyMs = Date.now() - startTime;
    const allTablesReady = tablesStatus.listings && tablesStatus.buyers && tablesStatus.sellers && tablesStatus.orders;

    return res.json({
      configured: true,
      url: SUPABASE_URL,
      connected: true,
      latencyMs,
      tables: tablesStatus,
      allTablesReady,
      error: allTablesReady ? null : errorMsg,
      message: allTablesReady
        ? "Connected to Supabase. All tables operational."
        : "Supabase connected, but PostgreSQL tables are not yet created. Click 'View & Copy SQL Script' to create them instantly in your Supabase SQL Editor.",
    });
  } catch (err: any) {
    return res.json({
      configured: true,
      url: SUPABASE_URL,
      connected: false,
      latencyMs: Date.now() - startTime,
      tables: tablesStatus,
      error: err.message || "Network connection to Supabase failed.",
      message: "Could not reach Supabase endpoint.",
    });
  }
});

// Supabase Migration SQL Endpoint
app.get("/api/supabase/schema", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(SUPABASE_MIGRATION_SQL);
});

// Automated Migration Endpoint
app.post("/api/supabase/migrate", async (req: Request, res: Response) => {
  const { accessToken, dbPassword, connectionString } = req.body || {};
  const token = accessToken || process.env.SUPABASE_ACCESS_TOKEN;
  const password = dbPassword || process.env.SUPABASE_DB_PASSWORD;
  const connStr = connectionString || process.env.DATABASE_URL;
  const projectId = "eocpjpkmjwhajqodtkre";

  // Method 1: Using Supabase Management API via Personal Access Token
  if (token) {
    try {
      const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}/database/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: SUPABASE_MIGRATION_SQL }),
      });
      const data = await response.json();
      if (!response.ok) {
        return res.status(400).json({
          success: false,
          error: data.message || "Supabase Management API returned an error.",
        });
      }
      return res.json({
        success: true,
        method: "management_api",
        message: "PostgreSQL tables created successfully in Supabase via Management API!",
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Method 2: Direct PostgreSQL connection via node-postgres
  if (connStr || password) {
    try {
      const { Client } = await import("pg");
      const client = new Client({
        connectionString: connStr || `postgresql://postgres:${encodeURIComponent(password)}@db.${projectId}.supabase.co:5432/postgres`,
        ssl: { rejectUnauthorized: false },
      });
      await client.connect();
      await client.query(SUPABASE_MIGRATION_SQL);
      await client.end();
      return res.json({
        success: true,
        method: "postgres_direct",
        message: "PostgreSQL tables and RLS policies created successfully via direct connection!",
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        error: `Database connection error: ${err.message}`,
      });
    }
  }

  return res.status(400).json({
    success: false,
    error: "Admin credentials required. Please provide your Supabase Database Password or Personal Access Token.",
  });
});

// ==========================================
// LISTINGS CRUD
// ==========================================

// GET /api/listings: Retrieve listings with filters
app.get("/api/listings", async (req: Request, res: Response) => {
  const { category, search, scope, country, delivery, role } = req.query;

  // Try Supabase first if available
  if (supabase) {
    try {
      let query = supabase.from("listings").select("*").order("created_at", { ascending: false });

      if (category && category !== "ALL") query = query.eq("category", String(category));
      if (role && role !== "ALL") query = query.eq("role", String(role));
      if (scope && scope !== "ALL") query = query.eq("market_type", String(scope));
      if (country && country !== "ALL") query = query.eq("country", String(country));
      if (delivery && delivery !== "ALL") query = query.eq("delivery_option", String(delivery));

      let { data, error } = await query;

      if (!error && data) {
        // Auto-seed initial catalog into Supabase if table is brand new and empty
        if (
          data.length === 0 &&
          (!category || category === "ALL") &&
          (!role || role === "ALL") &&
          !search &&
          (!scope || scope === "ALL") &&
          (!country || country === "ALL")
        ) {
          try {
            const seedRows = DEFAULT_SEED_LISTINGS.map((item) => ({
              id: item.id,
              category: item.category,
              crop_id: item.cropId,
              crop_name: item.cropName,
              role: item.role,
              name: item.name,
              phone: item.phone,
              country: item.country,
              location: item.location,
              market_type: item.marketType,
              delivery_option: item.deliveryOption,
              quantity: item.quantity,
              price: item.price,
              notes: item.notes,
              image: item.image,
              images: item.images || [],
              status: item.status,
              created_at: item.date,
              updated_at: item.date,
            }));
            await supabase.from("listings").insert(seedRows);
            await supabase.from("buyers").upsert(fallbackBuyers);
            await supabase.from("sellers").upsert(fallbackSellers);

            const refreshed = await supabase.from("listings").select("*").order("created_at", { ascending: false });
            if (refreshed.data && refreshed.data.length > 0) {
              data = refreshed.data;
            }
          } catch (seedErr) {
            console.warn("Auto-seed into Supabase failed:", seedErr);
          }
        }

        // Map database columns to app format
        let mapped = data.map((item) => ({
          id: item.id,
          category: item.category,
          cropId: item.crop_id,
          cropName: item.crop_name,
          role: item.role,
          name: item.name,
          phone: item.phone,
          country: item.country,
          location: item.location,
          marketType: item.market_type,
          deliveryOption: item.delivery_option,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes,
          image: item.image,
          images: item.images || [],
          status: item.status || "active",
          date: item.created_at,
          source: "supabase" as const,
        }));

        if (search) {
          const q = String(search).toLowerCase();
          mapped = mapped.filter(
            (l) =>
              l.cropName.toLowerCase().includes(q) ||
              l.name.toLowerCase().includes(q) ||
              l.country.toLowerCase().includes(q) ||
              l.location.toLowerCase().includes(q) ||
              (l.notes && l.notes.toLowerCase().includes(q))
          );
        }

        return res.json({ success: true, listings: mapped, source: "supabase" });
      }
    } catch (err) {
      console.warn("Supabase listings query error, using fallback:", err);
    }
  }

  // In-memory fallback
  let list = [...fallbackListings];
  if (category && category !== "ALL") list = list.filter((l) => l.category === category);
  if (role && role !== "ALL") list = list.filter((l) => l.role === role);
  if (scope && scope !== "ALL") list = list.filter((l) => l.marketType === scope);
  if (country && country !== "ALL") list = list.filter((l) => l.country === country);
  if (delivery && delivery !== "ALL") list = list.filter((l) => l.deliveryOption === delivery);

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (l) =>
        l.cropName.toLowerCase().includes(q) ||
        l.name.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        (l.notes && l.notes.toLowerCase().includes(q))
    );
  }

  return res.json({
    success: true,
    listings: list.map((l) => ({ ...l, source: "local" as const })),
    source: "local",
    notice: "Operating in hybrid cache. Run Supabase SQL migration to persist in cloud PostgreSQL.",
  });
});

// POST /api/listings: Store new listing
app.post("/api/listings", async (req: Request, res: Response) => {
  const body = req.body;

  // Validation
  const name = sanitizeString(body.name, 100);
  const phone = sanitizeString(body.phone, 40);
  const category = sanitizeString(body.category, 50);
  const cropId = sanitizeString(body.cropId, 50);
  const cropName = sanitizeString(body.cropName, 100);
  const country = sanitizeString(body.country, 100);
  const location = sanitizeString(body.location, 150);
  const quantity = sanitizeString(body.quantity, 50);
  const price = sanitizeString(body.price, 30);
  const notes = sanitizeString(body.notes, 2000);
  const role: "seller" | "buyer" = body.role === "buyer" ? "buyer" : "seller";
  const marketType: "LOCAL" | "INTERNATIONAL" = body.marketType === "INTERNATIONAL" ? "INTERNATIONAL" : "LOCAL";
  const deliveryOption = sanitizeString(body.deliveryOption || "Standard Shipping", 60);
  const images = Array.isArray(body.images) ? body.images.slice(0, 10) : [];
  const primaryImage = images.length > 0 ? images[0] : body.image || null;

  if (!name || !phone || !category || !cropId || !cropName || !country || !location) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: name, phone, category, cropId, country, location.",
    });
  }

  const newId = "lst_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();

  const newListing: ServerListing = {
    id: newId,
    category,
    cropId,
    cropName,
    role,
    name,
    phone,
    country,
    location,
    marketType,
    deliveryOption,
    quantity,
    price,
    notes,
    image: primaryImage,
    images,
    status: "active",
    date: now,
  };

  // Keep in fallback cache
  fallbackListings.unshift(newListing);

  // Sync to buyers or sellers directory
  if (role === "buyer") {
    fallbackBuyers.unshift({
      id: "b_" + Date.now(),
      name,
      phone,
      country,
      location,
      interest: cropName,
      created_at: now,
    });
  } else {
    fallbackSellers.unshift({
      id: "s_" + Date.now(),
      name,
      phone,
      country,
      location,
      product: cropName,
      created_at: now,
    });
  }

  // Attempt Supabase insert
  let savedToSupabase = false;
  if (supabase) {
    try {
      const { error: insErr } = await supabase.from("listings").insert({
        id: newId,
        category,
        crop_id: cropId,
        crop_name: cropName,
        role,
        name,
        phone,
        country,
        location,
        market_type: marketType,
        delivery_option: deliveryOption,
        quantity,
        price,
        notes,
        image: primaryImage,
        images,
        status: "active",
        created_at: now,
        updated_at: now,
      });

      if (!insErr) {
        savedToSupabase = true;

        // Also upsert to buyers/sellers in Supabase
        if (role === "buyer") {
          await supabase.from("buyers").upsert({
            id: "b_" + phone.replace(/[^a-zA-Z0-9]/g, "_"),
            name,
            phone,
            country,
            location,
            interest: cropName,
            updated_at: now,
          });
        } else {
          await supabase.from("sellers").upsert({
            id: "s_" + phone.replace(/[^a-zA-Z0-9]/g, "_"),
            name,
            phone,
            country,
            location,
            product: cropName,
            updated_at: now,
          });
        }
      }
    } catch (err) {
      console.warn("Supabase insert error:", err);
    }
  }

  return res.status(201).json({
    success: true,
    listing: { ...newListing, source: savedToSupabase ? "supabase" : "local" },
    source: savedToSupabase ? "supabase" : "local",
    message: savedToSupabase ? "Successfully stored in Supabase" : "Stored locally (Supabase table not ready)",
  });
});

// PUT /api/listings/:id: Modify an existing listing
app.put("/api/listings/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const updates: Record<string, any> = {};
  if (body.price !== undefined) updates.price = sanitizeString(body.price, 30);
  if (body.quantity !== undefined) updates.quantity = sanitizeString(body.quantity, 50);
  if (body.notes !== undefined) updates.notes = sanitizeString(body.notes, 2000);
  if (body.location !== undefined) updates.location = sanitizeString(body.location, 150);
  if (body.deliveryOption !== undefined) updates.deliveryOption = sanitizeString(body.deliveryOption, 60);
  if (body.marketType !== undefined) updates.marketType = body.marketType === "INTERNATIONAL" ? "INTERNATIONAL" : "LOCAL";
  if (body.status !== undefined) updates.status = ["active", "sold", "archived"].includes(body.status) ? body.status : "active";

  // Update in-memory
  const idx = fallbackListings.findIndex((l) => l.id === id);
  if (idx > -1) {
    fallbackListings[idx] = { ...fallbackListings[idx], ...updates };
  }

  // Update in Supabase
  let updatedInSupabase = false;
  if (supabase) {
    try {
      const dbUpdates: Record<string, any> = { updated_at: new Date().toISOString() };
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.deliveryOption !== undefined) dbUpdates.delivery_option = updates.deliveryOption;
      if (updates.marketType !== undefined) dbUpdates.market_type = updates.marketType;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { error } = await supabase.from("listings").update(dbUpdates).eq("id", id);
      if (!error) updatedInSupabase = true;
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  return res.json({
    success: true,
    id,
    updated: updates,
    source: updatedInSupabase ? "supabase" : "local",
    message: "Listing updated successfully.",
  });
});

// DELETE /api/listings/:id: Remove a listing
app.delete("/api/listings/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  fallbackListings = fallbackListings.filter((l) => l.id !== id);

  let deletedFromSupabase = false;
  if (supabase) {
    try {
      const { error } = await supabase.from("listings").delete().eq("id", id);
      if (!error) deletedFromSupabase = true;
    } catch (err) {
      console.warn("Supabase delete error:", err);
    }
  }

  return res.json({
    success: true,
    id,
    source: deletedFromSupabase ? "supabase" : "local",
    message: "Listing deleted successfully.",
  });
});

// ==========================================
// BUYERS & SELLERS DIRECTORIES
// ==========================================

app.get("/api/buyers", async (_req: Request, res: Response) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("buyers").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return res.json({ success: true, buyers: data, source: "supabase" });
      }
    } catch (e) {}
  }
  return res.json({ success: true, buyers: fallbackBuyers, source: "local" });
});

app.post("/api/buyers", async (req: Request, res: Response) => {
  const name = sanitizeString(req.body.name, 100);
  const phone = sanitizeString(req.body.phone, 40);
  const country = sanitizeString(req.body.country, 100);
  const location = sanitizeString(req.body.location || req.body.destination, 150);
  const interest = sanitizeString(req.body.interest || req.body.itemsSummary, 200);

  if (!name || !phone) {
    return res.status(400).json({ success: false, error: "Name and phone are required" });
  }

  const record = {
    id: "b_" + Date.now(),
    name,
    phone,
    country,
    location,
    interest,
    created_at: new Date().toISOString(),
  };

  const existingIdx = fallbackBuyers.findIndex((b) => b.phone === phone);
  if (existingIdx > -1) {
    fallbackBuyers[existingIdx] = { ...fallbackBuyers[existingIdx], ...record };
  } else {
    fallbackBuyers.unshift(record);
  }

  if (supabase) {
    try {
      await supabase.from("buyers").upsert({
        id: "b_" + phone.replace(/[^a-zA-Z0-9]/g, "_"),
        name,
        phone,
        country,
        location,
        interest,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {}
  }

  res.json({ success: true, buyer: record });
});

app.get("/api/sellers", async (_req: Request, res: Response) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("sellers").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return res.json({ success: true, sellers: data, source: "supabase" });
      }
    } catch (e) {}
  }
  return res.json({ success: true, sellers: fallbackSellers, source: "local" });
});

// ==========================================
// ORDERS & SALES ALERTS
// ==========================================

app.get("/api/orders", async (_req: Request, res: Response) => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        const mapped = data.map((o) => ({
          id: o.id,
          time: new Date(o.created_at).toLocaleString(),
          buyerName: o.buyer_name,
          buyerPhone: o.buyer_phone,
          destination: o.destination,
          items: o.items || [],
          itemsSummary: o.items_summary,
          total: Number(o.total || 0),
          status: o.status || "pending",
          notes: o.notes,
        }));
        return res.json({ success: true, orders: mapped, source: "supabase" });
      }
    } catch (e) {}
  }
  return res.json({ success: true, orders: fallbackOrders, source: "local" });
});

app.post("/api/orders", async (req: Request, res: Response) => {
  const { buyerName, buyerPhone, destination, items, notes } = req.body;

  const sBuyerName = sanitizeString(buyerName, 100);
  const sBuyerPhone = sanitizeString(buyerPhone, 40);
  const sDestination = sanitizeString(destination, 200);
  const sNotes = sanitizeString(notes, 500);

  if (!sBuyerName || !sBuyerPhone || !sDestination || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: "Invalid order payload" });
  }

  // Calculate total safely on server
  let total = 0;
  const cleanItems = items.map((i: any) => {
    const rawPrice = parseFloat(String(i.price || "0").replace(/[^0-9.]/g, "")) || 0;
    const qty = Math.max(1, parseInt(String(i.qty || "1"), 10) || 1);
    total += rawPrice * qty;
    return {
      id: String(i.id || ""),
      cropName: sanitizeString(i.cropName, 80),
      price: rawPrice.toFixed(2),
      sellerName: sanitizeString(i.sellerName, 80),
      sellerPhone: sanitizeString(i.sellerPhone, 40),
      deliveryOption: sanitizeString(i.deliveryOption, 60),
      qty,
    };
  });

  const itemsSummary = cleanItems.map((i) => `${i.qty}x ${i.cropName}`).join(", ");
  const orderId = "ord_" + Date.now();
  const now = new Date().toISOString();

  const newOrder = {
    id: orderId,
    time: new Date().toLocaleString(),
    buyerName: sBuyerName,
    buyerPhone: sBuyerPhone,
    destination: sDestination,
    items: cleanItems,
    itemsSummary,
    total: parseFloat(total.toFixed(2)),
    status: "pending" as const,
    notes: sNotes,
  };

  fallbackOrders.unshift(newOrder);

  // Auto-record buyer in buyers directory
  fallbackBuyers.unshift({
    id: "b_" + Date.now(),
    name: sBuyerName,
    phone: sBuyerPhone,
    country: sDestination.split(",").pop()?.trim() || "Global",
    location: sDestination,
    interest: itemsSummary,
    created_at: now,
  });

  let savedToSupabase = false;
  if (supabase) {
    try {
      const { error } = await supabase.from("orders").insert({
        id: orderId,
        buyer_name: sBuyerName,
        buyer_phone: sBuyerPhone,
        destination: sDestination,
        items: cleanItems,
        items_summary: itemsSummary,
        total,
        status: "pending",
        notes: sNotes,
        created_at: now,
      });

      if (!error) {
        savedToSupabase = true;
        // Upsert buyer in Supabase
        await supabase.from("buyers").upsert({
          id: "b_" + sBuyerPhone.replace(/[^a-zA-Z0-9]/g, "_"),
          name: sBuyerName,
          phone: sBuyerPhone,
          country: sDestination.split(",").pop()?.trim() || "Global",
          location: sDestination,
          interest: itemsSummary,
          updated_at: now,
        });
      }
    } catch (err) {
      console.warn("Supabase order insert error:", err);
    }
  }

  return res.status(201).json({
    success: true,
    order: newOrder,
    source: savedToSupabase ? "supabase" : "local",
    alertRecipient: {
      phone: "+263 778 788 197",
      email: "praisekawo2@gmail.com",
    },
    message: "Order placed successfully.",
  });
});

// PATCH /api/orders/:id: Update order status
app.patch("/api/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "dispatched", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value" });
  }

  const idx = fallbackOrders.findIndex((o) => o.id === id);
  if (idx > -1) {
    fallbackOrders[idx].status = status;
  }

  if (supabase) {
    try {
      await supabase.from("orders").update({ status }).eq("id", id);
    } catch (e) {}
  }

  res.json({ success: true, id, status });
});

// ==========================================
// VITE SPA MIDDLEWARE / PRODUCTION SERVING
// ==========================================

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PTK-Link Marketplace] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[Supabase] Endpoint configured at: ${SUPABASE_URL}`);
  });
}

start();
