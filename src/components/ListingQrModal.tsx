import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Listing } from '../types.ts';

interface ListingQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryKey: string;
  cropId: string;
  cropName: string;
  cropIcon?: string;
  listing?: Listing | null;
}

export const ListingQrModal: React.FC<ListingQrModalProps> = ({
  isOpen,
  onClose,
  categoryKey,
  cropId,
  cropName,
  cropIcon,
  listing,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'whatsapp'>('url');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [canShare, setCanShare] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanShare(true);
    }
  }, []);

  // Ensure tabs reset appropriately when listing changes
  useEffect(() => {
    if (!listing && activeTab === 'whatsapp') {
      setActiveTab('url');
    }
  }, [listing, activeTab]);

  // Safe Origin Validation (Hacker Defense & XSS hardening)
  const getSafeOrigin = (): string => {
    if (typeof window === 'undefined') return '';
    try {
      const parsed = new URL(window.location.href);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.origin.replace(/\/$/, '');
      }
    } catch {
      // Fallback
    }
    return '';
  };

  // Safe canonical trade URL
  const getProductUrl = (): string => {
    const origin = getSafeOrigin();
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const safeCat = encodeURIComponent(categoryKey || 'all');
    const safeCrop = encodeURIComponent(cropId || '');
    
    let url = `${origin}${path}?category=${safeCat}&crop=${safeCrop}`;
    if (listing?.id) {
      url += `&listing=${encodeURIComponent(listing.id)}`;
    }
    return url;
  };

  // Safe WhatsApp Link
  const getWhatsAppUrl = (): string => {
    if (!listing) return '';
    const cleanPhone = listing.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return '';
    
    const message = listing.role === 'seller'
      ? `Hello ${listing.name}, I am viewing your listing for ${listing.cropName} ($${listing.price || 'Negotiable'} / ${listing.quantity}) on PTK-Link Trade Directory.`
      : `Hello ${listing.name}, I saw your demand for ${listing.cropName} on PTK-Link Trade Directory.`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const currentPayload = activeTab === 'whatsapp' && listing ? getWhatsAppUrl() : getProductUrl();

  // Generate High-Density QR code with Error Correction Level H (30% redundancy)
  useEffect(() => {
    if (!isOpen || !currentPayload) return;

    let isMounted = true;
    QRCode.toDataURL(currentPayload, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#09090b', // Deep zinc black for optimal optical camera scanning
        light: '#ffffff', // Pure white boundary for scanner contrast
      },
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate secure QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentPayload]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Ignore
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const sanitizedName = (cropName || 'listing')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `ptk-link-${sanitizedName}-qr.png`;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: `${cropName} - PTK-Link Verified Trade`,
        text: listing
          ? `View verified trade offer for ${cropName} by ${listing.name} on PTK-Link.`
          : `Scan and explore real-time buyer demands & supplier listings for ${cropName} on PTK-Link.`,
        url: currentPayload,
      });
      setShareFeedback('Shared successfully');
      setTimeout(() => setShareFeedback(null), 3000);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Native share error:', err);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          title="Close QR Modal"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#14b8a6]/20 border border-white/10 flex items-center justify-center text-[#ff6b35] shrink-0 text-xl shadow-inner">
            <i className="ri-qr-code-line"></i>
          </div>
          <div className="pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6b35] flex items-center gap-1">
                <i className="ri-shield-check-line text-xs text-emerald-400"></i>
                Verified Trade Pass
              </span>
              {listing && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    listing.role === 'seller'
                      ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-950/70 border border-amber-500/30 text-amber-300'
                  }`}
                >
                  {listing.role === 'seller' ? 'Supplier Offer' : 'Buyer Demand'}
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-white leading-tight font-['Sora',sans-serif] flex items-center gap-2 mt-0.5">
              {cropIcon && <i className={`${cropIcon} text-base text-[#ff6b35]`}></i>}
              <span>{cropName}</span>
            </h3>
          </div>
        </div>

        {/* Listing or Commodity Scope Overview */}
        {listing ? (
          <div className="p-3 mb-4 rounded-xl bg-zinc-800/60 border border-white/5 space-y-1.5 text-xs text-zinc-300">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-zinc-100 truncate">{listing.name}</span>
              <span className="text-[#ff6b35] font-bold shrink-0">
                ${listing.price || 'Negotiable'}
                <span className="text-zinc-400 font-normal ml-1">/ {listing.quantity}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
              <span className="flex items-center gap-1 truncate">
                <i className="ri-map-pin-2-line text-zinc-500 shrink-0"></i>
                <span className="truncate">{listing.location}, {listing.country}</span>
              </span>
              <span className="flex items-center gap-1 shrink-0 font-mono text-zinc-300">
                <i className="ri-phone-line text-emerald-400 shrink-0"></i>
                <span>{listing.phone}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 mb-4 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center justify-between text-xs text-zinc-300">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <i className="ri-store-2-line text-[#14b8a6]"></i>
              Public Marketplace Listing URL
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-700 text-zinc-300 font-mono text-[10px]">
              Ready to Scan
            </span>
          </div>
        )}

        {/* Tab switch if listing is provided */}
        {listing && (
          <div className="flex p-1 bg-zinc-800/80 rounded-xl mb-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'url'
                  ? 'bg-[#14b8a6] text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <i className="ri-smartphone-line text-sm"></i>
              <span>Product Page Link</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('whatsapp')}
              className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <i className="ri-whatsapp-line text-sm"></i>
              <span>Direct WhatsApp</span>
            </button>
          </div>
        )}

        {/* QR Code Presentation Box */}
        <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-inner border border-white/20 relative group">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${cropName}`}
              className="w-56 h-56 object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-zinc-400 text-xs">
              Generating secure high-resolution QR code...
            </div>
          )}

          <div className="mt-2.5 text-[11px] font-medium text-zinc-700 flex items-center gap-1.5">
            <i className="ri-camera-lens-line text-emerald-600 text-sm"></i>
            <span>Scan with mobile camera to view instant trade details</span>
          </div>
        </div>

        {/* Encoded URL / Payload Preview */}
        <div className="mt-4 flex items-center gap-2 p-2 bg-zinc-800/70 rounded-xl border border-white/5">
          <i className="ri-links-line text-zinc-500 text-sm ml-1 shrink-0"></i>
          <input
            type="text"
            readOnly
            value={currentPayload}
            className="flex-1 bg-transparent text-xs text-zinc-300 font-mono outline-none px-1 truncate select-all"
          />
          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
            title="Copy URL to clipboard"
          >
            <i className={copied ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'}></i>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-2 px-3 bg-[#ff6b35] hover:bg-[#e8551f] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-[0.98]"
          >
            <i className="ri-download-2-line text-sm"></i>
            <span>Download PNG</span>
          </button>

          {canShare && (
            <button
              onClick={handleNativeShare}
              className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              title="Share via device menu"
            >
              <i className="ri-share-forward-line text-[#14b8a6] text-sm"></i>
              <span>Share</span>
            </button>
          )}

          <a
            href={currentPayload}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-white/10 transition-colors"
            title="Open preview in new tab"
          >
            <i className="ri-external-link-line text-sm"></i>
          </a>
        </div>

        {shareFeedback && (
          <div className="mt-2 text-center text-xs text-emerald-400 font-medium">
            {shareFeedback}
          </div>
        )}
      </div>
    </div>
  );
};
