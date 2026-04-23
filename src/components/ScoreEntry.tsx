'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Loader2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ScoreEntryProps {
  userId: string;
  onScoreAdded: () => void;
}

export default function ScoreEntry({ userId, onScoreAdded }: ScoreEntryProps) {
  const [score, setScore] = useState('');
  const [course, setCourse] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const supabase = createClient();

  const handleRollingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. VITAL: Get the actual authenticated user to satisfy RLS [cite: 38]
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required");

      const currentUserId = user.id;

      // 2. PRD CONSTRAINT: Only one score entry per date 
      const { data: existingDateEntry } = await supabase
        .from('scores')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('created_at', date)
        .maybeSingle();

      if (existingDateEntry) {
        throw new Error("A score for this date already exists. Only one entry per day is permitted.");
      }

      // 3. ROLLING 5 LOGIC: Fetch existing scores [cite: 41, 45]
      const { data: existingScores } = await supabase
        .from('scores')
        .select('id')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: true });

      // 4. ROLLING 5 LOGIC: If 5 scores exist, delete the oldest 
      if (existingScores && existingScores.length >= 5) {
        const oldestScoreId = existingScores[0].id;
        await supabase.from('scores').delete().eq('id', oldestScoreId);
      }

      // 5. INSERT: Add the new Stableford score [cite: 42, 43]
      const { error: insertError } = await supabase.from('scores').insert([{ 
        user_id: currentUserId,
        score: parseInt(score), 
        course_name: course,
        created_at: date 
      }]);

      if (insertError) throw insertError;

      // SUCCESS FLOW
      setScore('');
      setCourse('');
      setDate('');
      onScoreAdded();

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-emerald-500/20 p-3 rounded-2xl">
          <Target className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Log Round</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Stableford 1-45 Format</p>
        </div>
      </div>

      <form onSubmit={handleRollingSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Course Input */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Course Name" 
              required
              className="w-full bg-black/40 border border-white/5 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 font-medium"
              value={course} 
              onChange={(e) => setCourse(e.target.value)} 
            />
            <Target className="absolute left-4 top-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" size={18} />
          </div>

          {/* Date Input */}
          <div className="relative group">
            <input 
              type="date" 
              required
              className="w-full bg-black/40 border border-white/5 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-medium [color-scheme:dark]"
              value={date} 
              onChange={(e) => setDate(e.target.value)}
            />
            <Calendar className="absolute left-4 top-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" size={18} />
          </div>

          {/* Score Input */}
          <div className="relative group">
            <input 
              type="number" 
              min="1" 
              max="45" 
              placeholder="Stableford Points (1-45)" 
              required
              className="w-full bg-black/40 border border-white/5 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-700 font-medium"
              value={score} 
              onChange={(e) => setScore(e.target.value)}
            />
            <Trophy className="absolute left-4 top-5 text-slate-700 group-focus-within:text-emerald-500 transition-colors" size={18} />
          </div>
        </div>

        {/* Error Message Display */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
            >
              <AlertCircle size={16} /> {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          disabled={loading}
          className="relative w-full overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-black py-5 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <CheckCircle2 size={18} />
              Update Rolling 5 Experience
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Verified System</span>
        <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}