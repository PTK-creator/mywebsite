import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { MarketplaceView } from './components/MarketplaceView.tsx';
import { DetailModal } from './components/DetailModal.tsx';
import { AddListingModal } from './components/AddListingModal.tsx';
import { EditListingModal } from './components/EditListingModal.tsx';
import { CartModal } from './components/CartModal.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { DatabaseModal } from './components/DatabaseModal.tsx';
import { NavSearchModal } from './components/NavSearchModal.tsx';
import { AboutContactViews } from './components/AboutContactViews.tsx';
import { Footer } from './components/Footer.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import { 
  Listing, 
  OrderItem, 
  BuyerRecord, 
  SellerRecord, 
  OrderRecord, 
  SupabaseStatus 
} from './types.ts';
import { 
  fetchListings, 
  createListing, 
  updateListing, 
  deleteListing, 
  fetchBuyers, 
  fetchSellers, 
  fetchOrders, 
  submitOrder, 
  updateOrderStatus, 
  fetchSupabaseStatus, 
  fetchSupabaseSchemaSql 
} from './lib/api.ts';

export default function App() {
  // Navigation & View
  const [currentPage, setCurrentPage] = useState<'home' | 'market' | 'about' | 'contact'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('electronics');

  // Filters
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('ALL');
  const [selectedScope, setSelectedScope] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data Store
  const [listings, setListings] = useState<Listing[]>([]);
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [sellers, setSellers] = useState<SellerRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [cart, setCart] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('ptk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Supabase Diagnostics
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [schemaSql, setSchemaSql] = useState<string>('');

  // Modals state
  const [isAddListingOpen, setIsAddListingOpen] = useState<boolean>(false);
  const [addListingInitialRole, setAddListingInitialRole] = useState<'seller' | 'buyer'>('seller');
  const [addListingCategory, setAddListingCategory] = useState<string>('electronics');
  const [addListingCropId, setAddListingCropId] = useState<string | undefined>(undefined);

  const [isEditListingOpen, setIsEditListingOpen] = useState<boolean>(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [detailCategory, setDetailCategory] = useState<string>('electronics');
  const [detailCropId, setDetailCropId] = useState<string>('');

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(false);
  const [databaseTab, setDatabaseTab] = useState<'buyers' | 'sellers' | 'sales' | 'supabase'>('buyers');
  const [isNavSearchOpen, setIsNavSearchOpen] = useState<boolean>(false);

  // UI state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [buyerNotifications, setBuyerNotifications] = useState<Array<{ id: number; text: string; time: string }>>([]);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('ptk_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Toast Helper
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Theme Manager
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-theme');
    }
  }, [isDark]);

  // Load Data from API
  const refreshData = useCallback(async () => {
    try {
      const [listingsRes, buyersRes, sellersRes, ordersRes, statusRes, schemaText] = await Promise.all([
        fetchListings(),
        fetchBuyers().catch(() => ({ buyers: [] })),
        fetchSellers().catch(() => ({ sellers: [] })),
        fetchOrders().catch(() => ({ orders: [] })),
        fetchSupabaseStatus().catch(() => null),
        fetchSupabaseSchemaSql().catch(() => ''),
      ]);

      if (listingsRes.listings) setListings(listingsRes.listings);
      if (buyersRes.buyers) setBuyers(buyersRes.buyers);
      if (sellersRes.sellers) setSellers(sellersRes.sellers);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (statusRes) setSupabaseStatus(statusRes);
      if (schemaText) setSchemaSql(schemaText);
    } catch (err) {
      console.warn('Initial data load error:', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handlers for Listings (Store, Retrieve, Modify)
  const handleCreateListing = async (formData: any) => {
    const res = await createListing(formData);
    setListings((prev) => [res.listing, ...prev]);

    if (res.listing.role === 'buyer') {
      const notif = {
        id: Date.now(),
        text: `${res.listing.name} posted demand for ${res.listing.cropName} in ${res.listing.country}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setBuyerNotifications((prev) => [notif, ...prev]);
      addToast(`🔔 New Buyer Request posted for ${res.listing.cropName}!`, 'info');
    } else {
      addToast(
        res.source === 'supabase'
          ? '🎉 Product published and persisted in Supabase Cloud!'
          : '🎉 Product published in local cache (Sync to Supabase ready)',
        'success'
      );
    }

    // Refresh directories
    fetchBuyers().then((b) => setBuyers(b.buyers)).catch(() => {});
    fetchSellers().then((s) => setSellers(s.sellers)).catch(() => {});
  };

  const handleUpdateListing = async (id: string, updates: Partial<Listing>) => {
    await updateListing(id, updates);
    setListings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    addToast('✅ Listing modified and updated successfully.', 'success');
  };

  const handleDeleteListing = async (id: string) => {
    await deleteListing(id);
    setListings((prev) => prev.filter((item) => item.id !== id));
    addToast('🗑️ Listing removed from marketplace.', 'info');
  };

  // Cart operations
  const handleAddToCart = (item: Listing, buyNow = false) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: item.id,
          cropName: item.cropName,
          price: item.price || '0',
          sellerName: item.name,
          sellerPhone: item.phone,
          deliveryOption: item.deliveryOption,
          image: item.images && item.images.length > 0 ? item.images[0] : item.image,
          qty: 1,
        },
      ];
    });

    if (buyNow) {
      setIsCartOpen(true);
    } else {
      addToast(`🛒 Added ${item.cropName} to your cart!`, 'success');
    }
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Checkout submission
  const handleSubmitOrder = async (orderData: {
    buyerName: string;
    buyerPhone: string;
    destination: string;
    notes?: string;
  }) => {
    const res = await submitOrder({
      ...orderData,
      items: cart,
    });

    setOrders((prev) => [res.order, ...prev]);
    setCart([]);
    addToast(
      `🎉 Order Confirmed! Sellers and coordinators (${res.alertRecipient.phone}) have been notified for delivery.`,
      'success'
    );
    // Refresh buyers directory
    fetchBuyers().then((b) => setBuyers(b.buyers)).catch(() => {});
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
    );
    addToast(`Order ${orderId} marked as ${status}.`, 'info');
  };

  // Modal Triggers
  const openAddListingModal = (
    category?: string,
    cropId?: string,
    role: 'seller' | 'buyer' = 'seller'
  ) => {
    setAddListingCategory(category || activeCategory);
    setAddListingCropId(cropId);
    setAddListingInitialRole(role);
    setIsAddListingOpen(true);
  };

  const openEditListingModal = (listing: Listing) => {
    setEditingListing(listing);
    setIsEditListingOpen(true);
  };

  const openDetailModal = (category: string, cropId: string) => {
    setDetailCategory(category);
    setDetailCropId(cropId);
    setIsDetailOpen(true);
  };

  const openDatabaseModal = (initialTab: 'buyers' | 'sellers' | 'sales' | 'supabase' = 'buyers') => {
    setDatabaseTab(initialTab);
    setIsDatabaseOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1115] text-[#f8f6f2] font-['Inter',sans-serif]">
      {/* Background ambient gradient glow blobs */}
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-[#ff6b35]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-[#14b8a6]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main App Container */}
      <div className="relative z-10 flex flex-col flex-1">
        <Header
          currentPage={currentPage}
          setCurrentPage={(p) => setCurrentPage(p as any)}
          cartCount={cart.reduce((s, i) => s + i.qty, 0)}
          openCart={() => setIsCartOpen(true)}
          openAddListing={(role) => openAddListingModal(undefined, undefined, role)}
          openDatabase={openDatabaseModal}
          openSearch={() => setIsNavSearchOpen(true)}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
          supabaseStatus={supabaseStatus}
          buyerNotifications={buyerNotifications}
          clearNotifications={() => setBuyerNotifications([])}
        />

        {/* Content Router */}
        <main className="flex-1">
          {currentPage === 'home' && (
            <Hero
              listings={listings}
              onExploreMarket={() => setCurrentPage('market')}
              onPostListing={() => openAddListingModal('electronics', undefined, 'seller')}
              onAddToCart={handleAddToCart}
              onViewDetail={openDetailModal}
              onEditListing={openEditListingModal}
              onFilterCountry={setSelectedCountry}
              onFilterDelivery={setSelectedDelivery}
              selectedCountry={selectedCountry}
              selectedDelivery={selectedDelivery}
              supabaseStatus={supabaseStatus}
            />
          )}

          {currentPage === 'market' && (
            <MarketplaceView
              listings={listings}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onViewDetail={openDetailModal}
              onAddToCart={handleAddToCart}
              onEditListing={openEditListingModal}
              onOpenAddListing={openAddListingModal}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedDelivery={selectedDelivery}
              setSelectedDelivery={setSelectedDelivery}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedScope={selectedScope}
              setSelectedScope={setSelectedScope}
            />
          )}

          {(currentPage === 'about' || currentPage === 'contact') && (
            <AboutContactViews view={currentPage} />
          )}
        </main>

        <Footer
          onNavigate={(p) => setCurrentPage(p as any)}
          openDatabase={openDatabaseModal}
          supabaseStatus={supabaseStatus}
        />
      </div>

      {/* MODALS */}
      <AddListingModal
        isOpen={isAddListingOpen}
        onClose={() => setIsAddListingOpen(false)}
        initialCategory={addListingCategory}
        initialCropId={addListingCropId}
        initialRole={addListingInitialRole}
        onSubmit={handleCreateListing}
      />

      <EditListingModal
        isOpen={isEditListingOpen}
        onClose={() => {
          setIsEditListingOpen(false);
          setEditingListing(null);
        }}
        listing={editingListing}
        onUpdate={handleUpdateListing}
        onDelete={handleDeleteListing}
      />

      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        categoryKey={detailCategory}
        cropId={detailCropId}
        listings={listings}
        onAddToCart={handleAddToCart}
        onPostAsBuyer={() => {
          setIsDetailOpen(false);
          openAddListingModal(detailCategory, detailCropId, 'buyer');
        }}
        onEditListing={(item) => {
          setIsDetailOpen(false);
          openEditListingModal(item);
        }}
      />

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onSubmitOrder={handleSubmitOrder}
      />

      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
        initialTab={databaseTab}
        buyers={buyers}
        sellers={sellers}
        orders={orders}
        supabaseStatus={supabaseStatus}
        onRefreshStatus={refreshData}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        schemaSql={schemaSql}
      />

      <NavSearchModal
        isOpen={isNavSearchOpen}
        onClose={() => setIsNavSearchOpen(false)}
        listings={listings}
        onSelectListing={openDetailModal}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
