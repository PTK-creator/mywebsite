import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Truck, 
  Globe2, 
  Plus, 
  ShoppingCart, 
  Pencil, 
  Tag, 
  User, 
  MessageSquare 
} from 'lucide-react';
import { Listing } from '../types.ts';
import { CATEGORIES, getSvgPlaceholder } from '../data/categories.ts';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryKey: string;
  cropId: string;
  listings: Listing[];
  onAddToCart: (listing: Listing, buyNow?: boolean) => void;
  onPostAsBuyer: () => void;
  onEditListing: (listing: Listing) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  categoryKey,
  cropId,
  listings,
  onAddToCart,
  onPostAsBuyer,
  onEditListing,
}) => {
  if (!isOpen) return null;

  const categoryDef = CATEGORIES[categoryKey] || CATEGORIES.electronics;
  const itemObj = categoryDef.crops.find((c) => c.id === cropId) || {
    id: cropId,
    name: cropId,
    icon: '📦',
  };

  const itemBuyers = listings.filter(
    (l) => l.category === categoryKey && l.cropId === cropId && l.role === 'buyer'
  );
  const itemSellers = listings.filter(
    (l) => l.category === categoryKey && l.cropId === cropId && l.role === 'seller'
  );

  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Head */}
        <div className="flex items-center gap-4 pb-5 mb-5 border-b border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-3xl shrink-0">
            {itemObj.icon}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#ff6b35]">
              {categoryDef.label} Directory
            </div>
            <h2 className="text-2xl font-extrabold text-white font-['Sora',sans-serif]">
              {itemObj.name}
            </h2>
            <div className="text-xs text-zinc-400 mt-0.5">
              Direct peer-to-peer supply and demand channel
            </div>
          </div>
        </div>

        {/* Tabs: Sellers vs Buyers */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 p-1 bg-zinc-800/70 rounded-xl">
            <button
              onClick={() => setActiveTab('sellers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sellers'
                  ? 'bg-[#14b8a6] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Active Sellers ({itemSellers.length})
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'buyers'
                  ? 'bg-[#ff6b35] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Active Buyers ({itemBuyers.length})
            </button>
          </div>

          <button
            onClick={onPostAsBuyer}
            className="px-3 py-1.5 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post as Buyer</span>
          </button>
        </div>

        {/* Tab Content: Sellers */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            {itemSellers.length === 0 ? (
              <div className="text-center py-12 bg-zinc-800/30 rounded-xl border border-white/5 text-zinc-400 text-xs">
                No sellers listed yet for {itemObj.name}.
              </div>
            ) : (
              itemSellers.map((s) => {
                const imgs = s.images && s.images.length > 0 ? s.images : s.image ? [s.image] : [];
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 border border-white/10 transition-colors space-y-3"
                  >
                    {/* Image thumbnails */}
                    {imgs.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {imgs.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt="product thumbnail"
                            className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="font-bold text-base text-zinc-100 flex items-center gap-2">
                        <span>{s.name}</span>
                        <span className="text-xs text-[#14b8a6] font-semibold bg-[#14b8a6]/10 px-2 py-0.5 rounded">
                          Supplier
                        </span>
                      </div>
                      <div className="text-lg font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                        ${s.price || 'Negotiable'}
                        <span className="text-xs font-normal text-zinc-400 ml-1">
                          / {s.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{s.location}, {s.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Truck className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span className="truncate">{s.deliveryOption}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Globe2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{s.marketType === 'INTERNATIONAL' ? 'Cross-Border' : 'Domestic'}</span>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg">
                        {s.notes}
                      </p>
                    )}

                    {/* Direct Contact Links & Purchase */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{s.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${s.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${s.name}, I found your listing for ${s.cropName} on PTK-Link.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddToCart(s, false)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => onAddToCart(s, true)}
                          className="px-4 py-1.5 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold shadow-sm transition-colors"
                        >
                          Buy Now
                        </button>
                        <button
                          onClick={() => onEditListing(s)}
                          title="Edit this listing"
                          className="p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Content: Buyers */}
        {activeTab === 'buyers' && (
          <div className="space-y-4">
            {itemBuyers.length === 0 ? (
              <div className="text-center py-12 bg-zinc-800/30 rounded-xl border border-white/5 text-zinc-400 text-xs">
                No active buyer requests currently posted for {itemObj.name}.
              </div>
            ) : (
              itemBuyers.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800/80 border border-white/10 transition-colors space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="font-bold text-base text-zinc-100 flex items-center gap-2">
                      <span>{b.name}</span>
                      <span className="text-xs text-[#ff6b35] font-semibold bg-[#ff6b35]/10 px-2 py-0.5 rounded">
                        Buyer Demand
                      </span>
                    </div>
                    <div className="text-base font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                      Budget: ${b.price || 'Open'}
                      <span className="text-xs font-normal text-zinc-400 ml-1">
                        (Needs {b.quantity})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">{b.location}, {b.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Truck className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <span className="truncate">Preferred: {b.deliveryOption}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg">
                      {b.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{b.phone}</span>
                      </a>

                      <a
                        href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${b.name}, I can supply ${b.cropName} according to your request on PTK-Link.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp Buyer</span>
                      </a>
                    </div>

                    <button
                      onClick={() => onEditListing(b)}
                      title="Edit this listing"
                      className="p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
