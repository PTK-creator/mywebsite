import React from 'react';
import { 
  Shield, 
  Handshake, 
  Truck, 
  Database, 
  Phone, 
  Mail, 
  Share2, 
  ExternalLink 
} from 'lucide-react';

interface AboutContactProps {
  view: 'about' | 'contact';
}

export const AboutContactViews: React.FC<AboutContactProps> = ({ view }) => {
  if (view === 'about') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#ff6b35] bg-[#ff6b35]/10 border border-[#ff6b35]/20">
            <Shield className="w-3.5 h-3.5" />
            <span>Our Mission</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Sora',sans-serif] tracking-tight">
            Empowering Direct Peer-to-Peer Commerce
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            PTK-Link was developed by <strong>PTK Academy</strong> to bridge the divide between global purchasers and primary producers. By removing intermediary commission layers, commercial trade becomes transparent, accessible, and fast for enterprises worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#ff6b35]/10 text-[#ff6b35] flex items-center justify-center">
              <Handshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Sora',sans-serif]">
              Direct Negotiation
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Connect directly via verified phone, WhatsApp, and transparent contact channels with 0% platform commissions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Sora',sans-serif]">
              Flexible Logistics
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Filter by local express dispatch, regional freight, international cargo forwarding, or warehouse pickup.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Sora',sans-serif]">
              Supabase Cloud Resilience
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Real-time enterprise cloud persistence in PostgreSQL powered by Supabase with hybrid client caching.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#ff6b35] bg-[#ff6b35]/10 border border-[#ff6b35]/20">
          <Phone className="w-3.5 h-3.5" />
          <span>Get In Touch</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Sora',sans-serif] tracking-tight">
          We&apos;re Here to Help Your Business Grow
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          Have feedback, need commercial supplier verification, or wish to integrate institutional trade orders? Reach out directly to our administrative coordinators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#ff6b35]/10 text-[#ff6b35] flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Sora',sans-serif]">
            Direct Support Line
          </h3>
          <p className="text-sm text-zinc-400">
            Administrative coordinators for technical verification and disputes:
          </p>
          <div className="space-y-1 font-bold text-[#ff6b35] text-sm">
            <div>+263 778 788 197</div>
            <div>+263 712 461 904</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#14b8a6]/10 text-[#14b8a6] flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Sora',sans-serif]">
            Corporate Enquiries
          </h3>
          <p className="text-sm text-zinc-400">
            Agricultural cooperatives, logistics firms, and institutional buyers:
          </p>
          <div className="space-y-1 font-bold text-[#14b8a6] text-sm">
            <div>contact@ptkacademy.com</div>
            <div>praisekawo2@gmail.com</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/70 border border-white/10 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Sora',sans-serif]">
            Community Channels
          </h3>
          <p className="text-sm text-zinc-400">
            Join our trade groups to receive real-time commodity alerts and pricing:
          </p>
          <div className="flex gap-2 pt-1">
            <a
              href="https://wa.me/263778788197"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold"
            >
              WhatsApp
            </a>
            <a
              href="mailto:praisekawo2@gmail.com"
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 border border-white/10 text-xs font-bold"
            >
              Email Alert
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
