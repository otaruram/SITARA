import React, { useState, useEffect } from 'react';
import { Plus, X, Paperclip, Loader2, MapPin, Send, RefreshCw, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

export default function DashboardWarga() {
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  
  const [whatsapp, setWhatsapp] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchMyComplaints = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/complaints/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setReports(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung geolokasi.");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          setLocationName(data.display_name || 'Lokasi berhasil didapatkan');
        } catch (error) {
          setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
        setGettingLocation(false);
      },
      (error) => {
        alert("Gagal mendapatkan lokasi: " + error.message);
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc) return;
    setError('');
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', desc);
      if (file) {
        formData.append('file', file);
      }
      if (whatsapp) formData.append('whatsapp', whatsapp);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/complaints`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim laporan');

      await fetchMyComplaints();
      setTitle('');
      setDesc('');
      setFile(null);
      setWhatsapp('');
      setLatitude(null);
      setLongitude(null);
      setLocationName('');
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Yakin ingin membatalkan laporan pengaduan ini?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/complaints/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Gagal membatalkan laporan');
      }
      setReports(reports.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch(status.toUpperCase()) {
      case 'PENDING': 
        return (
          <span className="font-mono-code text-[11px] font-bold text-stone-600 bg-stone-100 border border-stone-300 px-2.5 py-1 rounded inline-flex items-center gap-1">
            ● Antrean Menunggu
          </span>
        );
      case 'DIPROSES': 
        return (
          <span className="font-mono-code text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded inline-flex items-center gap-1">
            <Clock className="w-3 h-3 animate-spin" /> Dalam Tindakan RT
          </span>
        );
      case 'SELESAI': 
        return (
          <span className="font-mono-code text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Tuntas Selesai
          </span>
        );
      default: 
        return null;
    }
  };

  const getScoreBadge = (score) => {
    if (score >= 70) {
      return (
        <span className="font-mono-code font-bold text-xs bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
          Skor: {score} (Darurat)
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="font-mono-code font-bold text-xs bg-amber-600 text-white px-2 py-0.5 rounded shadow-sm">
          Skor: {score} (Sedang)
        </span>
      );
    }
    return (
      <span className="font-mono-code font-bold text-xs bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
        Skor: {score || 0} (Info)
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Portal Warga */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-hairline pb-6">
        <div className="space-y-1">
          <div className="font-mono-code text-xs text-orange-600 font-bold uppercase tracking-wider">
            Portal Swadaya & Layanan Warga
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-[var(--text-primary)] font-normal">
            Laporan Lingkungan Anda
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono-code">
            Kirimkan aduan fasilitas rusak, gangguan keamanan, atau situasi darurat langsung ke pengurus RT.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-orange-700 text-white font-mono-code text-xs sm:text-sm font-semibold px-5 py-2.5 rounded transition-colors shadow-sm cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-orange-400" />}
          <span>{showForm ? 'Tutup Formulir' : 'Buat Laporan Baru'}</span>
        </button>
      </div>

      {/* Formulir Pelaporan (Material Style) */}
      {showForm && (
        <div className="p-6 sm:p-8 rounded border-2 border-hairline bg-[var(--bg-card)] space-y-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="border-b border-hairline pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif-display text-2xl text-[var(--text-primary)] font-bold">
                Formulir Laporan Pengaduan Warga
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono-code mt-0.5">
                AI Sumopod akan otomatis membaca deskripsi dan menilai tingkat prioritasnya dalam hitungan detik.
              </p>
            </div>
            <span className="font-mono-code text-[11px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded font-bold">
              AI Triage Terhubung
            </span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-mono-code flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Judul */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Judul Masalah / Laporan <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded border border-hairline bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:border-orange-600 focus:bg-[var(--bg-card)] transition-colors font-sans"
                placeholder="Misal: Kabel tiang listrik putus atau lampu jalan padam di gang 2"
                required
              />
            </div>
            
            {/* Kontak & Lokasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Nomor WhatsApp Pelapor <span className="text-stone-400 font-normal">(Untuk konfirmasi RT)</span>
                </label>
                <input 
                  type="tel" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded border border-hairline bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:border-orange-600 focus:bg-[var(--bg-card)] transition-colors font-mono-code"
                  placeholder="081234567890"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Koordinat Lokasi GPS
                </label>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="w-full bg-[var(--bg-surface)] hover:bg-stone-200 text-[var(--text-primary)] px-4 py-2.5 rounded border border-hairline text-xs font-mono-code font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {gettingLocation ? <Loader2 className="w-4 h-4 animate-spin text-orange-600" /> : <MapPin className="w-4 h-4 text-orange-600" />}
                    <span>{gettingLocation ? 'Mendeteksi titik koordinat...' : 'Bagikan Titik Lokasi Saat Ini'}</span>
                  </button>
                  {locationName && (
                    <div className="text-[11px] font-mono-code text-[var(--text-muted)] bg-[var(--bg-surface)] p-2 rounded border border-hairline truncate">
                      📍 {locationName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Deskripsi Kronologi Kejadian <span className="text-red-500">*</span>
              </label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded border border-hairline bg-[var(--bg-surface)] text-[var(--text-primary)] text-sm focus:border-orange-600 focus:bg-[var(--bg-card)] transition-colors font-sans resize-none leading-relaxed"
                placeholder="Jelaskan kondisi secara faktual: waktu terlihat, dampak terhadap warga, potensi bahaya, dsb..."
                required
              />
            </div>

            {/* Lampiran */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono-code font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Lampirkan Bukti Foto Lapangan <span className="text-stone-400 font-normal">(Opsional)</span>
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile || null);
                  setError('');
                }}
                className="w-full text-xs font-mono-code text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-mono-code file:font-semibold file:bg-stone-900 file:text-stone-100 hover:file:bg-orange-700 cursor-pointer"
              />
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-hairline">
              <span className="text-[11px] font-mono-code text-[var(--text-muted)]">
                * Data langsung diteruskan ke dasbor pengurus RT setempat.
              </span>
              <button 
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-stone-900 hover:bg-orange-700 text-white px-7 py-3 rounded font-mono-code text-xs font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin text-orange-400" /> : <Send className="w-4 h-4 text-orange-400" />}
                <span>{submitting ? 'Menganalisis & Mengirim...' : 'Kirim Laporan Resmi'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Riwayat Laporan Saya */}
      <div className="rounded border border-hairline bg-[var(--bg-card)] overflow-hidden">
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-display text-xl text-[var(--text-primary)] font-bold">
              Riwayat Pengaduan Terkirim
            </h2>
            <span className="font-mono-code text-[11px] text-[var(--text-muted)]">
              ({reports.length} arsip)
            </span>
          </div>

          <button 
            onClick={fetchMyComplaints} 
            className="inline-flex items-center gap-1.5 text-xs font-mono-code text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Segarkan</span>
          </button>
        </div>
        
        {loadingData ? (
          <div className="p-16 text-center space-y-2 font-mono-code">
            <Loader2 className="w-7 h-7 animate-spin mx-auto text-orange-600" />
            <p className="text-xs text-[var(--text-muted)]">Memuat riwayat pengaduan...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="font-serif-display text-xl text-[var(--text-primary)]">Belum Ada Pengaduan Tercatat</p>
            <p className="text-xs text-[var(--text-muted)] font-mono-code">
              Lingkungan Anda aman. Klik tombol 'Buat Laporan Baru' jika menemukan masalah di wilayah.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-hairline">
            {reports.map((report) => (
              <div key={report.id} className="p-6 space-y-3 hover:bg-[var(--bg-surface)] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(report.status)}
                    {getScoreBadge(report.score)}
                  </div>
                  <span className="text-xs font-mono-code text-[var(--text-muted)]">
                    {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-display text-xl text-[var(--text-primary)] font-bold">
                    {report.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-sans leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {report.aiReason && (
                  <div className="p-3 rounded border border-orange-500/20 bg-orange-50/30 text-xs font-mono-code text-stone-700">
                    <span className="font-bold text-orange-800">Evaluasi AI: </span>
                    <span>{report.aiReason}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs font-mono-code text-[var(--text-muted)]">
                  <div className="flex items-center gap-4">
                    {report.attachment && (
                      <a 
                        href={report.attachment} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-stone-700 hover:underline font-bold"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Lihat Bukti Foto</span>
                      </a>
                    )}
                  </div>

                  {report.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancel(report.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-mono-code font-medium hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Batalkan Laporan Ini</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
