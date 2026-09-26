import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Paperclip, Loader2 } from 'lucide-react';

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
        setReports(data.data);
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
        body: formData // No content-type so browser sets multipart/form-data with boundary
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal mengirim laporan');

      // Refresh data
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
    if (!window.confirm("Yakin ingin membatalkan laporan ini?")) return;
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
      case 'PENDING': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white text-slate-700 border border-slate-300 shadow-sm">Pending</span>;
      case 'DIPROSES': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-900 border border-slate-300 shadow-sm">Diproses</span>;
      case 'SELESAI': return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900 text-white shadow-sm">Selesai</span>;
      default: return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-slate-900 text-white shadow-sm';
    if (score >= 50) return 'bg-slate-700 text-white shadow-sm';
    return 'bg-slate-100 text-slate-800 border border-slate-300';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <img src="/assets/warga_penasaran.jpg" alt="Warga" className="w-14 h-14 rounded-full object-cover border-2 border-slate-200" /> 
            Halo, Warga!
          </h1>
          <p className="text-slate-500 font-medium mt-1">Pantau dan kelola laporan pengaduan Anda di sini.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
        >
          {showForm ? <X className="w-5 h-5" /> : <span className="text-xl leading-none">+</span>}
          {showForm ? 'Tutup Form' : 'Buat Laporan Baru'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 md:p-10 rounded-[2rem] border-2 border-slate-100 shadow-xl relative animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">📝 Tulis Laporan</h2>
          
          <div className="mb-8 bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 flex gap-4 text-sm text-blue-900 font-medium items-center">
            <img src="/assets/ai_robot_mini.jpg" alt="AI" className="w-16 h-16 rounded-xl object-cover shadow-sm flex-shrink-0" />
            <p>Jelaskan keluhan Anda sedetail mungkin. <b>Asisten AI kami</b> akan otomatis membaca dan menentukan tingkat urgensinya agar cepat ditangani Pak RT!</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl text-sm font-bold">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Judul Laporan</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-slate-900 transition-all font-medium"
                placeholder="Contoh: Lampu jalan mati di Blok B"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Nomor WhatsApp (Opsional)</label>
                <input 
                  type="tel" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-slate-900 transition-all font-medium"
                  placeholder="Contoh: 081234567890"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">Lokasi Kejadian (Opsional)</label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="w-full bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-colors border-2 border-slate-200 flex items-center justify-center gap-2"
                  >
                    {gettingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : '📍'}
                    {gettingLocation ? 'Mendapatkan...' : 'Bagikan Lokasi Saat Ini'}
                  </button>
                  {locationName && (
                    <span className="text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 line-clamp-2">
                      {locationName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Deskripsi Detail</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-slate-900 transition-all font-medium resize-none"
                placeholder="Ceritakan kejadiannya..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Lampiran Bukti (Opsional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile || null);
                  setError('');
                }}
                className="w-full px-5 py-3 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-slate-900 transition-all file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200 cursor-pointer text-slate-500 font-medium"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-[#FFD700] text-amber-950 px-8 py-3.5 rounded-2xl font-black hover:bg-yellow-400 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitting ? 'Mengirim & Menganalisis...' : 'Kirim Laporan 🚀'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-slate-100 bg-white flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900">Riwayat Laporan Saya</h3>
          <button onClick={fetchMyComplaints} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-4 py-2 rounded-full">Refresh</button>
        </div>
        
        {loadingData ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-500 gap-4">
             <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
             <p className="font-medium">Mencari laporan...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 flex flex-col items-center text-center text-slate-500">
            <img src="/assets/kaca_pembesar.jpg" alt="Kosong" className="w-32 h-32 rounded-3xl object-cover mb-6 shadow-sm opacity-80" />
            <p className="font-medium text-lg">Belum ada laporan pengaduan yang Anda buat.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4 rounded-l-2xl">Tanggal</th>
                    <th className="px-6 py-4">Info Laporan</th>
                    <th className="px-6 py-4 text-center">Skor AI</th>
                    <th className="px-6 py-4 text-right rounded-r-2xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/0 space-y-4">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-6 text-sm font-bold text-slate-600 whitespace-nowrap rounded-l-3xl">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})}
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-black text-slate-900 mb-1 text-lg">{report.title}</div>
                        <div className="text-sm text-slate-500 font-medium line-clamp-1 mb-3">{report.description}</div>
                        {report.attachment && (
                          <div className="flex flex-wrap gap-2">
                            <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1.5 rounded-lg border border-slate-200">
                              <Paperclip className="w-3.5 h-3.5" /> Lihat Lampiran
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className={`inline-flex items-center justify-center font-black text-sm rounded-xl h-10 w-10 ${getScoreColor(report.score)}`}>
                          {report.score || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right rounded-r-3xl">
                        <div className="flex flex-col items-end gap-3">
                          {getStatusBadge(report.status)}
                          {report.status === 'PENDING' && (
                            <button 
                              onClick={() => handleCancel(report.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors bg-red-50 px-3 py-1 rounded-full border border-red-100"
                            >
                              Batalkan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-4 space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm flex flex-col gap-4 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                      {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                    </span>
                    {getStatusBadge(report.status)}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg mb-1">{report.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{report.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center justify-center font-black text-xs rounded-xl h-8 px-3 ${getScoreColor(report.score)}`}>
                        Skor: {report.score || '-'}
                      </div>
                    </div>
                    {report.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancel(report.id)}
                        className="text-[11px] text-red-600 bg-red-50 font-bold px-3 py-1.5 rounded-full border border-red-100"
                      >
                        Batalkan Laporan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
