'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase'; // Make sure this path matches your setup
import { useRouter } from 'next/navigation';
import { Zap, Crown, ArrowRight, ArrowLeft, ShieldCheck, Trophy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubscription = async (planType: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          subscription_active: true,
          last_billing_date: new Date().toISOString(),
          renewal_date: new Date(Date.now() + (planType === 'yearly' ? 31536000000 : 2592000000)).toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setTimeout(() => {
        setLoading(false);
        router.push('/dashboard?status=success'); 
      }, 1500);

    } catch (err: any) {
      alert("Subscription Error: " + err.message);
      setLoading(false);
    }
  };
  
  const features = [
    { icon: <Trophy size={16} />, text: "Entry into Monthly Prize Draws" },
    { icon: <Zap size={16} />, text: "Full 'Rolling 5' Performance Tracking" },
    { icon: <Heart size={16} />, text: "Automatic Charity Contributions" },
    { icon: <ShieldCheck size={16} />, text: "Verified Winner Claims Portal" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12 selection:bg-emerald-500/30">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
        </Link>
      </div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Premium Access</span>
          <h1 className="text-6xl lg:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            Unlock the <span className="text-emerald-500">Rewards</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto">
            Choose a plan to activate your membership and start tracking your performance with impact.
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
        
        {/* Monthly Plan Card */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-slate-900/40 border border-white/5 p-12 rounded-[3.5rem] backdrop-blur-xl flex flex-col relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="mb-10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Monthly Access</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black italic">$15</span>
                <span className="text-slate-600 font-black uppercase text-xs">/ Month</span>
              </div>
            </div>

            <div className="space-y-5 mb-12">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-400">
                  <div className="text-emerald-500">{f.icon}</div>
                  <span className="text-xs font-bold uppercase tracking-wide">{f.text}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleSubscription('monthly')}
              disabled={loading}
              className="w-full bg-white text-black py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'Processing...' : 'Start Now'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Yearly Plan Card (Featured) */}
        <motion.div 
          whileHover={{ y: -10 }}
          className="bg-emerald-500/5 border-2 border-emerald-500/30 p-12 rounded-[3.5rem] backdrop-blur-xl flex flex-col relative overflow-hidden group"
        >
          <div className="absolute top-8 right-8 bg-emerald-500 text-black px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic">
            Best Value
          </div>

          <div className="relative z-10">
            <div className="mb-10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">Annual Pass</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black italic">$144</span>
                <span className="text-slate-600 font-black uppercase text-xs">/ Year</span>
              </div>
              <p className="text-emerald-500/60 text-[10px] font-black uppercase tracking-widest mt-2">Get 2 Months Free</p>
            </div>

            <div className="space-y-5 mb-12">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-4 text-white">
                  <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">{f.icon}</div>
                  <span className="text-xs font-bold uppercase tracking-wide">{f.text}</span>
                </div>
              ))}
              <div className="flex items-center gap-4 text-emerald-400">
                <div className="bg-emerald-500/20 p-2 rounded-lg"><Crown size={16} /></div>
                <span className="text-xs font-black uppercase tracking-wide italic underline underline-offset-4">VIP Draw Entry Multiplier</span>
              </div>
            </div>

            <button 
              onClick={() => handleSubscription('yearly')}
              disabled={loading}
              className="w-full bg-emerald-500 text-black py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
            >
              {loading ? 'Processing...' : 'Secure Yearly Access'} <ArrowRight size={16} />
            </button>
          </div>
          
          <Crown className="absolute -right-10 -bottom-10 text-emerald-500 opacity-[0.03] w-64 h-64 rotate-12" />
        </motion.div>
      </div>

      <p className="text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        Secure Payments Powered by Stripe &bull; Cancel Anytime
      </p>
    </div>
  );
}