import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase otomatis mengambil session dari URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          console.error('Auth callback error:', error);
          navigate('/auth');
          return;
        }

        const token = session.access_token;

        // Cek apakah profil sudah lengkap di database kita
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.profileComplete) {
          // Profil lengkap → simpan data & arahkan ke dashboard
          localStorage.setItem('token', token);
          localStorage.setItem('role', data.user.role.toLowerCase());
          localStorage.setItem('email', data.user.email);
          localStorage.setItem('name', data.user.name);
          localStorage.setItem('rt', data.user.rt);
          localStorage.setItem('rw', data.user.rw);
          localStorage.setItem('kelurahan', data.user.kelurahan);
          localStorage.setItem('kecamatan', data.user.kecamatan);

          if (data.user.role === 'RT') {
            navigate('/rt');
          } else {
            navigate('/warga');
          }
        } else {
          // Profil belum lengkap → arahkan ke halaman lengkapi profil
          localStorage.setItem('token', token);
          localStorage.setItem('email', session.user.email);
          localStorage.setItem('name', session.user.user_metadata?.full_name || session.user.email.split('@')[0]);
          navigate('/complete-profile');
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400 mx-auto" />
        <p className="text-slate-500 font-medium">Memproses login Anda...</p>
      </div>
    </div>
  );
}
