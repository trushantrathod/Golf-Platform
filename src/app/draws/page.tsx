'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase';
import { motion } from 'framer-motion';
import { 
  Trophy, ArrowLeft, TrendingUp, Users, 
  Calendar, Sparkles, Target, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function PrizePoolsPage() {
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [latestDraw, setLatestDraw] = useState<number[]>([]);
  const [generating, setGenerating] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchPoolData = async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_active', true);

      setSubscriberCount(count || 0);
      setLoading(false);
    };

    const fetchLatestDraw = async () => {
      const { data } = await supabase
        .from('draws')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) setLatestDraw(data.numbers);
    };

    fetchPoolData();
    fetchLatestDraw();
  }, [supabase]);

  // 🎲 DRAW GENERATOR
  const generateDraw = async () => {
    setGenerating(true);

    const numbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 45) + 1
    );

    setDrawNumbers(numbers);

    await supabase.from('draws').insert([
      {
        numbers
      }
    ]);

    setLatestDraw(numbers);
    setGenerating(false);
  };

  // 💰 PRIZE POOL LOGIC
  const totalPool = (subscriberCount * 5) + 500;

  const tiers = [
    { name: '5-Number Match', percentage: 40, label: 'Jackpot', rollover: true },
    { name: '4-Number Match', percentage: 35, label: 'High Tier', rollover: false },
    { name: '3-Number Match', percentage: 25, label: 'Entry Tier', rollover: false },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <div className="max-w-7xl mx-auto p-8 lg:p-16">

        {/* Back */}
        <Link href="/dashboard" className="text-slate-500 hover:text-emerald-400 mb-10 inline-block">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <h1 className="text-5xl font-black text-white mb-6">
          Draw Engine
        </h1>

        {/* Generate Button */}
        <button
          onClick={generateDraw}
          disabled={generating}
          className="mb-8 bg-emerald-500 text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition"
        >
          {generating ? 'Generating...' : 'Generate Monthly Draw'}
        </button>

        {/* Current Draw */}
        {drawNumbers.length > 0 && (
          <div className="mb-6 text-lg text-white">
            Current Draw: <span className="text-emerald-400 font-bold">{drawNumbers.join(' - ')}</span>
          </div>
        )}

        {/* Latest Draw */}
        {latestDraw.length > 0 && (
          <div className="mb-12 text-lg text-slate-300">
            Latest Stored Draw: <span className="text-emerald-400">{latestDraw.join(' - ')}</span>
          </div>
        )}

        {/* Pool Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-emerald-500/10 p-10 rounded-3xl">
            <p className="text-emerald-400 text-xs uppercase mb-2">Total Pool</p>
            <h2 className="text-5xl font-black text-white">
              ${totalPool}
            </h2>
            <p className="text-slate-500 text-xs mt-2">
              Next Draw: End of Month
            </p>
          </div>

          <div className="bg-slate-800 p-10 rounded-3xl">
            <p className="text-slate-400 text-xs uppercase">Participants</p>
            <h3 className="text-4xl font-black text-white">
              {subscriberCount}
            </h3>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div key={tier.name} className="bg-slate-900 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2">{tier.name}</h3>
              <p className="text-slate-400 text-sm">{tier.percentage}%</p>
              <p className="text-emerald-400 text-xl font-bold">
                ${((totalPool * tier.percentage) / 100).toFixed(0)}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-slate-500">
          Fair draw system. Equal distribution among winners.
        </div>

      </div>
    </div>
  );
}