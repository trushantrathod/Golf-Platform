'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase';
import { ShieldCheck, Upload, Loader2 } from 'lucide-react';

export default function WinnerVerification({ drawId }: { drawId: string }) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Upload to Supabase Storage [cite: 83]
    const filePath = `verification/${user?.id}_${drawId}`;
    await supabase.storage.from('winners').upload(filePath, file);

    // 2. Mark submission as pending admin review [cite: 83]
    await supabase.from('winners').insert([{ 
      draw_id: drawId, 
      user_id: user?.id, 
      proof_url: filePath, 
      status: 'Pending' 
    }]);

    setUploading(false);
    alert("Proof submitted for verification!");
  };

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem]">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <ShieldCheck className="text-emerald-400" /> Verify Your Win
      </h3>
      <p className="text-slate-400 text-sm mb-6">Upload a screenshot of your scores to initiate the payout process.</p>
      
      <label className="cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-black text-sm inline-flex items-center gap-2 transition-all">
        {uploading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
        {uploading ? 'Uploading...' : 'Upload Proof Screenshot'}
        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
      </label>
    </div>
  );
}