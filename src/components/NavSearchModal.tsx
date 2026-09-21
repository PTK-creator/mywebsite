import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, User, MapPin } from 'lucide-react';
import { Listing } from '../types.ts';
import { getSvgPlaceholder } from '../data/categories.ts';

interface NavSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onSelectListing: (category: string, cropId: string) => void;
}

export const NavSearchModal: React.FC<NavSearchModalProps> = ({
  isOpen,
  onClose,
  listings,
  onSelectListing,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const results = q
    ? listings.filter(
        (l) =>
          l.cropName.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          (l.notes && l.notes.toLowerCase().includes(q))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 max-h-[80vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold text-white font-['Sora',sans-serif] mb-4 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#ff6b35]" />
          <span>Instant Marketplace Search</span>
        </h2>

        {/* Input */}
        <div className="flex items-center gap-2.5 bg-zinc-800 border border-white/15 rounded-xl px-3.5 py-3 mb-4 focus-within:border-[#ff6b35] transition-colors">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type product name, category, crop, supplier, town..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-zinc-100 text-sm w-full placeholder:text-zinc-500"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {!query ? (
            <div className="text-center py-10 text-xs text-zinc-500">
              Start typing keywords above to search across all Supabase and local marketplace records.
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-xs text-zinc-400">
              No marketplace items found matching &quot;{query}&quot;.
            </div>
          ) : (
            results.map((item) => {
              const displayImg =
                item.images && item.images.length > 0
                  ? item.images[0]
                  : item.image || getSvgPlaceholder(item.cropName, 'ri-box-3-line');

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectListing(item.category, item.cropId);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-white/5 hover:border-[#ff6b35]/50 cursor-pointer transition-all"
                >
                  <img
                    src={displayImg}
                    alt={item.cropName}
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-zinc-100 truncate">
                        {item.cropName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.role === 'buyer'
                            ? 'bg-[#ff6b35]/20 text-[#ff6b35]'
                            : 'bg-[#14b8a6]/20 text-[#14b8a6]'
                        }`}
                      >
                        {item.role}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 truncate mt-0.5">
                      <span>{item.name}</span>
                      <span>•</span>
                      <span>${item.price || 'Negotiable'}</span>
                      <span>•</span>
                      <span>{item.country}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
