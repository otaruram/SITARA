import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, MapPin, UserCircle } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');
  const userRt = localStorage.getItem('rt');
  const userRw = localStorage.getItem('rw');
  const userKelurahan = localStorage.getItem('kelurahan');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link to={userRole === 'rt' ? '/rt' : userRole === 'warga' ? '/warga' : '/'} className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold text-sm sm:text-lg shrink-0">
              S
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              SITARA
            </span>
          </Link>
          <nav>
            {userRole ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Info wilayah - hidden on mobile */}
                <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>RT {userRt}/RW {userRw} • {userKelurahan}</span>
                </div>
                <Link to="/profile" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg">
                  <UserCircle className="w-5 h-5 text-slate-700" />
                  <span className="hidden sm:inline-block font-semibold text-slate-900 capitalize">{userRole}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="text-xs sm:text-sm font-medium bg-slate-900 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-md hover:bg-slate-800 transition-colors shadow-sm"
              >
                Masuk
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      
      {isLandingPage && (
        <footer className="bg-white border-t border-slate-200 py-4 sm:py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs sm:text-sm text-slate-500">
            &copy; {new Date().getFullYear()} SITARA — Sistem Prioritas Pengaduan RT Berbasis AI.
          </div>
        </footer>
      )}
    </div>
  );
}
