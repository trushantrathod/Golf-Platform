'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const supabase = createClient(); 

  const handleAdminLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setErrorMsg(null);

    // 1. Attempt the Login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
    });
    
    if (authError) {
      setErrorMsg(authError.message);
      setIsLoading(false);
      return;
    }

    // 2. Check if this user is actually an Admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();

      // ADD THESE THREE LINES:
    console.log("Logged in User ID:", authData.user.id);
    console.log("Profile Data Found:", profile);

    if (profile?.is_admin) {
      router.push('/admin');
    } else {
      // Not an admin? Log them back out immediately for security
      await supabase.auth.signOut();
      setErrorMsg("Access Denied: This account does not have Admin privileges.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200">
      
      <Link href="/" className="absolute top-8 left-8 text-slate-500 hover:text-purple-400 transition-colors flex items-center gap-2 font-medium">
        ← Exit to Main Site
      </Link>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-500/10 p-5 rounded-3xl ring-1 ring-purple-500/40 mb-4 shadow-[0_0_50px_-10px_rgba(168,85,247,0.4)]">
            <ShieldCheck className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Admin Access</h1>
          <p className="text-slate-500 mt-2 font-medium">Authorized Personnel Only</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="space-y-5">
            
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in zoom-in duration-300">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-purple-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  className="w-full pl-12 p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Security Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 group-focus-within:text-purple-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-12 p-4 bg-slate-950 border border-slate-800 rounded-2xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-white transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={handleAdminLogin} 
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-purple-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-900/40 mt-4"
            >
              {isLoading ? 'Verifying...' : 'Initialize Access'} <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-8 font-medium">
          Secure Encrypted Connection Required
        </p>
      </div>
    </div>
  );
}