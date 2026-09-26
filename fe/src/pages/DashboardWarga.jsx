import React, { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, Paperclip, Loader2 } from 'lucide-react';

export default function DashboardWarga() {
  const [showForm, setShowForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Warga</h1>
          <p className="text-slate-500 mt-1">Pantau dan kelola laporan pengaduan Anda</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-sm"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Tutup Form' : 'Buat Pengaduan Baru'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Formulir Pengaduan</h2>
          
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-lg p-4 flex gap-3 text-sm text-slate-700">
            <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0" />
            <p>Jelaskan keluhan Anda sedetail mungkin. Sistem AI kami akan otomatis membaca tingkat urgensinya.</p>
          </div>

          {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Judul Keluhan</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                placeholder="Contoh: Lampu jalan mati di Blok B"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Deskripsi Detail</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
                placeholder="Ceritakan kejadiannya..."
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Lampiran Bukti (Maks. 1 Gambar)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile || null);
                  setError('');
                }}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-900 hover:file:bg-slate-200 cursor-pointer"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Mengirim & Menganalisis AI...' : 'Kirim Laporan'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Riwayat Laporan Anda</h3>
          <button onClick={fetchMyComplaints} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Refresh</button>
        </div>
        
        {loadingData ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
             <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
             <p>Memuat laporan...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>Belum ada laporan pengaduan yang Anda buat.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                    <th className="px-6 py-4 font-semibold">Laporan</th>
                    <th className="px-6 py-4 font-semibold text-center">Skor AI</th>
                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 mb-1">{report.title}</div>
                        <div className="text-sm text-slate-500 line-clamp-1 mb-2">{report.description}</div>
                        {report.attachment && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-900 font-medium bg-slate-100 hover:bg-slate-200 transition-colors px-2 py-1 rounded-md">
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>Lihat Lampiran</span>
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center font-bold text-xs rounded-md h-7 min-w-9 px-2 ${getScoreColor(report.score)}`}>
                          {report.score || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(report.status)}
                          {report.status === 'PENDING' && (
                            <button 
                              onClick={() => handleCancel(report.id)}
                              className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
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
            <div className="md:hidden divide-y divide-slate-100">
              {reports.map((report) => (
                <div key={report.id} className="p-5 flex flex-col gap-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-slate-500">
                      {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year:'numeric'})}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(report.status)}
                      {report.status === 'PENDING' && (
                        <button 
                          onClick={() => handleCancel(report.id)}
                          className="text-[10px] text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Batalkan Laporan
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{report.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{report.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                    <div className="flex flex-wrap gap-2">
                      {report.attachment && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          <Paperclip className="w-3.5 h-3.5" /> 1 Gambar
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Prioritas AI:</span>
                      <span className={`inline-flex items-center justify-center font-bold text-xs rounded-md h-6 min-w-8 px-1.5 ${getScoreColor(report.score)}`}>
                        {report.score || '-'}
                      </span>
                    </div>
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
