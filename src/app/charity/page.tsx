'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase';
import { 
  Heart, Search, CheckCircle2, ArrowLeft, 
  Sparkles, Globe, Shield, Info, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CharityDirectory() {
  const [charities, setCharities] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch available charities 
      const { data: charityData } = await supabase.from('charities').select('*');
      setCharities(charityData || []);

      // Fetch user's current preferences 
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('selected_charity_id, charity_percentage')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setSelectedId(profile.selected_charity_id);
          setPercentage(profile.charity_percentage || 10);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  // Function to sync both charity choice and percentage
  const syncImpactData = async (updates: { selected_charity_id?: string, charity_percentage?: number }) => {
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) console.error("Update failed:", error.message);
    setUpdating(false);
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500 w-10 h-10" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 pb-20">
      <div className="max-w-7xl mx-auto p-8 lg:p-16">
        
        {/* Navigation */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 mb-12 transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Dashboard
        </Link>

        {/* Header */}
        <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">
              Charity <span className="text-emerald-500">Directory</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-xl">
              Choose the cause your subscription will support. You can change your recipient or increase your impact at any time.
            </p>
          </motion.div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-5 top-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Filter causes..." 
              className="w-full bg-slate-900/50 border border-white/5 p-5 pl-14 rounded-3xl outline-none focus:border-emerald-500/50 transition-all text-white font-medium backdrop-blur-xl"
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </header>

        {/* Impact Slider  */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 bg-gradient-to-br from-slate-900/80 to-black border border-white/5 p-10 lg:p-14 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden"
        >
          <div className="flex-grow w-full relative z-10">
            <div className="flex justify-between items-center mb-6">
              <label className="font-black text-emerald-400 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                <Sparkles size={14} /> Adjust Your Impact
              </label>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Min 10% Required </span>
            </div>
            
            <input 
              type="range" min="10" max="100" step="5" 
              value={percentage} 
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 mb-4"
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setPercentage(val);
                syncImpactData({ charity_percentage: val });
              }} 
            />
            <div className="flex justify-between text-[9px] font-black text-slate-700 uppercase tracking-widest">
              <span>Standard (10%)</span>
              <span>Hero (50%)</span>
              <span>Legend (100%)</span>
            </div>
          </div>

          <div className="bg-emerald-500 text-black px-12 py-8 rounded-[2.5rem] text-center shadow-[0_20px_40px_rgba(16,185,129,0.2)] relative min-w-[200px]">
            <span className="block text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Your Contribution</span>
            <span className="text-6xl font-black italic tracking-tighter leading-none">{percentage}%</span>
            {updating && <Loader2 className="absolute top-4 right-4 animate-spin w-4 h-4 opacity-50" />}
          </div>
        </motion.div>

        {/* Charity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCharities.map((charity, idx) => (
              <motion.div 
                key={charity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setSelectedId(charity.id);
                  syncImpactData({ selected_charity_id: charity.id });
                }}
                className={`p-10 rounded-[3rem] border-2 transition-all cursor-pointer relative group flex flex-col h-full ${
                  selectedId === charity.id 
                  ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                  : 'border-white/5 bg-slate-900/40 hover:border-white/20'
                }`}
              >
                <div className="mb-8 flex justify-between items-start">
                    <div className={`p-4 rounded-2xl ${selectedId === charity.id ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-400'}`}>
                    {/* Change ShieldHeart to Heart here */}
                    <Heart size={24} fill={selectedId === charity.id ? "currentColor" : "none"} />
                    </div>
                  {selectedId === charity.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-emerald-500 text-black p-1 rounded-full">
                      <CheckCircle2 size={20} />
                    </motion.div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter group-hover:text-emerald-400 transition-colors">
                  {charity.name}
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">
                  {charity.description || "A dedicated organization working toward impactful change and community support."}
                </p>

                <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-slate-400 transition-all">
                  <Globe size={14} /> Learn More <ArrowUpRight size={12} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ArrowUpRight({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" 
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}