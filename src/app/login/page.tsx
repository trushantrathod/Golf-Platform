'use client';
import { useState } from 'react'; // Added
import Link from 'next/link';
import { createClient } from '@/utils/supabase'; // Ensure this utility exists
import { ArrowLeft, Target, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // THIS STOPS THE REFRESH
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // SUCCESS: Go to Dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <Link 
        href="/" 
        className="fixed top-10 left-10 flex items-center gap-2 text-slate-500 hover:text-emerald-400 transition-all font-black text-[10px] uppercase tracking-[0.2em] group z-50"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Return Home
      </Link>

      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-6 border border-emerald-500/20">
            <Target className="text-emerald-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 font-medium">Access your player dashboard</p>
        </div>

        {/* Updated Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-600" size={18} />
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#020617] py-4 rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/10 mt-2 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          Don't have an account? <Link href="/signup" className="text-emerald-400 hover:underline">Join the Club</Link>
        </p>
      </div>
    </div>
  );
}