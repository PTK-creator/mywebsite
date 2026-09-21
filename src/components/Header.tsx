import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Bell, 
  ShoppingCart, 
  Database, 
  Moon, 
  Sun, 
  Plus
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cartCount: number;
  openCart: () => void;
  openAddListing: (role?: 'seller' | 'buyer') => void;
  openDatabase: (initialTab?: 'buyers' | 'sellers' | 'sales') => void;
  openSearch: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  buyerNotifications: Array<{ id: number; text: string; time: string }>;
  clearNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  openCart,
  openAddListing,
  openDatabase,
  openSearch,
  isDark,
  toggleTheme,
  buyerNotifications,
  clearNotifications,
}) => {
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 dark:border-white/10 light:border-black/10 transition-colors duration-200 px-4 md:px-7 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        onClick={() => setCurrentPage('home')}
        className="flex items-center gap-2.5 cursor-pointer select-none group"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#c43d0f] flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,107,53,0.35)] group-hover:scale-105 transition-transform duration-200">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <div className="font-bold text-xl tracking-tight font-['Sora',sans-serif]">
          PTK<span className="text-[#ff6b35]">Link</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="hidden lg:flex items-center gap-1.5 bg-white/5 dark:bg-white/5 light:bg-black/5 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setCurrentPage('home')}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentPage === 'home'
              ? 'bg-[#ff6b35] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('market')}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentPage === 'market'
              ? 'bg-[#ff6b35] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => openDatabase('buyers')}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
            currentPage === 'database'
              ? 'bg-[#ff6b35] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Directories</span>
        </button>
        <button
          onClick={() => setCurrentPage('about')}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentPage === 'about'
              ? 'bg-[#ff6b35] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
          }`}
        >
          About
        </button>
        <button
          onClick={() => setCurrentPage('contact')}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
            currentPage === 'contact'
              ? 'bg-[#ff6b35] text-white shadow-sm font-semibold'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
          }`}
        >
          Contact
        </button>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-2.5">
        {/* Search button */}
        <button
          onClick={openSearch}
          title="Quick Search"
          className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-all"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            title="Buyer Notifications"
            className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {buyerNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                {buyerNotifications.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifPanel && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-3 z-50 text-sm">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
                  <Bell className="w-4 h-4 text-[#ff6b35]" />
                  <span>Buyer Alerts</span>
                </div>
                {buyerNotifications.length > 0 && (
                  <button
                    onClick={() => {
                      clearNotifications();
                      setShowNotifPanel(false);
                    }}
                    className="text-xs text-[#ff6b35] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {buyerNotifications.length === 0 ? (
                  <div className="text-center py-4 text-xs text-zinc-500">
                    No new buyer alerts.
                  </div>
                ) : (
                  buyerNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-zinc-800/70 border-l-2 border-[#ff6b35] text-xs text-zinc-300"
                    >
                      <div className="font-semibold text-white mb-0.5">New Request</div>
                      <div>{n.text}</div>
                      <div className="text-[10px] text-zinc-500 mt-1">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shopping Cart Button */}
        <button
          onClick={openCart}
          title="Shopping Cart"
          className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-all relative"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff6b35] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,107,53,0.6)]">
              {cartCount}
            </span>
          )}
        </button>

        {/* Directories / Admin Button */}
        <button
          onClick={() => openDatabase('buyers')}
          title="Buyers, Sellers & Orders DB"
          className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-all"
        >
          <Database className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          className="w-9 h-9 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-white border border-white/10 flex items-center justify-center transition-all"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Post Listing CTA */}
        <button
          onClick={() => openAddListing('seller')}
          className="ml-1 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ff6b35] to-[#e8551f] hover:from-[#ff8f5e] hover:to-[#ff6b35] text-white text-xs md:text-sm font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,107,53,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Register to Sell</span>
          <span className="sm:hidden">Sell</span>
        </button>
      </div>
    </header>
  );
};
