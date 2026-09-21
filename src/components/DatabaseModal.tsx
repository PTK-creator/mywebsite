import React, { useState } from 'react';
import { 
  X, 
  User, 
  Store, 
  Bell, 
  Database, 
  Search 
} from 'lucide-react';
import { BuyerRecord, SellerRecord, OrderRecord } from '../types.ts';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'buyers' | 'sellers' | 'sales';
  buyers: BuyerRecord[];
  sellers: SellerRecord[];
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'buyers',
  buyers,
  sellers,
  orders,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers' | 'sales'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await onUpdateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredBuyers = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.country.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q) ||
      b.interest.toLowerCase().includes(q)
  );

  const filteredSellers = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.phone.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.product.toLowerCase().includes(q)
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.buyerName.toLowerCase().includes(q) ||
      o.buyerPhone.toLowerCase().includes(q) ||
      o.destination.toLowerCase().includes(q) ||
      o.itemsSummary.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#ff6b35]/20 text-[#ff6b35] flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Sora',sans-serif]">
              Marketplace Trade Directories
            </h2>
            <p className="text-xs text-zinc-400">
              Verified buyer demands, registered suppliers, and transaction records.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-800/80 rounded-xl my-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'buyers' ? 'bg-[#ff6b35] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Buyers Directory ({buyers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sellers' ? 'bg-[#14b8a6] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Suppliers Network ({sellers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sales' ? 'bg-amber-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Trade Orders & Inquiries ({orders.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-zinc-800/60 border border-white/10 rounded-xl px-3 py-2 mb-4 text-xs">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search directory by name, contact, location, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-zinc-200 w-full placeholder:text-zinc-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-zinc-400 hover:text-white">
              Clear
            </button>
          )}
        </div>

        {/* TAB 1: BUYERS DB */}
        {activeTab === 'buyers' && (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-zinc-800 text-zinc-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-3">Buyer Name</th>
                    <th className="p-3">Phone / WhatsApp</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Location / Destination</th>
                    <th className="p-3">Interested In</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-200">
                  {filteredBuyers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        No buyer records match.
                      </td>
                    </tr>
                  ) : (
                    filteredBuyers.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">{b.name}</td>
                        <td className="p-3 font-mono text-[#14b8a6]">{b.phone}</td>
                        <td className="p-3">{b.country}</td>
                        <td className="p-3 text-zinc-400">{b.location}</td>
                        <td className="p-3 text-[#ff6b35] font-medium">{b.interest}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: SELLERS DB */}
        {activeTab === 'sellers' && (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-zinc-800 text-zinc-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-3">Supplier Name</th>
                    <th className="p-3">Phone / WhatsApp</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Selling Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-200">
                  {filteredSellers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        No supplier records match.
                      </td>
                    </tr>
                  ) : (
                    filteredSellers.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 font-semibold text-white">{s.name}</td>
                        <td className="p-3 font-mono text-[#14b8a6]">{s.phone}</td>
                        <td className="p-3">{s.country}</td>
                        <td className="p-3 text-zinc-400">{s.location}</td>
                        <td className="p-3 text-[#14b8a6] font-medium">{s.product}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SALES ALERTS & ORDERS */}
        {activeTab === 'sales' && (
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-zinc-800 text-zinc-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Buyer Info</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Order Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-500">
                        No trade orders logged yet.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3 text-zinc-400 whitespace-nowrap">
                          {o.time || 'Recent'}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{o.buyerName}</div>
                          <div className="font-mono text-[#14b8a6]">{o.buyerPhone}</div>
                        </td>
                        <td className="p-3 text-zinc-300">{o.destination}</td>
                        <td className="p-3 text-zinc-300 max-w-xs truncate" title={o.itemsSummary}>
                          {o.itemsSummary}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#ff6b35]">
                          ${o.total.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <select
                            value={o.status}
                            disabled={updatingOrderId === o.id}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-200 outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
