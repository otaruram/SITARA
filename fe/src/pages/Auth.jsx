import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'rt') navigate('/rt');
    else if (role === 'warga') navigate('/warga');
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Hardcoded production domain sitara.biz.id with localhost fallback during local development
      const redirectOrigin = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? window.location.origin 
        : 'https://sitara.biz.id';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectOrigin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Gagal login dengan Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md rounded-xl border-2 border-hairline bg-[var(--bg-card)] p-8 sm:p-10 shadow-xl space-y-8">
        
        {/* Seal & Heading */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-serif-display text-2xl font-bold mx-auto border border-stone-800 shadow-sm">
            S
          </div>

          <div>
            <h1 className="font-serif-display text-3xl text-[var(--text-primary)] font-bold">
              Autentikasi Wilayah
            </h1>
            <p className="font-mono-code text-xs text-[var(--text-muted)] mt-1">
              Portal Terpadu Warga & Pengurus RT
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-mono-code font-bold">
            ⚠️ {error}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[var(--bg-surface)] hover:bg-stone-200 border border-hairline text-[var(--text-primary)] py-3.5 px-4 rounded font-mono-code text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-600 shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{loading ? 'Menghubungkan ke Google...' : 'Masuk dengan Akun Google'}</span>
          </button>

          <div className="flex items-center gap-2 justify-center font-mono-code text-[11px] text-[var(--text-muted)] pt-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Protokol OAuth 2.0 Diamankan oleh Supabase</span>
          </div>
        </div>

        {/* Security & Regulatory Disclaimers */}
        <div className="pt-6 border-t border-hairline text-center space-y-1 text-[11px] font-mono-code text-[var(--text-muted)] leading-relaxed">
          <p>
            Hak akses data disesuaikan dengan peran (*Role-Based Access Control*) wilayah RT & Kelurahan.
          </p>
          <p className="text-[10px]">
            SITARA &bull; Standar Tanggap Insiden Terverifikasi
          </p>
        </div>

      </div>
    </div>
  );
}
