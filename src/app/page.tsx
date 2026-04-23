'use client';
import Link from 'next/link';
import { Target, Users, Shield, ArrowRight, Trophy } from 'lucide-react';

export default function EntryPortal() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 overflow-hidden">
      
      <div className="relative z-10 max-w-4xl text-center space-y-8 mt-10 animate-in fade-in slide-in-from-top-6 duration-1000">
        <div className="flex justify-center mb-6">
          <div className="bg-emerald-500/10 p-6 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl animate-float">
            <Target className="w-16 h-16 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
          Golf <span className="text-emerald-400">Platform</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          A subscription-driven platform combining golf performance tracking and 
          charitable giving. Track scores, enter draws, and change lives.
        </p>
      </div>

      <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
        
        <Link href="/login" className="group bg-slate-900/40 p-10 rounded-[3.5rem] border border-white/5 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center backdrop-blur-2xl">
          <div className="bg-emerald-500/10 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">Player Portal</h2>
          <p className="text-slate-500 mb-8 font-medium">Log Stableford scores, participate in monthly prize pools, and manage your charity impact.</p>
          <div className="mt-auto w-full bg-emerald-500 text-black py-5 rounded-2xl font-black flex items-center justify-center group-hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10">
            ENTER PLAYER PORTAL <ArrowRight className="w-5 h-5 ml-2" />
          </div>
        </Link>

        <Link href="/adminlogin" className="group bg-slate-900/40 p-10 rounded-[3.5rem] border border-white/5 hover:border-purple-500/50 transition-all flex flex-col items-center text-center backdrop-blur-2xl relative overflow-hidden">
          <div className="bg-purple-500/10 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
            <Shield className="w-10 h-10 text-purple-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">Admin Center</h2>
          <p className="text-slate-500 mb-8 font-medium">Manage users, configure automated draws, and verify winner submissions.</p>
          <div className="mt-auto w-full bg-purple-600/10 text-purple-400 py-5 rounded-2xl font-black flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
            SECURE ACCESS <ArrowRight className="w-5 h-5 ml-2" />
          </div>
          <Trophy className="absolute -right-6 -bottom-6 w-32 h-32 text-purple-500/5 -rotate-12" />
        </Link>
      </div>
    </div>
  );
}