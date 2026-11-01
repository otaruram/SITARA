import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, MapPin, UserCheck, ShieldAlert, Sparkles, ChevronDown } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');
  const userRt = localStorage.getItem('rt');
  const userRw = localStorage.getItem('rw');
  const userKelurahan = localStorage.getItem('kelurahan');

  // Hallmark Material Theme Switcher (Atelier / Terminal / Clean)
  const [theme, setTheme] = useState(() => localStorage.getItem('sitara_theme') || 'atelier');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('sitara_theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col texture-paper antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200">
      
      {/* Hallmark Top Telemetry & Archetype Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 border-b border-stone-800 font-mono-code flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span className="text-stone-400">SITARA v2.4</span>
          <span className="hidden sm:inline text-stone-600">|</span>
          <span className="hidden sm:inline text-stone-300 font-medium">Sistem Tanggap Darurat & Prioritas Pengaduan Warga Berbasis AI</span>
        </div>

        {/* Hallmark Theme Persona Switcher */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-stone-400 hidden md:inline">Karakter Desain:</span>
          <button
            onClick={() => setTheme('atelier')}
            className={`px-2 py-0.5 rounded transition-colors ${theme === 'atelier' ? 'bg-orange-700 text-white font-bold' : 'text-stone-400 hover:text-white'}`}
            title="Karakter 1: Atelier / Civic Heritage (Warm Paper & Craft)"
          >
            Atelier (Heritage)
          </button>
          <button
            onClick={() => setTheme('terminal')}
            className={`px-2 py-0.5 rounded transition-colors ${theme === 'terminal' ? 'bg-stone-700 text-emerald-300 font-bold' : 'text-stone-400 hover:text-white'}`}
            title="Karakter 2: Relay / Emergency Telemetry (Console Gelap & Triage)"
          >
            Relay (Telemetry)
          </button>
          <button
            onClick={() => setTheme('clean')}
            className={`px-2 py-0.5 rounded transition-colors ${theme === 'clean' ? 'bg-sky-700 text-white font-bold' : 'text-stone-400 hover:text-white'}`}
            title="Karakter 3: Civil Clean (Modern Municipal Minimal)"
          >
            Civil Clean
          </button>
        </div>
      </div>

      {/* Main Civic Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-hairline transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo & Administrative Seal */}
          <Link 
            to={userRole === 'rt' ? '/rt' : userRole === 'warga' ? '/warga' : '/'} 
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-orange-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-serif-display text-2xl font-bold shadow-sm border border-stone-800 group-hover:bg-orange-700 transition-colors">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-serif-display font-bold tracking-tight text-[var(--text-primary)] leading-none">
                  SITARA
                </span>
                <span className="font-mono-code text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-600 bg-orange-500/10">
                  AI Triage
                </span>
              </div>
              <p className="text-[11px] font-mono-code text-[var(--text-muted)] tracking-tight">
                Wilayah Tanggap Mandiri Warga & RT
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-3">
            {userRole ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Territory Badge */}
                {userRt && (
                  <div className="hidden md:flex items-center gap-1.5 text-xs font-mono-code text-[var(--text-muted)] bg-[var(--bg-surface)] px-3 py-1.5 rounded border border-hairline">
                    <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>RT {userRt} / RW {userRw} • {userKelurahan}</span>
                  </div>
                )}

                {/* User Role Link */}
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-primary)] hover:text-orange-600 font-medium px-3 py-1.5 rounded border border-hairline bg-[var(--bg-card)] hover:border-orange-500 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-orange-600" />
                  <span className="font-mono-code uppercase font-semibold text-xs tracking-wider">
                    {userRole === 'rt' ? 'Pengurus RT' : 'Warga'}
                  </span>
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-mono-code text-[var(--text-muted)] hover:text-red-600 px-3 py-1.5 rounded border border-hairline hover:border-red-400 bg-[var(--bg-card)] transition-colors cursor-pointer"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/auth" 
                  className="text-xs sm:text-sm font-mono-code font-semibold bg-stone-900 text-stone-50 hover:bg-orange-700 px-4 sm:px-6 py-2.5 rounded transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <span>Akses Sistem</span>
                  <span className="text-orange-400">→</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Outlet />
      </main>
      
      {/* Hallmark Architectural Civic Footer */}
      {isLandingPage && (
        <footer className="border-t border-hairline bg-[var(--bg-card)] py-12 px-4 sm:px-6 mt-auto transition-colors">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[var(--text-muted)]">
            <div className="space-y-1">
              <div className="font-serif-display text-base font-bold text-[var(--text-primary)]">
                SITARA — Sistem Tanggap Darurat & Laporan Warga
              </div>
              <p className="font-mono-code text-[11px]">
                Dibangun dengan standar integritas material Hallmark. Menjamin responsif, bebas klise AI, dan inklusif untuk seluruh warga.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 font-mono-code text-[11px]">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                ● Layanan Darurat Aktif 24/7
              </span>
              <span>Standar SP4N-LAPOR Compatible</span>
              <span>Hak Cipta &copy; {new Date().getFullYear()} SITARA</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
