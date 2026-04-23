'use client';
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Trophy, Heart, Zap, History, 
  ChevronRight, ArrowUpRight, LogOut, 
  PlusCircle, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import ScoreEntry from '@/components/ScoreEntry';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const fetchDashboardData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Force fresh data fetch (Cache-busting)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*, charities(name)')
      .eq('id', user.id)
      .single();
    
    const { data: scoreData } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setProfile(profileData);
    setScores(scoreData || []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    // Check if we just came from the subscribe page to force a router refresh
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      window.history.replaceState({}, document.title, "/dashboard");
      router.refresh(); // Clear Next.js client cache
    }
    
    fetchDashboardData();
  }, [fetchDashboardData, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Strict Evaluation
  const isActive = profile?.subscription_active === true;
  // Use Nullish Coalescing (??) instead of OR (||) so exact DB values are respected
  const charityImpact = profile?.charity_percentage ?? 10; 

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-12 xl:p-16 selection:bg-emerald-500/30">
      <div className="max-w-[90rem] mx-auto">
        
        {/* --- TOP NAV BAR --- */}
        <nav className="mb-16 flex justify-between items-center bg-slate-900/30 border border-white/5 p-5 rounded-full backdrop-blur-xl">
          <div className="flex items-center gap-3 pl-6">
            <LayoutDashboard className="text-emerald-500" size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white">Player Dashboard</span>
          </div>
          
          <div className="flex items-center gap-6 pr-2">
            <div className={`hidden md:flex items-center gap-3 px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
              isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              {isActive ? 'Verified Member' : 'Guest Access'}
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-red-500 hover:text-white text-slate-400 rounded-full transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </nav>

        {/* --- HEADER --- */}
        <header className="mb-16 pl-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-6xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
              Player <span className="text-emerald-500">Portal</span>
            </h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">
              Performance Tracking & Social Impact
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* --- LEFT COLUMN --- */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* ONLY SHOW IF INACTIVE */}
            {!isActive && (
              <motion.div 
                initial={{ scale: 0.98, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="bg-gradient-to-br from-emerald-600/20 to-black border border-emerald-500/20 p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
              >
                <div className="flex items-center gap-8">
                  <div className="bg-emerald-500 text-black p-6 rounded-3xl shadow-xl flex-shrink-0">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase italic text-3xl leading-none mb-3">Unlock Rewards</h3>
                    <p className="text-slate-400 text-base font-medium">Activate your membership to enter the $1,000+ monthly prize pool.</p>
                  </div>
                </div>
                <Link 
                  href="/subscribe" 
                  className="w-full md:w-auto bg-emerald-500 text-black px-12 py-6 rounded-full font-black uppercase text-sm hover:scale-105 transition-transform shadow-xl whitespace-nowrap text-center"
                >
                  Buy Subscription
                </Link>
              </motion.div>
            )}

            {/* MAIN TOOLS (More spacious grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Score Entry Module */}
               <div className="bg-slate-900/30 border border-white/5 p-10 lg:p-12 rounded-[3rem]">
                 <div className="flex items-center gap-4 mb-10">
                    <PlusCircle className="text-emerald-500" size={28} />
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Log Round</h3>
                 </div>
                 <ScoreEntry userId={profile?.id} onScoreAdded={fetchDashboardData} />
               </div>
               
               {/* Rolling 5 Display */}
               <div className="bg-slate-900/30 border border-white/5 p-10 lg:p-12 rounded-[3rem]">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 flex items-center gap-4">
                    <History className="text-emerald-500" size={28} /> Rolling 5 
                  </h3>
                  <div className="space-y-5">
                    {scores.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                        <div>
                          <p className="text-white font-black italic text-lg truncate max-w-[150px]">{s.course_name}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-3xl font-black text-emerald-400 italic">{s.score}</div>
                      </div>
                    ))}
                    {scores.length === 0 && (
                      <div className="py-24 text-center text-slate-600 text-[11px] font-black uppercase tracking-[0.3em]">No rounds recorded</div>
                    )}
                  </div>
               </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <div className="xl:col-span-4 space-y-12">
            
            {/* Charity Module */}
            <div className="bg-slate-900/30 border border-white/5 p-12 rounded-[3rem] group">
              <Heart className="text-emerald-500 mb-8" size={40} />
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Impact Goal</p>
              <h3 className="text-3xl font-black text-white italic uppercase mb-8 truncate leading-none">
                {profile?.charities?.name || 'Selection Required'}
              </h3>
              
              <div className="bg-emerald-500/10 p-8 rounded-3xl border border-emerald-500/20 mb-10">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Impact Share</p>
                <p className="text-5xl font-black text-white italic leading-none">{charityImpact}%</p>
              </div>

              <Link href="/charity" className="inline-flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors font-black text-[11px] uppercase tracking-widest">
                Modify Selection <ChevronRight size={16} />
              </Link>
            </div>

            {/* Reward Engine Link */}
            <Link href="/draws" className="block p-12 bg-emerald-500 rounded-[3rem] group hover:scale-[1.02] transition-transform shadow-xl shadow-emerald-500/10">
              <div className="flex justify-between items-center text-black">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-2">Live Entry</p>
                  <h4 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Reward Engine</h4>
                </div>
                <ArrowUpRight size={40} strokeWidth={2.5} />
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}