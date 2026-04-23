'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, ArrowLeft, TrendingUp, Users, 
  Calendar, Sparkles, Target, ShieldCheck, 
  ChevronRight, Info
} from 'lucide-react';
import Link from 'next/link';

export default function PrizePoolsPage() {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPoolData = async () => {
      // Calculate pool tier based on active subscriber count 
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_active', true);
      
      setSubscriberCount(count || 0);
      setLoading(false);
    };
    fetchPoolData();
  }, [supabase]);

  // PRD prize distribution calculation 
  const totalPool = (subscriberCount * 5) + 500; // Base $500 + $5 contribution per sub
  const tiers = [
    { name: '5-Number Match', percentage: 40, label: 'Jackpot', rollover: true },
    { name: '4-Number Match', percentage: 35, label: 'High Tier', rollover: false },
    { name: '3-Number Match', percentage: 25, label: 'Entry Tier', rollover: false },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto p-8 lg:p-16">
        
        {/* Navigation - Back to Dashboard */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] group mb-12"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Return to Dashboard
          </Link>
        </motion.div>

        {/* Header */}
        <header className="mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-6xl lg:text-8xl font-black text-white mb-6 uppercase italic tracking-tighter leading-none">
              Draw <span className="text-emerald-500">Engine</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-2xl text-lg leading-relaxed">
              Transparent, algorithm-powered prize distribution. A fixed portion of every 
              subscription fuels the monthly reward tiers.
            </p>
          </motion.div>
        </header>

        {/* Live Pool Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <motion.div 
            whileHover={{ y: -5 }}
            className="lg:col-span-2 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-12 rounded-[3.5rem] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6">
                <TrendingUp size={16} /> Total Monthly Liquidity
              </div>
              <h2 className="text-7xl lg:text-9xl font-black text-white tracking-tighter italic">
                ${totalPool.toLocaleString()}
              </h2>
              <div className="mt-12 flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Calendar size={16} /> Next Draw: April 30, 2026
              </div>
            </div>
            <Trophy className="absolute -right-10 -bottom-10 w-80 h-80 text-emerald-500/5 -rotate-12 group-hover:scale-110 transition-transform duration-1000" />
          </motion.div>

          <div className="bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] flex flex-col justify-between">
            <Users className="text-emerald-500 mb-6" size={32} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 text-left">Active Participants</p>
              <h3 className="text-5xl font-black text-white italic">{subscriberCount}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-6 leading-relaxed">
              Calculated in real-time based on verified active subscriptions.
            </p>
          </div>
        </div>

        {/* Prize Tiers  */}
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 flex items-center gap-3">
          <Sparkles className="text-emerald-400" size={24} /> Distribution Tiers
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  <Target size={24} />
                </div>
                {tier.rollover && (
                  <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
                    Rollover Active 
                  </span>
                )}
              </div>
              
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{tier.label}</p>
              <h4 className="text-2xl font-black text-white uppercase italic mb-6">{tier.name}</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-500">Allocation</span>
                  <span className="text-white">{tier.percentage}%</span>
                </div>
                <div className="text-4xl font-black text-emerald-400 italic">
                  ${((totalPool * tier.percentage) / 100).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Operational Logic Footer */}
        <footer className="mt-20 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-emerald-500/10 p-4 rounded-2xl"><ShieldCheck className="text-emerald-500" /></div>
            <div>
              <h5 className="text-white font-black uppercase italic tracking-tight">Fair Play Guaranteed</h5>
              <p className="text-slate-500 text-xs font-medium">All prizes split equally among winners in the same tier.</p>
            </div>
          </div>
            <Link href="/winnings" className="px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-colors">
            View My Winnings
            </Link>
        </footer>

      </div>
    </div>
  );
}