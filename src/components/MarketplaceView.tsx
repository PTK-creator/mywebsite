import React, { useState } from 'react';
import { 
  Search, 
  Globe2, 
  MapPin, 
  Truck, 
  Tag, 
  Plus, 
  ShoppingCart, 
  Pencil, 
  User, 
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { Listing } from '../types.ts';
import { CATEGORIES, WORLD_COUNTRIES, getSvgPlaceholder } from '../data/categories.ts';

interface MarketplaceViewProps {
  listings: Listing[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onViewDetail: (category: string, cropId: string) => void;
  onAddToCart: (listing: Listing, buyNow?: boolean) => void;
  onEditListing: (listing: Listing) => void;
  onOpenAddListing: (category?: string, cropId?: string, role?: 'seller' | 'buyer') => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedDelivery: string;
  setSelectedDelivery: (delivery: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedScope: string;
  setSelectedScope: (scope: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  activeCategory,
  setActiveCategory,
  onViewDetail,
  onAddToCart,
  onEditListing,
  onOpenAddListing,
  selectedCountry,
  setSelectedCountry,
  selectedDelivery,
  setSelectedDelivery,
  searchQuery,
  setSearchQuery,
  selectedScope,
  setSelectedScope,
}) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'seller' | 'buyer'>('ALL');
  const [viewMode, setViewMode] = useState<'categories' | 'listings'>('categories');

  const currentCategoryDef = CATEGORIES[activeCategory] || CATEGORIES.electronics;

  // Filter listings based on controls
  const filteredListings = listings.filter((item) => {
    if (activeCategory && item.category !== activeCategory) return false;
    if (roleFilter !== 'ALL' && item.role !== roleFilter) return false;
    if (selectedScope !== 'ALL' && item.marketType !== selectedScope) return false;
    if (selectedCountry !== 'ALL' && item.country !== selectedCountry) return false;
    if (selectedDelivery !== 'ALL' && item.deliveryOption !== selectedDelivery) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matched =
        item.cropName.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      if (!matched) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-['Sora',sans-serif]">
            Marketplace Directory
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Browse verified direct listings across {Object.keys(CATEGORIES).length} industry sectors.
          </p>
        </div>

        <button
          onClick={() => onOpenAddListing(activeCategory, undefined, 'seller')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#e8551f] hover:from-[#ff8f5e] hover:to-[#ff6b35] text-white text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Listing in {currentCategoryDef.label}</span>
        </button>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="flex items-center gap-2 bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 sm:col-span-2 lg:col-span-2">
            <Search className="w-4 h-4 text-[#ff6b35] shrink-0" />
            <input
              type="text"
              placeholder="Search products, brands, models, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-zinc-100 text-sm w-full placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Trade Scope */}
          <div className="flex items-center gap-2 bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2">
            <Globe2 className="w-4 h-4 text-[#14b8a6] shrink-0" />
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="bg-transparent border-none outline-none text-zinc-200 text-xs sm:text-sm font-medium w-full cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900 text-zinc-200">
                All Trade Scopes
              </option>
              <option value="LOCAL" className="bg-zinc-900 text-zinc-200">
                Local Only
              </option>
              <option value="INTERNATIONAL" className="bg-zinc-900 text-zinc-200">
                International Cross-Border
              </option>
            </select>
          </div>

          {/* Country Filter */}
          <div className="flex items-center gap-2 bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2">
            <MapPin className="w-4 h-4 text-[#ff6b35] shrink-0" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent border-none outline-none text-zinc-200 text-xs sm:text-sm font-medium w-full cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900 text-zinc-200">
                All Countries
              </option>
              {WORLD_COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-zinc-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Filter */}
          <div className="flex items-center gap-2 bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2">
            <Truck className="w-4 h-4 text-[#14b8a6] shrink-0" />
            <select
              value={selectedDelivery}
              onChange={(e) => setSelectedDelivery(e.target.value)}
              className="bg-transparent border-none outline-none text-zinc-200 text-xs sm:text-sm font-medium w-full cursor-pointer"
            >
              <option value="ALL" className="bg-zinc-900 text-zinc-200">
                All Delivery Types
              </option>
              <option value="Express Delivery" className="bg-zinc-900 text-zinc-200">
                Express Delivery
              </option>
              <option value="Standard Shipping" className="bg-zinc-900 text-zinc-200">
                Standard Shipping
              </option>
              <option value="Pickup" className="bg-zinc-900 text-zinc-200">
                Local Pickup
              </option>
              <option value="International Shipping" className="bg-zinc-900 text-zinc-200">
                International Freight
              </option>
              <option value="Negotiable" className="bg-zinc-900 text-zinc-200">
                Negotiable
              </option>
            </select>
          </div>
        </div>

        {/* Second Row: Role Toggle & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-1.5 bg-zinc-800/60 p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setRoleFilter('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                roleFilter === 'ALL'
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setRoleFilter('seller')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                roleFilter === 'seller'
                  ? 'bg-[#14b8a6] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Suppliers (Sellers)
            </button>
            <button
              onClick={() => setRoleFilter('buyer')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                roleFilter === 'buyer'
                  ? 'bg-[#ff6b35] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Demands (Buyers)
            </button>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Showing {filteredListings.length} results</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const isActive = key === activeCategory;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#ff6b35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.4)] scale-105'
                  : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/5'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Description Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/60 border border-white/5 text-sm text-zinc-400">
        <div>{currentCategoryDef.desc}</div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setViewMode('categories')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              viewMode === 'categories' ? 'bg-[#ff6b35] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Subcategories
          </button>
          <button
            onClick={() => setViewMode('listings')}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              viewMode === 'listings' ? 'bg-[#ff6b35] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Listings ({filteredListings.length})
          </button>
        </div>
      </div>

      {/* VIEW: SUBCATEGORIES GRID */}
      {viewMode === 'categories' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentCategoryDef.crops.map((item) => {
            const buyersCount = listings.filter(
              (l) => l.category === activeCategory && l.cropId === item.id && l.role === 'buyer'
            ).length;
            const sellersCount = listings.filter(
              (l) => l.category === activeCategory && l.cropId === item.id && l.role === 'seller'
            ).length;

            return (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 hover:border-[#ff6b35]/60 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 text-center"
              >
                <div>
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100 group-hover:text-[#ff6b35] transition-colors mb-2">
                    {item.name}
                  </h3>
                </div>

                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-center gap-3 text-xs text-zinc-400">
                    <span>
                      <strong className="text-[#14b8a6]">{sellersCount}</strong> sellers
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-[#ff6b35]">{buyersCount}</strong> buyers
                    </span>
                  </div>

                  <button
                    onClick={() => onViewDetail(activeCategory, item.id)}
                    className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#ff6b35]" />
                    <span>View Detail</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: LISTINGS CARDS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100 font-['Sora',sans-serif]">
            Active Directory Listings ({filteredListings.length})
          </h2>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-white/5 text-zinc-400 space-y-3">
            <div className="text-3xl">📦</div>
            <div className="text-base font-semibold text-zinc-300">
              No listings match your current filters.
            </div>
            <p className="text-sm max-w-md mx-auto">
              Try changing the trade scope, country, or delivery mode above, or publish your own listing.
            </p>
            <button
              onClick={() => onOpenAddListing(activeCategory, undefined, 'seller')}
              className="px-4 py-2 rounded-xl bg-[#ff6b35] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Listing</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map((item) => {
              const displayImg =
                item.images && item.images.length > 0
                  ? item.images[0]
                  : item.image || getSvgPlaceholder(item.cropName, '📦');

              const isBuyer = item.role === 'buyer';

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-white/10 hover:border-[#ff6b35]/60 transition-all duration-300 shadow-md hover:shadow-2xl flex flex-col overflow-hidden"
                >
                  {/* Image or Banner */}
                  <div
                    onClick={() => onViewDetail(item.category, item.cropId)}
                    className="relative h-44 bg-zinc-800 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={displayImg}
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge: Buyer vs Seller */}
                    <div
                      className={`absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-sm backdrop-blur-md ${
                        isBuyer ? 'bg-[#ff6b35]/90' : 'bg-[#14b8a6]/90'
                      }`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{isBuyer ? 'Buyer Request' : 'Available Supply'}</span>
                    </div>

                    {item.source === 'supabase' && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md">
                        Cloud
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="text-xl font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                        {item.price ? `$${item.price}` : 'Budget Open'}
                      </div>
                      <div className="text-xs text-zinc-400 font-medium">{item.quantity}</div>
                    </div>

                    <div className="font-bold text-zinc-100 group-hover:text-[#ff6b35] transition-colors line-clamp-1">
                      {item.cropName}
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">
                          {item.location}, {item.country}
                        </span>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-zinc-400 line-clamp-2 bg-zinc-800/40 p-2 rounded-lg">
                        {item.notes}
                      </p>
                    )}

                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#14b8a6] bg-[#14b8a6]/10 border border-[#14b8a6]/20 self-start">
                      <Truck className="w-3 h-3" />
                      <span>{item.deliveryOption}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 mt-auto flex items-center gap-2">
                      {!isBuyer ? (
                        <>
                          <button
                            onClick={() => onAddToCart(item, false)}
                            className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Cart</span>
                          </button>
                          <button
                            onClick={() => onAddToCart(item, true)}
                            className="flex-1 py-2 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-sm"
                          >
                            Buy Now
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onViewDetail(item.category, item.cropId)}
                          className="flex-1 py-2 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Supply This Demand</span>
                        </button>
                      )}

                      <button
                        onClick={() => onEditListing(item)}
                        title="Modify / Edit this listing"
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs transition-colors shrink-0"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
