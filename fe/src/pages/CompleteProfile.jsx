import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldUser, Loader2, MapPin, ChevronDown } from 'lucide-react';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [role, setRole] = useState(''); // '' | WARGA | RT
  const [name, setName] = useState(localStorage.getItem('name') || '');
  
  // Wilayah fields
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  
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
          setLocations(data.data);
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
      }
    } else {
      setRt(''); setRw(''); setKelurahan(''); setKecamatan('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!role) {
      setError('Silakan pilih peran Anda terlebih dahulu.');
      return;
    }
    if (!rt || !rw || !kelurahan || !kecamatan) {
      setError('Semua data wilayah wajib diisi.');
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
        body: JSON.stringify({ name, role, rt, rw, kelurahan, kecamatan }),
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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-slate-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Lengkapi Profil Anda</h1>
            <p className="text-sm text-slate-500">Pilih peran dan isi data wilayah untuk melanjutkan</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setRole('WARGA'); setRt(''); setRw(''); setKelurahan(''); setKecamatan(''); setSelectedLocation(''); }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                role === 'WARGA' 
                  ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-sm' 
                  : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <User className={`w-6 h-6 mb-1.5 ${role === 'WARGA' ? 'text-slate-900' : 'text-slate-400'}`} />
              <span className="font-semibold text-sm">Warga</span>
              <span className="text-[10px] mt-0.5 opacity-70">Buat Laporan</span>
            </button>
            
            <button
              type="button"
              onClick={() => { setRole('RT'); setRt(''); setRw(''); setKelurahan(''); setKecamatan(''); setSelectedLocation(''); }}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                role === 'RT' 
                  ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-sm' 
                  : 'border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldUser className={`w-6 h-6 mb-1.5 ${role === 'RT' ? 'text-slate-900' : 'text-slate-400'}`} />
              <span className="font-semibold text-sm">Pengurus RT</span>
              <span className="text-[10px] mt-0.5 opacity-70">Kelola Laporan</span>
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">{error}</div>}

          {role && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                  placeholder="Nama Anda"
                  required
                />
              </div>

              {/* WARGA: Dropdown pilih wilayah dari RT yang sudah terdaftar */}
              {role === 'WARGA' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-blue-800">📍 Pilih Wilayah RT Anda</p>
                  {locations.length === 0 ? (
                    <p className="text-xs text-blue-600">Belum ada Pengurus RT yang mendaftar. Hubungi pengurus RT Anda untuk mendaftar terlebih dahulu.</p>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedLocation}
                        onChange={(e) => handleSelectLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm appearance-none cursor-pointer"
                        required
                      >
                        <option value="">-- Pilih Wilayah --</option>
                        {locations.map((loc, idx) => (
                          <option key={idx} value={idx}>
                            RT {loc.rt} / RW {loc.rw} — Kel. {loc.kelurahan}, Kec. {loc.kecamatan}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  )}
                </div>
              )}

              {/* RT: Input manual wilayah */}
              {role === 'RT' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-semibold text-slate-700">📍 Data Wilayah (Input Manual)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-600">Nomor RT</label>
                      <input 
                        type="text" 
                        value={rt}
                        onChange={(e) => setRt(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        placeholder="Contoh: 005"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-600">Nomor RW</label>
                      <input 
                        type="text" 
                        value={rw}
                        onChange={(e) => setRw(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        placeholder="Contoh: 003"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-600">Kelurahan</label>
                    <input 
                      type="text" 
                      value={kelurahan}
                      onChange={(e) => setKelurahan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                      placeholder="Nama Kelurahan"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-slate-600">Kecamatan</label>
                    <input 
                      type="text" 
                      value={kecamatan}
                      onChange={(e) => setKecamatan(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                      placeholder="Nama Kecamatan"
                      required
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading || (role === 'WARGA' && locations.length === 0)}
                className="w-full flex items-center justify-center bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan & Lanjutkan'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
