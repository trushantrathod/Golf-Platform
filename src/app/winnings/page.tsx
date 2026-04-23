'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, AlertCircle, CheckCircle2, Clock, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function WinningsPage() {
  const [winnings, setWinnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchWinnings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetching from the winners table defined in the PRD
        const { data } = await supabase
          .from('winners')
          .select('*')
          .eq('user_id', user.id)
          .order('draw_date', { ascending: false });
        setWinnings(data || []);
      }
      setLoading(false);
    };
    fetchWinnings();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 lg:p-16">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 mb-12 transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Dashboard
        </Link>

        <header className="mb-16">
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter">
            Your <span className="text-emerald-400">Winnings</span>
          </h1>
          <p className="text-slate-400 font-medium">Track your prize claims and verification status.</p>
        </header>

        {winnings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3.5rem] bg-slate-900/20"
          >
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
              <Trophy size={40} />
            </div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-widest mb-2">No Winnings Found</h2>
            <p className="text-slate-500 text-sm font-medium">Enter more scores to participate in the next monthly draw!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {winnings.map((win) => (
              <div key={win.id} className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-emerald-500/10 p-5 rounded-2xl text-emerald-400">
                    <Trophy size={32} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Match Tier: {win.match_type}</p>
                    <h3 className="text-3xl font-black text-white italic">${win.amount.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    win.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    win.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {win.status === 'Paid' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    Status: {win.status}
                  </div>
                  
                  {win.status === 'Pending' && (
                    <button className="flex items-center gap-2 text-white hover:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                      <UploadCloud size={14} /> Upload Winner Proof
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}