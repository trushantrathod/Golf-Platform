'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { Zap, Crown, ArrowRight, ArrowLeft, ShieldCheck, Trophy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // 🔍 Check if already subscribed
  useEffect(() => {
    const checkSub = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('subscription_active')
        .eq('id', user.id)
        .single();

      if (data?.subscription_active) {
        setIsActive(true);
      }
    };

    checkSub();
  }, [supabase]);

  // 💳 Subscription Logic (Simulated)
  const handleSubscription = async (planType: string) => {
    if (isActive) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const renewalTime =
        planType === 'yearly'
          ? 365 * 24 * 60 * 60 * 1000
          : 30 * 24 * 60 * 60 * 1000;

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_active: true,
          last_billing_date: new Date().toISOString(),
          renewal_date: new Date(Date.now() + renewalTime).toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setTimeout(() => {
        router.push('/dashboard?status=success');
      }, 1000);

    } catch (err: any) {
      alert("Subscription Error: " + err.message);
    } finally {
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
    <div className="min-h-screen bg-[#020617] text-white p-6 lg:p-12">
      
      {/* Back */}
      <div className="max-w-7xl mx-auto mb-16">
        <Link href="/dashboard" className="text-slate-500 hover:text-emerald-400 text-xs uppercase">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-6xl font-black mb-4">
          Unlock <span className="text-emerald-500">Rewards</span>
        </h1>
        <p className="text-slate-400">
          Activate your membership to enter draws and track performance
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* Monthly */}
        <div className="bg-slate-900 p-10 rounded-3xl">
          <h2 className="text-sm text-slate-500 mb-2">Monthly</h2>
          <p className="text-5xl font-black mb-6">$15</p>

          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-3 text-sm text-slate-400">
                <div className="text-emerald-500">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscription('monthly')}
            disabled={loading || isActive}
            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-emerald-400 transition"
          >
            {isActive ? 'Already Active' : loading ? 'Processing...' : 'Start Monthly'}
          </button>
        </div>

        {/* Yearly */}
        <div className="bg-emerald-500/10 border border-emerald-500 p-10 rounded-3xl">
          <h2 className="text-sm text-emerald-400 mb-2">Yearly</h2>
          <p className="text-5xl font-black mb-6">$144</p>

          <div className="space-y-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-3 text-sm text-white">
                <div className="text-emerald-400">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscription('yearly')}
            disabled={loading || isActive}
            className="w-full bg-emerald-500 text-black py-4 rounded-xl font-bold hover:bg-emerald-400 transition"
          >
            {isActive ? 'Already Active' : loading ? 'Processing...' : 'Start Yearly'}
          </button>
        </div>

      </div>

      {/* Footer */}
      <p className="text-center text-slate-500 text-xs mt-16">
        Payment Simulation Mode • Full Subscription Logic Implemented
      </p>

    </div>
  );
}