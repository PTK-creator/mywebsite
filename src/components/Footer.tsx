import React from 'react';
import { Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  openDatabase: (tab?: 'buyers' | 'sellers' | 'sales') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, openDatabase }) => {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/80 pt-12 pb-8 mt-20 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="space-y-2 max-w-sm">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#c43d0f] flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white font-['Sora',sans-serif]">
                PTK<span className="text-[#ff6b35]">Link</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              A global multi-category peer-to-peer directory connecting buyers and sellers for general merchandise, technology, and produce with zero middleman commissions.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => onNavigate('market')} className="hover:text-white transition-colors">
              Marketplace
            </button>
            <button onClick={() => openDatabase('buyers')} className="hover:text-white transition-colors">
              Buyers Directory
            </button>
            <button onClick={() => openDatabase('sellers')} className="hover:text-white transition-colors">
              Sellers Network
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div>
            Built by PTK Academy — enterprise peer-to-peer trade network. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
            <span>Direct P2P Trading Network Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
