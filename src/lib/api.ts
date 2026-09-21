import { Listing, BuyerRecord, SellerRecord, OrderRecord, SupabaseStatus } from '../types.ts';

export async function fetchSupabaseStatus(): Promise<SupabaseStatus> {
  try {
    const res = await fetch('/api/supabase/status');
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch (err: any) {
    return {
      configured: false,
      url: '',
      connected: false,
      tables: { listings: false, buyers: false, sellers: false, orders: false },
      error: err.message || 'Failed to reach backend',
      message: 'Backend server is not responding to Supabase status queries.',
    };
  }
}

export async function fetchSupabaseSchemaSql(): Promise<string> {
  const res = await fetch('/api/supabase/schema');
  if (!res.ok) throw new Error('Failed to fetch schema SQL');
  return await res.text();
}

export async function runSupabaseMigration(credentials?: {
  dbPassword?: string;
  accessToken?: string;
  connectionString?: string;
}): Promise<{ success: boolean; message: string; error?: string }> {
  const res = await fetch('/api/supabase/migrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials || {}),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Migration failed');
  }
  return data;
}

export async function fetchListings(filters: {
  category?: string;
  search?: string;
  scope?: string;
  country?: string;
  delivery?: string;
  role?: string;
} = {}): Promise<{ listings: Listing[]; source: 'supabase' | 'local'; notice?: string }> {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== 'ALL') params.set('category', filters.category);
  if (filters.search) params.set('search', filters.search);
  if (filters.scope && filters.scope !== 'ALL') params.set('scope', filters.scope);
  if (filters.country && filters.country !== 'ALL') params.set('country', filters.country);
  if (filters.delivery && filters.delivery !== 'ALL') params.set('delivery', filters.delivery);
  if (filters.role && filters.role !== 'ALL') params.set('role', filters.role);

  const res = await fetch(`/api/listings?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  const data = await res.json();
  return {
    listings: data.listings || [],
    source: data.source || 'local',
    notice: data.notice,
  };
}

export async function createListing(listingData: Partial<Listing>): Promise<{
  success: boolean;
  listing: Listing;
  source: 'supabase' | 'local';
  message: string;
}> {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to store listing');
  }
  return data;
}

export async function updateListing(
  id: string,
  updates: Partial<Listing>
): Promise<{ success: boolean; id: string; source: 'supabase' | 'local' }> {
  const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to modify listing');
  }
  return data;
}

export async function deleteListing(id: string): Promise<{ success: boolean; id: string }> {
  const res = await fetch(`/api/listings/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete listing');
  }
  return data;
}

export async function fetchBuyers(): Promise<{ buyers: BuyerRecord[]; source: string }> {
  const res = await fetch('/api/buyers');
  if (!res.ok) throw new Error('Failed to fetch buyers');
  return await res.json();
}

export async function fetchSellers(): Promise<{ sellers: SellerRecord[]; source: string }> {
  const res = await fetch('/api/sellers');
  if (!res.ok) throw new Error('Failed to fetch sellers');
  return await res.json();
}

export async function fetchOrders(): Promise<{ orders: OrderRecord[]; source: string }> {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Failed to fetch orders');
  return await res.json();
}

export async function submitOrder(orderPayload: {
  buyerName: string;
  buyerPhone: string;
  destination: string;
  items: any[];
  notes?: string;
}): Promise<{
  success: boolean;
  order: OrderRecord;
  source: 'supabase' | 'local';
  alertRecipient: { phone: string; email: string };
  message: string;
}> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to submit order');
  }
  return data;
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<{ success: boolean; id: string; status: string }> {
  const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return await res.json();
}
