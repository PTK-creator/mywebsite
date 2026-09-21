import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Listing, DeliveryOption, MarketType, ListingStatus } from '../types.ts';

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onUpdate: (id: string, updates: Partial<Listing>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const EditListingModal: React.FC<EditListingModalProps> = ({
  isOpen,
  onClose,
  listing,
  onUpdate,
  onDelete,
}) => {
  if (!isOpen || !listing) return null;

  const [price, setPrice] = useState(listing.price || '');
  const [quantity, setQuantity] = useState(listing.quantity || '');
  const [location, setLocation] = useState(listing.location || '');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(listing.deliveryOption);
  const [marketType, setMarketType] = useState<MarketType>(listing.marketType);
  const [status, setStatus] = useState<ListingStatus>(listing.status || 'active');
  const [notes, setNotes] = useState(listing.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await onUpdate(listing.id, {
        price,
        quantity,
        location,
        deliveryOption,
        marketType,
        status,
        notes,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to modify listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(listing.id);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b35] bg-[#ff6b35]/10 px-2 py-0.5 rounded">
            Modify Record
          </span>
          <span className="text-xs text-zinc-500">ID: {listing.id}</span>
        </div>

        <h2 className="text-2xl font-extrabold text-white font-['Sora',sans-serif] mb-4">
          Edit {listing.cropName}
        </h2>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Status & Market Reach */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ListingStatus)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors font-medium"
              >
                <option value="active">Active (Visible)</option>
                <option value="sold">Sold / Fulfilled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Market Reach
              </label>
              <select
                value={marketType}
                onChange={(e) => setMarketType(e.target.value as MarketType)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              >
                <option value="LOCAL">Local Domestic</option>
                <option value="INTERNATIONAL">Cross-Border International</option>
              </select>
            </div>
          </div>

          {/* Price & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Price ($)
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 450"
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Quantity Available
              </label>
              <input
                type="text"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 20 units"
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              />
            </div>
          </div>

          {/* Location & Delivery Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Delivery Option
              </label>
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              >
                <option value="Express Delivery">Express Delivery</option>
                <option value="Standard Shipping">Standard Shipping</option>
                <option value="Pickup">Pickup</option>
                <option value="International Shipping">International Freight</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          {/* Notes / Specifications */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Specifications & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors text-xs"
            />
          </div>

          {/* Buttons: Save & Delete */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>Confirm Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-rose-950/50 hover:text-rose-400 text-zinc-400 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Listing</span>
              </button>
            )}

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
