import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldAlert, Loader2, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [role, setRole] = useState(''); // '' | WARGA | RT
  const [name, setName] = useState(localStorage.getItem('name') || '');
  
  // Wilayah fields
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kota, setKota] = useState('KOTA BOGOR');
  
  // Untuk dropdown Warga
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Ambil daftar wilayah yang sudah didaftarkan oleh RT
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/locations`);
        const data = await res.json();
        if (res.ok) {
          setLocations(data.data || []);
        }
      } catch (err) {
        console.error('Gagal mengambil data wilayah:', err);
      }
    };
    fetchLocations();
  }, []);

  const handleSelectLocation = (value) => {
    setSelectedLocation(value);
    if (value) {
      const loc = locations[parseInt(value)];
      if (loc) {
        setRt(loc.rt);
        setRw(loc.rw);
        setKelurahan(loc.kelurahan);
        setKecamatan(loc.kecamatan);
        setKota(loc.kota || 'KOTA BOGOR');
      }
    } else {
      setRt(''); setRw(''); setKelurahan(''); setKecamatan(''); setKota('KOTA BOGOR');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!role) {
      setError('Silakan pilih peran Anda terlebih dahulu.');
      return;
    }
    if (!rt || !rw || !kelurahan || !kecamatan || !kota) {
      setError('Semua data wilayah (RT, RW, Kelurahan, Kecamatan, Kota) wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role, rt, rw, kelurahan, kecamatan, kota }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan profil');

      // Simpan data ke localStorage
      localStorage.setItem('role', data.user.role.toLowerCase());
      localStorage.setItem('name', data.user.name);
      localStorage.setItem('rt', data.user.rt);
      localStorage.setItem('rw', data.user.rw);
      localStorage.setItem('kelurahan', data.user.kelurahan);
      localStorage.setItem('kecamatan', data.user.kecamatan);
      localStorage.setItem('kota', data.user.kota || kota);

      // Arahkan ke dashboard
      if (data.user.role === 'RT') {
        navigate('/rt');
      } else {
        navigate('/warga');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg rounded-xl border-2 border-hairline bg-[var(--bg-card)] shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Title & Seal */}
        <div className="text-center space-y-2 border-b border-hairline pb-5">
          <div className="font-mono-code text-xs text-orange-600 font-bold uppercase tracking-wider">
            Registrasi Yurisdiksi
          </div>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Lengkapi Profil Wilayah
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-mono-code">
            Pilih peranan Anda dan tautkan wilayah administrasi RT / RW Anda.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
            Pilih Peranan Anda:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setRole('WARGA'); setRt(''); setRw(''); setKelurahan(''); setKecamatan(''); setKota('KOTA BOGOR'); setSelectedLocation(''); }}
              className={`p-4 rounded border text-left transition-colors cursor-pointer ${
                role === 'WARGA' 
                  ? 'border-orange-600 bg-orange-50/50 shadow-sm' 
                  : 'border-hairline bg-[var(--bg-surface)] hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-code text-xs font-bold text-[var(--text-primary)]">Warga</span>
                {role === 'WARGA' && <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono-code">
                Kirim & pantau laporan lingkungan
              </p>
            </button>
            
            <button
              type="button"
              onClick={() => { setRole('RT'); setRt(''); setRw(''); setKelurahan(''); setKecamatan(''); setKota('KOTA BOGOR'); setSelectedLocation(''); }}
              className={`p-4 rounded border text-left transition-colors cursor-pointer ${
                role === 'RT' 
                  ? 'border-orange-600 bg-orange-50/50 shadow-sm' 
                  : 'border-hairline bg-[var(--bg-surface)] hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono-code text-xs font-bold text-[var(--text-primary)]">Pengurus RT</span>
                {role === 'RT' && <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono-code">
                Kelola & tindak lanjuti antrean aduan
              </p>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-mono-code font-bold">
            ⚠️ {error}
          </div>
        )}

        {role && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Nama Lengkap Sesuai KTP
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded border border-hairline bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:border-orange-600 transition-colors font-sans"
                placeholder="Contoh: Budi Santoso"
                required
              />
            </div>

            {/* WARGA: Dropdown pilih wilayah dari RT yang sudah terdaftar */}
            {role === 'WARGA' && (
              <div className="p-4 rounded border border-hairline bg-[var(--bg-surface)] space-y-2">
                <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Pilih Wilayah RT Anda:
                </label>
                {locations.length === 0 ? (
                  <p className="text-xs text-orange-700 font-mono-code">
                    Belum ada Pengurus RT yang mendaftarkan wilayah. Hubungi pengurus RT Anda agar mendaftar terlebih dahulu.
                  </p>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => handleSelectLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded border border-hairline bg-[var(--bg-card)] text-[var(--text-primary)] text-xs font-mono-code appearance-none cursor-pointer focus:border-orange-600"
                      required
                    >
                      <option value="">-- Pilih Rukun Tetangga Terdaftar --</option>
                      {locations.map((loc, idx) => (
                        <option key={idx} value={idx}>
                          RT {loc.rt} / RW {loc.rw} — Kel. {loc.kelurahan}, Kec. {loc.kecamatan}{loc.kota ? `, ${loc.kota}` : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>
            )}

            {/* RT: Input manual wilayah */}
            {role === 'RT' && (
              <div className="p-4 rounded border border-hairline bg-[var(--bg-surface)] space-y-3">
                <div className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Data Wilayah RT yang Dikelola:
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono-code text-[var(--text-muted)]">Nomor RT</label>
                    <input 
                      type="text" 
                      value={rt}
                      onChange={(e) => setRt(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-hairline bg-[var(--bg-card)] text-xs font-mono-code"
                      placeholder="Contoh: 005"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono-code text-[var(--text-muted)]">Nomor RW</label>
                    <input 
                      type="text" 
                      value={rw}
                      onChange={(e) => setRw(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-hairline bg-[var(--bg-card)] text-xs font-mono-code"
                      placeholder="Contoh: 007"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono-code text-[var(--text-muted)]">Kelurahan</label>
                    <input 
                      type="text" 
                      value={kelurahan}
                      onChange={(e) => setKelurahan(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-hairline bg-[var(--bg-card)] text-xs font-mono-code"
                      placeholder="Kebon Kelapa"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono-code text-[var(--text-muted)]">Kecamatan</label>
                    <input 
                      type="text" 
                      value={kecamatan}
                      onChange={(e) => setKecamatan(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-hairline bg-[var(--bg-card)] text-xs font-mono-code"
                      placeholder="Bogor Tengah"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono-code text-[var(--text-muted)]">Kota / Kabupaten</label>
                  <input 
                    type="text" 
                    value={kota}
                    onChange={(e) => setKota(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-hairline bg-[var(--bg-card)] text-xs font-mono-code"
                    placeholder="KOTA BOGOR"
                    required
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || (role === 'WARGA' && locations.length === 0)}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-orange-700 text-white py-3 rounded font-mono-code text-xs font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin text-orange-400" /> : null}
              <span>{loading ? 'Menyimpan Data...' : 'Konfirmasi & Masuk ke Dasbor'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
