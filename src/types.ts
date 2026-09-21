export type MarketType = 'LOCAL' | 'INTERNATIONAL';
export type DeliveryOption = 'Express Delivery' | 'Standard Shipping' | 'Pickup' | 'International Shipping' | 'Negotiable';
export type ListingRole = 'seller' | 'buyer';
export type ListingStatus = 'active' | 'sold' | 'archived';
export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled';

export interface Listing {
  id: string;
  category: string;
  cropId: string;
  cropName: string;
  role: ListingRole;
  name: string;
  phone: string;
  country: string;
  location: string;
  marketType: MarketType;
  deliveryOption: DeliveryOption;
  quantity: string;
  price: string;
  notes?: string;
  image?: string | null;
  images?: string[];
  status?: ListingStatus;
  date: string;
  source?: 'supabase' | 'local';
}

export interface BuyerRecord {
  id: string;
  name: string;
  phone: string;
  country: string;
  location: string;
  interest: string;
  created_at?: string;
}

export interface SellerRecord {
  id: string;
  name: string;
  phone: string;
  country: string;
  location: string;
  product: string;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  cropName: string;
  price: string;
  sellerName: string;
  sellerPhone: string;
  deliveryOption: string;
  image?: string | null;
  qty: number;
}

export interface OrderRecord {
  id: string;
  time: string;
  buyerName: string;
  buyerPhone: string;
  destination: string;
  items: OrderItem[];
  itemsSummary: string;
  total: number;
  status: OrderStatus;
  notes?: string;
}

export interface SupabaseStatus {
  configured: boolean;
  url: string;
  connected: boolean;
  latencyMs?: number;
  tables: {
    listings: boolean;
    buyers: boolean;
    sellers: boolean;
    orders: boolean;
  };
  allTablesReady?: boolean;
  error?: string | null;
  message?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
}

export interface CategoryDef {
  label: string;
  icon: string;
  desc: string;
  crops: CategoryItem[];
}
