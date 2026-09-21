import React from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Minus, 
  Truck 
} from 'lucide-react';
import { OrderItem } from '../types.ts';
import { getSvgPlaceholder } from '../data/categories.ts';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => {
    const rawPrice = parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return sum + rawPrice * item.qty;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center text-[#ff6b35]">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-extrabold text-white font-['Sora',sans-serif]">
            Your Shopping Cart ({cartItems.length})
          </h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="text-4xl">🛒</div>
            <div className="text-zinc-300 font-semibold">Your cart is empty</div>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Explore the marketplace and select items from verified suppliers to proceed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => {
                const rawPrice = parseFloat(String(item.price || '0').replace(/[^0-9.]/g, '')) || 0;
                const itemSubtotal = rawPrice * item.qty;
                const img = item.image || getSvgPlaceholder(item.cropName, '📦');

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-white/5"
                  >
                    <img
                      src={img}
                      alt={item.cropName}
                      className="w-14 h-14 rounded-lg object-cover bg-zinc-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-zinc-100 truncate">
                        {item.cropName}
                      </div>
                      <div className="text-xs text-zinc-400 truncate">
                        Supplier: {item.sellerName}
                      </div>
                      <div className="text-xs font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                        ${rawPrice.toFixed(2)} / unit
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-1.5 bg-zinc-900 px-2 py-1 rounded-lg border border-white/10 shrink-0">
                      <button
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-white">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total & Checkout */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-zinc-400">Estimated Subtotal:</span>
                <span className="text-2xl font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#e8551f] hover:from-[#ff8f5e] hover:to-[#ff6b35] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Proceed to Order Delivery Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
