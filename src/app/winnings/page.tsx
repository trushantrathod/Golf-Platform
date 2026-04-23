'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase';
import { Trophy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function WinningsPage() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const checkWinnings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get latest draw
      const { data: draw } = await supabase
        .from('draws')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!draw) {
        setResult("No draw available yet");
        setLoading(false);
        return;
      }

      const drawNumbers = draw.numbers;

      // 2. Get user scores
      const { data: scores } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', user.id);

      if (!scores || scores.length === 0) {
        setResult("No scores entered");
        setLoading(false);
        return;
      }

      const userNumbers = scores.map(s => s.score);

      // 3. Compare matches
      const matches = userNumbers.filter(n => drawNumbers.includes(n)).length;

      if (matches >= 5) {
        setResult("🏆 Jackpot Winner (5 Match)");
      } else if (matches === 4) {
        setResult("🥇 High Tier Winner (4 Match)");
      } else if (matches === 3) {
        setResult("🥉 Entry Tier Winner (3 Match)");
      } else {
        setResult("No Win This Month");
      }

      setLoading(false);
    };

    checkWinnings();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-4xl mx-auto">

        <Link href="/dashboard" className="text-slate-500 hover:text-emerald-400">
          ← Back to Dashboard
        </Link>

        <h1 className="text-5xl font-black mt-10 mb-6">
          Your Winnings
        </h1>

        {loading ? (
          <p className="text-slate-400">Checking results...</p>
        ) : (
          <div className="bg-slate-900 p-10 rounded-3xl text-center">
            <Trophy className="mx-auto mb-4 text-emerald-400" size={40} />
            <h2 className="text-2xl font-bold">{result}</h2>
          </div>
        )}

      </div>
    </div>
  );
}