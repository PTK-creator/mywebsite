import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  Truck, 
  Store, 
  PlusCircle, 
  Flame, 
  ArrowRight, 
  ShoppingCart, 
  Pencil, 
  User, 
  Globe2 
} from 'lucide-react';
import { Listing } from '../types.ts';
import { WORLD_COUNTRIES, getSvgPlaceholder } from '../data/categories.ts';

interface HeroProps {
  listings: Listing[];
  onExploreMarket: () => void;
  onPostListing: () => void;
  onAddToCart: (listing: Listing, buyNow?: boolean) => void;
  onViewDetail: (category: string, cropId: string) => void;
  onEditListing: (listing: Listing) => void;
  onFilterCountry: (country: string) => void;
  onFilterDelivery: (delivery: string) => void;
  selectedCountry: string;
  selectedDelivery: string;
}

const SHOWCASE_SLIDES = [
  {
    icon: 'ri-macbook-line',
    title: 'Consumer Electronics',
    description: 'Laptops, 5G smartphones, smart appliances, photography cameras, and commercial gadgets with direct seller pricing.',
  },
  {
    icon: 'ri-car-line',
    title: 'Automobiles & Fleet',
    description: 'Sedans, commercial pickups, tractors, motorcycles, and authentic OEM spare parts with door-to-door delivery.',
  },
  {
    icon: 'ri-shirt-line',
    title: 'Apparel & Fashion',
    description: 'Quality garments, bespoke tailored suits, footwear, textiles, and certified institutional work uniforms.',
  },
  {
    icon: 'ri-plant-line',
    title: 'Produce & Harvests',
    description: 'Export grade avocados, mangoes, grains, organic vegetables, and bulk commercial cash crops with freight logistics.',
  },
];

export const Hero: React.FC<HeroProps> = ({
  listings,
  onExploreMarket,
  onPostListing,
  onAddToCart,
  onViewDetail,
  onEditListing,
  onFilterCountry,
  onFilterDelivery,
  selectedCountry,
  selectedDelivery,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const featuredSellers = listings.filter((l) => l.role === 'seller').slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-16">
      {/* Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#ff6b35] bg-[#ff6b35]/10 border border-[#ff6b35]/25">
            <Zap className="w-3.5 h-3.5" />
            <span>Multi-Category P2P Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-['Sora',sans-serif]">
            Buy & Sell Across Borders With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff8f5e] to-[#ff6b35]">
              Zero Middlemen
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
            Connect directly with verified buyers and sellers for electronics, automobiles, stationery, fashion, produce, and commercial crops worldwide. Backed by real-time Supabase cloud persistence.
          </p>

          {/* Quick Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 shadow-sm">
              <MapPin className="w-4 h-4 text-[#ff6b35] shrink-0" />
              <select
                value={selectedCountry}
                onChange={(e) => onFilterCountry(e.target.value)}
                className="bg-transparent border-none outline-none text-zinc-200 text-sm font-medium w-full cursor-pointer"
              >
                <option value="ALL" className="bg-zinc-900 text-zinc-200">
                  Filter by Country (All)
                </option>
                {WORLD_COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-zinc-200">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2.5 bg-zinc-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 shadow-sm">
              <Truck className="w-4 h-4 text-[#14b8a6] shrink-0" />
              <select
                value={selectedDelivery}
                onChange={(e) => onFilterDelivery(e.target.value)}
                className="bg-transparent border-none outline-none text-zinc-200 text-sm font-medium w-full cursor-pointer"
              >
                <option value="ALL" className="bg-zinc-900 text-zinc-200">
                  All Delivery Modes
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

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreMarket}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#e8551f] hover:from-[#ff8f5e] hover:to-[#ff6b35] text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-[0_4px_20px_rgba(255,107,53,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Store className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </button>

            <button
              onClick={onPostListing}
              className="px-6 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 font-semibold text-sm sm:text-base flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#ff6b35]" />
              <span>Post Your Listing</span>
            </button>
          </div>

          {/* Stat Row */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Sora',sans-serif]">
                {listings.length}
              </div>
              <div className="text-xs text-zinc-400 font-medium">Active Listings</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#14b8a6] font-['Sora',sans-serif]">
                7
              </div>
              <div className="text-xs text-zinc-400 font-medium">Global Categories</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                0%
              </div>
              <div className="text-xs text-zinc-400 font-medium">Middleman Fees</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Sora',sans-serif]">
                100%
              </div>
              <div className="text-xs text-zinc-400 font-medium">Direct P2P Trading</div>
            </div>
          </div>
        </div>

        {/* Right Column: Showcase Slider */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950 border border-white/10 p-7 shadow-2xl overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-3xl text-[#ff6b35] shadow-inner">
                <i className={SHOWCASE_SLIDES[currentSlide].icon}></i>
              </div>
              <h3 className="text-2xl font-bold text-white font-['Sora',sans-serif]">
                {SHOWCASE_SLIDES[currentSlide].title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed min-h-[70px]">
                {SHOWCASE_SLIDES[currentSlide].description}
              </p>

              {/* Dots */}
              <div className="flex items-center gap-2 pt-2">
                {SHOWCASE_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? 'w-8 bg-[#ff6b35]' : 'w-2 bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Ambient background glow */}
            <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-[#ff6b35]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-16 -left-16 w-52 h-52 bg-[#14b8a6]/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff6b35] mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Trending Now</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Sora',sans-serif]">
              Featured Marketplace Items
            </h2>
          </div>

          <button
            onClick={onExploreMarket}
            className="text-xs sm:text-sm font-bold text-zinc-300 hover:text-[#ff6b35] flex items-center gap-1.5 transition-colors group"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {featuredSellers.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-white/5 text-zinc-400 text-sm">
            No seller products match your filters yet. Post your listing to be the first!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredSellers.map((item) => {
              const displayImg =
                item.images && item.images.length > 0
                  ? item.images[0]
                  : item.image || getSvgPlaceholder(item.cropName, '📦');

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-zinc-900/70 hover:bg-zinc-900 border border-white/10 hover:border-[#ff6b35]/60 transition-all duration-300 shadow-md hover:shadow-2xl hover:-translate-y-1 flex flex-col overflow-hidden"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => onViewDetail(item.category, item.cropId)}
                    className="relative h-44 bg-zinc-800 cursor-pointer overflow-hidden"
                  >
                    <img
                      src={displayImg}
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold text-white bg-black/60 backdrop-blur-md">
                      <Globe2 className="w-3 h-3 text-[#14b8a6]" />
                      <span>{item.marketType === 'INTERNATIONAL' ? 'Cross-Border' : 'Local'}</span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 backdrop-blur-md">
                      Verified
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="text-xl font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                        ${item.price || 'Negotiable'}
                      </div>
                      <div className="text-xs text-zinc-400 font-medium">
                        {item.quantity}
                      </div>
                    </div>

                    <div className="font-bold text-zinc-100 line-clamp-1 group-hover:text-[#ff6b35] transition-colors">
                      {item.cropName}
                    </div>

                    <div className="text-xs text-zinc-400 space-y-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <User className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{item.location}, {item.country}</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#14b8a6] bg-[#14b8a6]/10 border border-[#14b8a6]/20 self-start">
                      <Truck className="w-3 h-3" />
                      <span>{item.deliveryOption}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 mt-auto grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onAddToCart(item, false)}
                        title="Add to Cart"
                        className="py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cart</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(item, true)}
                        className="py-2 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-sm"
                      >
                        Buy Now
                      </button>

                      <button
                        onClick={() => onEditListing(item)}
                        title="Modify or Update Listing"
                        className="py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-medium flex items-center justify-center transition-colors"
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
