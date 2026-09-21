import React, { useState } from 'react';
import { 
  X, 
  User, 
  Store, 
  Bell, 
  Database, 
  Copy, 
  Check, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Search, 
  ShieldAlert, 
  Loader2,
  Key,
  Play,
  Sparkles
} from 'lucide-react';
import { BuyerRecord, SellerRecord, OrderRecord, SupabaseStatus } from '../types.ts';
import { runSupabaseMigration } from '../lib/api.ts';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'buyers' | 'sellers' | 'sales' | 'supabase';
  buyers: BuyerRecord[];
  sellers: SellerRecord[];
  orders: OrderRecord[];
  supabaseStatus: SupabaseStatus | null;
  onRefreshStatus: () => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  schemaSql: string;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'buyers',
  buyers,
  sellers,
  orders,
  supabaseStatus,
  onRefreshStatus,
  onUpdateOrderStatus,
  schemaSql,
}) => {
  const [activeTab, setActiveTab] = useState<'buyers' | 'sellers' | 'sales' | 'supabase'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Automated migration state
  const [dbPassword, setDbPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [credentialType, setCredentialType] = useState<'password' | 'token'>('password');
  const [migrating, setMigrating] = useState(false);
  const [migrationMessage, setMigrationMessage] = useState<string | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(schemaSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefreshStatus();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRunAutomatedMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    setMigrating(true);
    setMigrationError(null);
    setMigrationMessage(null);

    try {
      const res = await runSupabaseMigration({
        dbPassword: credentialType === 'password' ? dbPassword : undefined,
        accessToken: credentialType === 'token' ? accessToken : undefined,
      });

      setMigrationMessage(res.message || 'Migration successfully applied! Tables are ready.');
      setDbPassword('');
      setAccessToken('');
      // Immediately refresh database status
      await onRefreshStatus();
    } catch (err: any) {
      setMigrationError(err.message || 'Failed to execute migration.');
    } finally {
      setMigrating(false);
    }
  };

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
              Marketplace Directories & Cloud DB
            </h2>
            <p className="text-xs text-zinc-400">
              Live sync with Supabase: buyers directory, sellers network, sales log, and PostgreSQL schema.
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
            <span>Buyers DB ({buyers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sellers' ? 'bg-[#14b8a6] text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Sellers DB ({sellers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sales' ? 'bg-amber-500 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Sale Alerts & Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'supabase'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Cloud Diagnostics</span>
            {supabaseStatus?.allTablesReady ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            ) : (
              <AlertCircle className="w-3 h-3 text-amber-300" />
            )}
          </button>
        </div>

        {/* Search for tables */}
        {activeTab !== 'supabase' && (
          <div className="flex items-center gap-2 bg-zinc-800/60 border border-white/10 rounded-xl px-3 py-2 mb-4 text-xs">
            <Search className="w-4 h-4 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="Search table by name, phone, location, product..."
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
        )}

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

        {/* TAB 3: SALE ALERTS & ORDERS */}
        {activeTab === 'sales' && (
          <div className="border border-white/10 rounded-xl overflow-hidden space-y-3">
            <div className="p-3 bg-zinc-800/40 text-xs text-zinc-400 flex items-center justify-between border-b border-white/5">
              <span>
                Sales are logged here in real-time. Alerts routed to: <strong>+263 778 788 197</strong> & <strong>praisekawo2@gmail.com</strong>
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-zinc-800 text-zinc-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="p-3">Order ID & Time</th>
                    <th className="p-3">Buyer Details</th>
                    <th className="p-3">Items Summary</th>
                    <th className="p-3">Total ($)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-500">
                        No orders recorded yet. Place an order through checkout to test!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-mono text-zinc-300 font-bold">{o.id}</div>
                          <div className="text-[10px] text-zinc-500">{o.time}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{o.buyerName}</div>
                          <div className="text-zinc-400">{o.buyerPhone}</div>
                          <div className="text-[10px] text-zinc-500">{o.destination}</div>
                        </td>
                        <td className="p-3 text-zinc-300 max-w-xs">{o.itemsSummary}</td>
                        <td className="p-3 text-base font-extrabold text-[#ff6b35] font-['Sora',sans-serif]">
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

        {/* TAB 4: SUPABASE DIAGNOSTICS & SQL SCHEMA */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 text-xs">
            {/* Connection Card */}
            <div className="p-4 rounded-xl bg-zinc-800/60 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      supabaseStatus?.allTablesReady
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                        : supabaseStatus?.connected
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-bold text-sm text-white">
                    {supabaseStatus?.allTablesReady
                      ? 'Supabase Cloud Database Fully Operational'
                      : supabaseStatus?.connected
                      ? 'Connected to Supabase Project (PostgreSQL Tables Pending)'
                      : 'Connecting to Supabase...'}
                  </span>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-200 font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Re-test Connection</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-400">
                <div>
                  <span className="text-zinc-500">Project Endpoint:</span>{' '}
                  <code className="text-zinc-300 font-mono">{supabaseStatus?.url}</code>
                </div>
                <div>
                  <span className="text-zinc-500">API Latency:</span>{' '}
                  <span className="text-emerald-400 font-semibold">
                    {supabaseStatus?.latencyMs ? `${supabaseStatus.latencyMs}ms` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Tables checklist */}
              <div className="pt-2 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['listings', 'buyers', 'sellers', 'orders'].map((tbl) => {
                  const ready = supabaseStatus?.tables?.[tbl as keyof typeof supabaseStatus.tables];
                  return (
                    <div
                      key={tbl}
                      className={`p-2 rounded-lg border flex items-center gap-2 ${
                        ready
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                          : 'bg-amber-950/20 border-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ready ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="font-mono">{tbl}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instruction Banner if tables are missing */}
            {!supabaseStatus?.allTablesReady && (
              <div className="space-y-4">
                {/* Option 1: Automated In-App Execution */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold flex items-center gap-2 text-sm text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Option A: Auto-Execute Migration In App</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                      Automated
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Enter your Supabase project password or a Personal Access Token, and our server will connect to PostgreSQL directly to execute the schema and configure Row Level Security (RLS) policies for you immediately.
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setCredentialType('password')}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${
                        credentialType === 'password'
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Database Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setCredentialType('token')}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${
                        credentialType === 'token'
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      Personal Access Token
                    </button>
                  </div>

                  <form onSubmit={handleRunAutomatedMigration} className="space-y-2 pt-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="password"
                          required
                          value={credentialType === 'password' ? dbPassword : accessToken}
                          onChange={(e) =>
                            credentialType === 'password'
                              ? setDbPassword(e.target.value)
                              : setAccessToken(e.target.value)
                          }
                          placeholder={
                            credentialType === 'password'
                              ? 'Enter Supabase Database Password...'
                              : 'Enter Supabase Personal Access Token (sbp_...)'
                          }
                          className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/10 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={migrating || !(credentialType === 'password' ? dbPassword : accessToken)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                      >
                        {migrating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run Migration Now</span>
                          </>
                        )}
                      </button>
                    </div>

                    {migrationError && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{migrationError}</span>
                      </div>
                    )}

                    {migrationMessage && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{migrationMessage}</span>
                      </div>
                    )}
                  </form>
                </div>

                {/* Option 2: 1-Click Dashboard SQL Editor */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
                  <div className="font-bold flex items-center gap-2 text-sm text-amber-300">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Option B: Paste & Run in Supabase SQL Editor</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-100/90">
                    If you prefer not to enter passwords in the browser, copy the SQL migration script below, click <strong className="text-white">Open Supabase SQL Editor</strong> to open your project dashboard, paste the query, and click <strong className="text-white">Run</strong>.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
                    </button>
                    <a
                      href="https://supabase.com/dashboard/project/eocpjpkmjwhajqodtkre/sql/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Open Supabase SQL Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SQL Code Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-zinc-300 font-semibold">
                <span>PostgreSQL Migration Script</span>
                <button
                  onClick={handleCopySql}
                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-[11px] font-mono text-zinc-300 max-h-60 overflow-y-auto leading-relaxed">
                {schemaSql}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
