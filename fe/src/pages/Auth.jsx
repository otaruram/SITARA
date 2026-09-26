import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Jika sudah ada role di localStorage (sudah login penuh), langsung lempar ke dashboard
    const role = localStorage.getItem('role');
    if (role === 'rt') navigate('/rt');
    else if (role === 'warga') navigate('/warga');
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Gagal login dengan Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] relative flex items-center justify-center px-4 overflow-hidden bg-slate-50">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-40 transform -rotate-12 animate-pulse" style={{ animationDuration: '4s' }}>
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-slate-100">☁️</div>
        </div>
        <div className="absolute top-40 right-20 opacity-30 transform rotate-12 animate-pulse" style={{ animationDuration: '5s' }}>
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-md border-4 border-slate-100">☁️</div>
        </div>
        
        <div className="absolute bottom-20 left-20 animate-bounce-slow" style={{ animationDuration: '6s' }}>
          <img src="/assets/warga_penasaran.jpg" alt="Warga" className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl transform -rotate-6" />
        </div>
        <div className="absolute top-32 right-32 animate-bounce-slow" style={{ animationDuration: '5s', animationDelay: '1s' }}>
          <img src="/assets/pak_rt_modern.jpg" alt="Pak RT" className="w-40 h-40 rounded-3xl object-cover border-4 border-white shadow-xl transform rotate-6" />
        </div>
        
        <div className="absolute top-1/2 left-10 text-3xl opacity-50">✨</div>
        <div className="absolute bottom-1/3 right-10 text-4xl opacity-50">💡</div>
        
        <div className="absolute w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 bottom-0 right-0 translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2rem] border-2 border-slate-100 shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-500">
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform rotate-3">
              <span className="text-white text-3xl font-black -rotate-3">S</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Masuk ke SITARA</h1>
            <p className="text-slate-500 font-medium">Sistem Prioritas Pengaduan RT</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-xl text-sm font-bold flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-200 text-slate-700 py-4 px-6 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : (
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="text-lg">{loading ? 'Mengarahkan...' : 'Masuk dengan Google'}</span>
          </button>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs mx-auto">
              Dengan masuk, Anda menyetujui ketentuan layanan SITARA. <br/> Data Anda diamankan oleh Google & Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
