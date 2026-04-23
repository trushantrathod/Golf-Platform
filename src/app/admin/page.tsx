'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Trophy, Heart, CheckCircle, AlertCircle, 
  Play, Loader2, ShieldCheck, BarChart3, Database,
  Eye, X, Sparkles, LogOut, RefreshCw, Activity
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, pool: 0, charities: 0, pendingWinners: 0, activeNow: 0 });
  const [simulationData, setSimulationData] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // 🔄 Unified Data Fetcher (Reports & Analytics )
  const fetchStats = useCallback(async () => {
    setIsRefreshing(true);
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: winnerCount } = await supabase.from('winners').select('*', { count: 'exact', head: true }).eq('status', 'Pending');
    const { count: charityCount } = await supabase.from('charities').select('*', { count: 'exact', head: true });
    
    setStats({
      users: userCount || 0,
      pool: (userCount || 0) * 5 + 500, // PRD Prize Pool Logic 
      charities: charityCount || 0,
      pendingWinners: winnerCount || 0,
      activeNow: Math.floor((userCount || 0) * 0.4) // Simulated live activity
    });
    setLoading(false);
    setTimeout(() => setIsRefreshing(false), 800);
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // 🚪 Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // 🎲 Draw Engine Simulation]
  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/draw', { // Calling your specific /api/draw path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) setSimulationData(data);
    } catch (err) {
      alert("Simulation Connection Failed");
    } finally {
      setIsSimulating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-8 lg:p-16 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- TOP NAVIGATION BAR --- */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-500 text-black px-2 py-1 rounded-md font-black text-[9px] uppercase tracking-tighter">System Admin</div>
              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Live Monitoring</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Command <span className="text-emerald-500">Center</span></h1>
          </motion.div>
          
          {/* Functional Header Actions */}
          <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-4 px-4 py-2 border-r border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase">{stats.activeNow} Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-700 rounded-full" />
                <span className="text-[10px] font-black text-slate-500 uppercase">{stats.users - stats.activeNow} Offline</span>
              </div>
            </div>
            
            <button 
              onClick={fetchStats}
              disabled={isRefreshing}
              className="p-3 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all"
              title="Refresh System Data"
            >
              <RefreshCw size={20} className={isRefreshing ? "animate-spin text-emerald-500" : ""} />
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-red-500/20"
            >
              <LogOut size={16} /> Exit
            </button>
          </div>
        </header>

        {/* --- ANALYTICS TILES --- [] */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Users />} label="Total Heroes" value={stats.users} />
          <StatCard icon={<Trophy />} label="Live Prize Pool" value={`$${stats.pool.toLocaleString()}`} color="text-emerald-400" />
          <StatCard icon={<Heart />} label="Charity Listings" value={stats.charities} />
          <StatCard icon={<AlertCircle />} label="Pending Payouts" value={stats.pendingWinners} color="text-amber-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- DRAW ENGINE CONTROL --- [] */}
          <section className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-white">
                <Play className="text-emerald-500" size={20} /> Draw Management
              </h3>
              <div className="bg-emerald-500/10 px-4 py-2 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                Ready for Simulation
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Algorithm Selection </p>
                <div className="flex gap-4">
                  {['Random generation', 'Weighted Algorithmic'].map((logic) => (
                    <button key={logic} className="flex-grow p-4 rounded-2xl bg-white/5 border border-white/5 text-[9px] font-black text-white uppercase tracking-widest hover:border-emerald-500/50 transition-all">
                      {logic}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full bg-emerald-500 text-black py-6 rounded-[2rem] font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
              >
                {isSimulating ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Execute Draw Simulation</>}
              </button>

              <AnimatePresence>
                {simulationData && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem]"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Winning Sequence Detected</p>
                      <button onClick={() => setSimulationData(null)} className="text-emerald-400 hover:text-white"><X size={16} /></button>
                    </div>
                    <div className="flex gap-3 mb-8">
                      {simulationData.winningNumbers.map((n: number, i: number) => (
                        <div key={i} className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center text-xl font-black italic shadow-lg shadow-black/20">
                          {n}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Winners Found</p>
                        <p className="text-2xl font-black text-white italic">{simulationData.winnersFound}</p>
                      </div>
                      <div className="bg-black/20 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-sm font-black text-emerald-400 uppercase tracking-tighter">Draft Analysis Only</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Activity className="absolute -right-10 -bottom-10 text-white/[0.02] w-64 h-64 group-hover:text-emerald-500/[0.02] transition-colors" />
          </section>

          {/* --- WINNER VERIFICATION QUEUE ---  */}
          <section className="lg:col-span-5 bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-md">
            <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-3 text-white mb-10">
              <ShieldCheck className="text-emerald-500" size={20} /> Winner Verification
            </h3>

            {stats.pendingWinners === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2.5rem]">
                <CheckCircle className="mx-auto text-slate-800 mb-4" size={48} />
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">Queue Fully Cleared</p>
              </div>
            ) : (
              <div className="space-y-4">
                 {/* This would be a dynamic map over pending payouts in a full system */}
                 <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Verification Pending</p>
                      <h4 className="text-lg font-black text-white italic">$1,200 (4-Match)</h4>
                    </div>
                    <div className="p-2 bg-amber-500/20 text-amber-500 rounded-lg"><Eye size={16} /></div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <button className="flex-grow py-3 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all">Approve Payout</button>
                    <button className="px-4 py-3 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all">Reject</button>
                  </div>
                </div>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color = "text-white" }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md relative overflow-hidden"
    >
      <div className="mb-6 opacity-30 text-white">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">{label}</p>
      <p className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</p>
      <BarChart3 className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24" />
    </motion.div>
  );
}