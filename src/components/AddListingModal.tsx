import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  Megaphone, 
  Upload, 
  Send, 
  Loader2, 
  Image as ImageIcon 
} from 'lucide-react';
import { CATEGORIES, WORLD_COUNTRIES } from '../data/categories.ts';
import { DeliveryOption, MarketType } from '../types.ts';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialCropId?: string;
  initialRole?: 'seller' | 'buyer';
  onSubmit: (formData: any) => Promise<void>;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'electronics',
  initialCropId,
  initialRole = 'seller',
  onSubmit,
}) => {
  const [role, setRole] = useState<'seller' | 'buyer'>(initialRole);
  const [category, setCategory] = useState(initialCategory);
  const crops = CATEGORIES[category]?.crops || [];
  const [cropId, setCropId] = useState(initialCropId || crops[0]?.id || '');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Zimbabwe');
  const [location, setLocation] = useState('');
  const [marketType, setMarketType] = useState<MarketType>('LOCAL');
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('Standard Shipping');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const newCrops = CATEGORIES[newCat]?.crops || [];
    setCropId(newCrops[0]?.id || '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 10 - images.length;
    files.slice(0, remainingSlots).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 800;
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setImages((prev) => (prev.length < 10 ? [...prev, dataUrl] : prev));
          }
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const selectedCropObj = crops.find((c) => c.id === cropId);
    const cropName = selectedCropObj ? selectedCropObj.name : cropId;

    if (!name.trim() || !phone.trim() || !location.trim() || !quantity.trim()) {
      setErrorMsg('Please complete all required fields (*)');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        category,
        cropId,
        cropName,
        role,
        name: name.trim(),
        phone: phone.trim(),
        country,
        location: location.trim(),
        marketType,
        deliveryOption,
        quantity: quantity.trim(),
        price: price.trim(),
        notes: notes.trim(),
        image: images.length > 0 ? images[0] : null,
        images,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to post listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-2xl font-extrabold text-white font-['Sora',sans-serif] mb-4">
          Post Marketplace Listing
        </h2>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-800/80 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'seller'
                ? 'bg-[#14b8a6] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>I Want to Sell (Supplier)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              role === 'buyer'
                ? 'bg-[#ff6b35] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>I Want to Buy (Demand)</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Category & Crop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
                required
              >
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key} className="bg-zinc-900 text-zinc-200">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Subcategory / Item *
              </label>
              <select
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
                required
              >
                {crops.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-200">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Your Name / Company *
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Imports Ltd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                placeholder="e.g. +263 778 788 197"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors placeholder:text-zinc-500"
                required
              />
            </div>
          </div>

          {/* Country & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Country *
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
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
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                City / Region / Stand *
              </label>
              <input
                type="text"
                placeholder="e.g. Harare CBD, Stand 42"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors placeholder:text-zinc-500"
                required
              />
            </div>
          </div>

          {/* Scope & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Market Reach *
              </label>
              <select
                value={marketType}
                onChange={(e) => setMarketType(e.target.value as MarketType)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              >
                <option value="LOCAL">Local Domestic Market</option>
                <option value="INTERNATIONAL">International Cross-Border</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Delivery Method *
              </label>
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value as DeliveryOption)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors"
              >
                <option value="Express Delivery">Express Delivery</option>
                <option value="Standard Shipping">Standard Shipping</option>
                <option value="Pickup">Pickup at Location</option>
                <option value="International Shipping">International Freight</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Quantity / Units *
              </label>
              <input
                type="text"
                placeholder="e.g. 50 units, 2 tons"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors placeholder:text-zinc-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {role === 'seller' ? 'Unit Price ($)' : 'Maximum Budget ($)'}
              </label>
              <input
                type="text"
                placeholder="e.g. 350"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Multiple Image Upload (for Sellers) */}
          {role === 'seller' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Product Photos (Up to 10 images)
              </label>
              <div className="border border-dashed border-white/15 rounded-xl p-4 text-center hover:border-[#ff6b35] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="modalImagesInput"
                  disabled={images.length >= 10}
                />
                <label
                  htmlFor="modalImagesInput"
                  className="cursor-pointer flex flex-col items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  <Upload className="w-5 h-5 text-[#ff6b35]" />
                  <span>
                    {images.length >= 10
                      ? 'Maximum 10 images reached'
                      : 'Click or drop product photos here (PNG, JPG, WebP)'}
                  </span>
                </label>
              </div>

              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {images.map((src, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 group">
                      <img src={src} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Specifications / Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide extra details such as model, condition, harvest date, packaging, or warranty terms."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-zinc-100 outline-none focus:border-[#ff6b35] transition-colors placeholder:text-zinc-500 text-xs"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#ff6b35] hover:bg-[#e8551f] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Supabase...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Publish to Cloud</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
