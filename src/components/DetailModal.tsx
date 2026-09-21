import React, { useState } from 'react';
import { Listing } from '../types.ts';
import { CATEGORIES, getSvgPlaceholder } from '../data/categories.ts';
import { ListingQrModal } from './ListingQrModal.tsx';

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
    icon: 'ri-box-3-line',
  };

  const itemBuyers = listings.filter(
    (l) => l.category === categoryKey && l.cropId === cropId && l.role === 'buyer'
  );
  const itemSellers = listings.filter(
    (l) => l.category === categoryKey && l.cropId === cropId && l.role === 'seller'
  );

  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');
  const [isProductQrOpen, setIsProductQrOpen] = useState<boolean>(false);
  const [qrListing, setQrListing] = useState<Listing | null>(null);

  const isQrModalOpen = isProductQrOpen || !!qrListing;

  const handleCloseQrModal = () => {
    setIsProductQrOpen(false);
    setQrListing(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          title="Close product detail"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Modal Header with Prominent 'Share Listing' Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/90 border border-white/10 flex items-center justify-center text-3xl text-[#ff6b35] shrink-0 shadow-inner">
              <i className={itemObj.icon}></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b35]">
                  {categoryDef.label} Directory
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1">
                  <i className="ri-shield-check-line text-xs"></i>
                  Verified Trade
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white font-['Sora',sans-serif] mt-0.5">
                {itemObj.name}
              </h2>
              <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                <span>Direct peer-to-peer supply and demand channel</span>
              </div>
            </div>
          </div>

          {/* Prominently Displayed 'Share Listing' Button */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              id="detail-modal-share-listing-btn"
              type="button"
              onClick={() => {
                setQrListing(null);
                setIsProductQrOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-850 hover:from-zinc-750 hover:to-zinc-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#ff6b35]/40 hover:border-[#ff6b35] shadow-lg shadow-black/30 hover:shadow-[#ff6b35]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              title="Generate scannable QR code representation of this product's URL for mobile devices"
            >
              <i className="ri-qr-code-line text-[#ff6b35] text-base"></i>
              <span>Share Listing</span>
            </button>
          </div>
        </div>

        {/* Tabs: Sellers vs Buyers */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 p-1 bg-zinc-800/70 rounded-xl">
            <button
              onClick={() => setActiveTab('sellers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'sellers'
                  ? 'bg-[#14b8a6] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <i className="ri-store-2-line"></i>
              <span>Active Sellers ({itemSellers.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('buyers')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'buyers'
                  ? 'bg-[#ff6b35] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <i className="ri-user-search-line"></i>
              <span>Active Buyers ({itemBuyers.length})</span>
            </button>
          </div>

          <button
            onClick={onPostAsBuyer}
            className="px-3.5 py-1.5 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <i className="ri-add-line text-sm"></i>
            <span>Post as Buyer</span>
          </button>
        </div>

        {/* Tab Content: Sellers */}
        {activeTab === 'sellers' && (
          <div className="space-y-4">
            {itemSellers.length === 0 ? (
              <div className="text-center py-12 bg-zinc-800/30 rounded-xl border border-white/5 text-zinc-400 text-xs flex flex-col items-center gap-2">
                <i className="ri-inbox-line text-3xl text-zinc-600"></i>
                <p>No active supplier listings currently posted for {itemObj.name}.</p>
                <button
                  onClick={onPostAsBuyer}
                  className="mt-1 text-[#ff6b35] hover:underline font-semibold"
                >
                  Post a buyer request to attract suppliers &rarr;
                </button>
              </div>
            ) : (
              itemSellers.map((s) => {
                const imgs = s.images && s.images.length > 0 ? s.images : s.image ? [s.image] : [];
                const cleanPhone = s.phone.replace(/[^0-9]/g, '');

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
                            alt={`${s.cropName} sample ${i + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0 bg-zinc-900"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getSvgPlaceholder(s.cropName, itemObj.icon);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="font-bold text-base text-zinc-100 flex items-center gap-2">
                        <span>{s.name}</span>
                        <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                          Supplier
                        </span>
                      </div>
                      <div className="text-base font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                        ${s.price || 'Negotiable'}
                        <span className="text-xs font-normal text-zinc-400 ml-1">
                          / {s.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <i className="ri-map-pin-2-line text-zinc-500 shrink-0"></i>
                        <span className="truncate">{s.location}, {s.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <i className="ri-truck-line text-zinc-500 shrink-0"></i>
                        <span className="truncate">Delivery: {s.deliveryOption}</span>
                      </div>
                    </div>

                    {s.notes && (
                      <p className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-white/5">
                        {s.notes}
                      </p>
                    )}

                    {/* Direct Contact Links & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <i className="ri-phone-line text-emerald-400"></i>
                          <span>{s.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hello ${s.name}, I found your listing for ${s.cropName} ($${s.price || 'Negotiable'} / ${s.quantity}) on PTK-Link.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <i className="ri-whatsapp-line"></i>
                          <span>WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setQrListing(s);
                            setIsProductQrOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700/80 hover:bg-zinc-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/5 transition-colors"
                          title="Generate QR code for mobile trade sharing"
                        >
                          <i className="ri-qr-code-line text-[#ff6b35]"></i>
                          <span>Share QR</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAddToCart(s, false)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <i className="ri-shopping-cart-2-line"></i>
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
                          <i className="ri-edit-line"></i>
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
              <div className="text-center py-12 bg-zinc-800/30 rounded-xl border border-white/5 text-zinc-400 text-xs flex flex-col items-center gap-2">
                <i className="ri-inbox-line text-3xl text-zinc-600"></i>
                <p>No active buyer requests currently posted for {itemObj.name}.</p>
                <button
                  onClick={onPostAsBuyer}
                  className="mt-1 text-[#ff6b35] hover:underline font-semibold"
                >
                  Be the first to post a purchase requirement &rarr;
                </button>
              </div>
            ) : (
              itemBuyers.map((b) => {
                const cleanPhone = b.phone.replace(/[^0-9]/g, '');

                return (
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
                        <i className="ri-map-pin-2-line text-zinc-500 shrink-0"></i>
                        <span className="truncate">{b.location}, {b.country}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <i className="ri-truck-line text-zinc-500 shrink-0"></i>
                        <span className="truncate">Preferred: {b.deliveryOption}</span>
                      </div>
                    </div>

                    {b.notes && (
                      <p className="text-xs text-zinc-300 bg-zinc-900/60 p-2.5 rounded-lg border border-white/5">
                        {b.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <i className="ri-phone-line text-emerald-400"></i>
                          <span>{b.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Hello ${b.name}, I can supply ${b.cropName} according to your request on PTK-Link.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <i className="ri-whatsapp-line"></i>
                          <span>WhatsApp Buyer</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setQrListing(b);
                            setIsProductQrOpen(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-700/80 hover:bg-zinc-600 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/5 transition-colors"
                          title="Generate QR code for mobile trade sharing"
                        >
                          <i className="ri-qr-code-line text-[#ff6b35]"></i>
                          <span>Share QR</span>
                        </button>
                      </div>

                      <button
                        onClick={() => onEditListing(b)}
                        title="Edit this listing"
                        className="p-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* QR Code Sharing Modal */}
        <ListingQrModal
          isOpen={isQrModalOpen}
          onClose={handleCloseQrModal}
          categoryKey={categoryKey}
          cropId={cropId}
          cropName={itemObj.name}
          cropIcon={itemObj.icon}
          listing={qrListing}
        />
      </div>
    </div>
  );
};
