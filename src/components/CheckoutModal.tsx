import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  Send, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { OrderItem } from '../types.ts';
import { WORLD_COUNTRIES } from '../data/categories.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onSubmitOrder: (orderData: {
    buyerName: string;
    buyerPhone: string;
    destination: string;
    notes?: string;
  }) => Promise<void>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Zimbabwe');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const total = cartItems.reduce((sum, item) => {
    const rawPrice = parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return sum + rawPrice * item.qty;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Please complete all required fields (*)');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitOrder({
        buyerName: name.trim(),
        buyerPhone: phone.trim(),
        destination: `${address.trim()}, ${country}`,
        notes: notes.trim(),
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-['Sora',sans-serif]">
            Delivery Request
          </h2>
        </div>

        <p className="text-xs text-zinc-400 mb-5">
          Provide your contact details. Sellers will coordinate directly via WhatsApp or phone for freight dispatch or warehouse collection.
        </p>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Sarah Ndlovu"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="e.g. +263 771 234 567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
                required
              />
            </div>
          </div>

          {/* Country & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Country *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
                required
              >
                {WORLD_COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-zinc-900 text-zinc-200">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Destination Address / City *
              </label>
              <input
                type="text"
                placeholder="e.g. 12 Samora Machel Ave, Harare"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Delivery Instructions / Courier Preference
            </label>
            <textarea
              rows={2}
              placeholder="Special handling notes, preferred courier agency, or preferred delivery timing."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors text-xs"
            />
          </div>

          {/* Order Summary Box */}
          <div className="p-3.5 rounded-xl bg-zinc-800/60 border border-white/10 space-y-1.5 text-xs text-zinc-400">
            <div className="flex justify-between text-zinc-300 font-semibold">
              <span>Items in Order:</span>
              <span>{cartItems.reduce((s, i) => s + i.qty, 0)} units ({cartItems.length} products)</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
              <span>Total Payable to Sellers:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero platform fees. Pay suppliers directly upon delivery agreement.</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#14b8a6] hover:bg-[#0d9488] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Cloud...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm & Send Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
