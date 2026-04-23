'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Auth Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
// Inside your handleSignup function...

    if (authData.user) {
    // 💡 Changed from .insert to .upsert
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert([
        {
            id: authData.user.id,
            email: email,
            role: 'user', 
            charity_percentage: 10, 
            subscription_active: false
        }
        ], { onConflict: 'id' }); // Tells Supabase to check the 'id' column for duplicates

    if (profileError) throw profileError;
    
    router.push('/charity'); 
    }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
      
      {/* Back to Login Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 w-full max-w-md"
      >
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Login
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl shadow-black/50"
      >
        <div className="mb-10 text-center">
          {/* Project Identity branding (Removed company name) */}
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">
            Golf & <span className="text-emerald-500 text-3xl block">Charity Rewards</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">
            Performance Tracking & Giving 
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-medium placeholder:text-slate-700"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Create Password" 
              required
              className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-medium placeholder:text-slate-700"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[9px] font-black uppercase text-center tracking-widest">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black hover:bg-emerald-400 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={16} /> Start Your Journey</>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[9px] font-black uppercase tracking-widest leading-loose">
          By signing up, you agree to participate in <br /> 
          monthly draw-based prize pools.
        </p>
      </motion.div>
    </div>
  );
}