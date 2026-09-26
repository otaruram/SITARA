import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ListTodo, BrainCircuit, Paperclip, Loader2 } from 'lucide-react';

export default function DashboardRT() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/complaints`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setReports(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Optimistic UI update
        setReports(reports.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (err) {
      console.error("Gagal update status", err);
    }
  };

  const totalReports = reports.length;
  const emergencyReports = reports.filter(r => (r.score || 0) >= 70 && r.status !== 'SELESAI').length;
  const completedReports = reports.filter(r => r.status === 'SELESAI').length;

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-slate-900 text-white';
    if (score >= 40) return 'bg-slate-600 text-white';
    return 'bg-slate-100 text-slate-800 border border-slate-300';
  };

  const categorizeProblem = (score) => {
    if (!score) return 'Uncategorized';
    if (score >= 70) return 'Darurat / Kritis';
    if (score >= 40) return 'Menengah / Gangguan';
    return 'Ringan / Info';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <img src="/assets/pak_rt_modern.jpg" alt="RT" className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 shadow-sm" /> 
            Dashboard Pak RT
          </h1>
          <p className="text-slate-500 font-medium mt-1">Daftar laporan warga telah diurutkan berdasarkan skala prioritas AI.</p>
        </div>
        <button onClick={fetchComplaints} className="text-sm font-bold bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-full hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95">
          Refresh Data 🔄
        </button>
      </div>

      {/* Stats - Redesigned to Bubble Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-1">Total Laporan Masuk</div>
            <div className="text-4xl font-black text-slate-900">{totalReports}</div>
          </div>
          <div className="group-hover:scale-110 transition-transform">
            <img src="/assets/warga_laporan.jpg" alt="Laporan" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
          </div>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[2rem] border-4 border-slate-800 shadow-xl flex items-center justify-between group hover:-translate-y-1 transition-all">
          <div>
            <div className="text-sm font-bold text-slate-400 mb-1">Darurat & Menunggu</div>
            <div className="text-4xl font-black text-white">{emergencyReports}</div>
          </div>
          <div className="group-hover:scale-110 transition-transform">
            <img src="/assets/skor_prioritas.jpg" alt="Darurat" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-slate-700" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-1">Selesai Ditangani</div>
            <div className="text-4xl font-black text-slate-900">{completedReports}</div>
          </div>
          <div className="group-hover:scale-110 transition-transform">
            <img src="/assets/pak_rt_jempol.jpg" alt="Selesai" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
          </div>
        </div>
      </div>

      {/* Inbox Table */}
      <div className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b-2 border-slate-100 bg-white flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            Kotak Masuk 
            <span className="text-xs bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1 rounded-full font-bold">✨ Auto-sorted by AI</span>
          </h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto p-4">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 rounded-l-2xl w-1/4">Info Laporan</th>
                <th className="px-6 py-4 w-1/3">🤖 Analisis AI</th>
                <th className="px-6 py-4 text-center w-24">Skor</th>
                <th className="px-6 py-4 text-center w-32">Status</th>
                <th className="px-6 py-4 text-right rounded-r-2xl">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/0 space-y-4">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-4">
                       <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
                       <p className="font-bold">Menganalisis dan Memuat Data...</p>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-500">
                    <div className="flex justify-center mb-6">
                       <img src="/assets/kaca_pembesar.jpg" alt="Kosong" className="w-32 h-32 rounded-3xl object-cover shadow-sm opacity-80" />
                    </div>
                    <p className="font-bold text-lg">Hore! Lingkungan RT aman tentram. Tidak ada laporan.</p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className={`hover:bg-slate-50 transition-colors ${(report.score || 0) >= 70 && report.status !== 'SELESAI' ? 'bg-red-50/40 border border-red-100 rounded-3xl' : ''}`}>
                    <td className="px-6 py-6 rounded-l-3xl">
                      <div className="font-black text-slate-900 mb-1 text-lg leading-tight">{report.title}</div>
                      <div className="text-sm text-slate-500 font-medium mb-3 line-clamp-2">{report.description}</div>
                      <div className="text-xs text-slate-400 font-bold mb-2">
                        🧑🏽‍🦱 {report.user?.name || 'Warga'} • {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {report.whatsapp && (
                           <a href={`https://wa.me/${report.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded-lg w-fit hover:bg-green-100 transition-colors border border-green-200">
                             💬 WA
                           </a>
                        )}
                        {report.latitude && report.longitude && (
                           <a href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg w-fit hover:bg-blue-100 transition-colors border border-blue-200">
                             📍 Peta
                           </a>
                        )}
                        {report.attachment && (
                          <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1.5 rounded-lg w-fit hover:bg-slate-200 transition-colors border border-slate-200">
                            <Paperclip className="w-3.5 h-3.5" /> Gambar
                          </a>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-6">
                      <div className="text-sm font-black text-slate-900 mb-2">{categorizeProblem(report.score)}</div>
                      <div className="flex items-start gap-2 text-sm text-slate-700 bg-blue-50 border border-blue-100 p-3 rounded-xl font-medium">
                        <span className="text-lg leading-none">🧠</span>
                        <span className="leading-snug">{report.aiReason || 'Tidak ada analisis AI'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-black text-xl shadow-md ${getScoreColor(report.score)}`}>
                        {report.score || '-'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 text-center">
                       <span className={`inline-flex px-3 py-1.5 text-[11px] uppercase font-black tracking-wider rounded-full border-2 ${
                          report.status === 'PENDING' ? 'bg-white border-slate-200 text-slate-500' : 
                          report.status === 'DIPROSES' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' : 
                          'bg-slate-900 border-slate-900 text-white'
                       }`}>
                         {report.status}
                       </span>
                    </td>
                    
                    <td className="px-6 py-6 text-right rounded-r-3xl">
                      <div className="flex flex-col gap-2 justify-end w-32 ml-auto">
                        {report.status === 'PENDING' && (
                          <button 
                            onClick={() => updateStatus(report.id, 'DIPROSES')}
                            className="text-xs font-bold bg-white border-2 border-slate-200 text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                          >
                            Proses ⚡
                          </button>
                        )}
                        {report.status !== 'SELESAI' && (
                          <button 
                            onClick={() => updateStatus(report.id, 'SELESAI')}
                            className="text-xs font-bold bg-slate-900 text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                          >
                            Selesai ✅
                          </button>
                        )}
                        {report.status === 'SELESAI' && (
                           <span className="text-xs font-bold text-slate-400 bg-slate-50 py-2 rounded-xl border-2 border-slate-100 text-center">Tuntas</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden p-4 space-y-4">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
              <p className="font-bold">Memuat data...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center text-slate-500">
              <img src="/assets/kaca_pembesar.jpg" alt="Kosong" className="w-24 h-24 rounded-3xl object-cover mb-4 shadow-sm opacity-80" />
              <p className="font-bold">Tidak ada laporan.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className={`p-6 border-2 rounded-3xl shadow-sm flex flex-col gap-4 relative ${
                  (report.score || 0) >= 70 && report.status !== 'SELESAI' ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'
                }`}>
                
                <div className="flex justify-between items-start">
                  <div className={`inline-flex items-center justify-center font-black text-sm rounded-xl h-8 px-3 shadow-sm ${getScoreColor(report.score)}`}>
                    Skor: {report.score || '-'}
                  </div>
                  <span className={`inline-flex px-2.5 py-1 text-[10px] uppercase font-black tracking-wider rounded-full border-2 ${
                      report.status === 'PENDING' ? 'bg-white border-slate-200 text-slate-500' : 
                      report.status === 'DIPROSES' ? 'bg-yellow-100 border-yellow-200 text-yellow-800' : 
                      'bg-slate-900 border-slate-900 text-white'
                  }`}>
                    {report.status}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-black text-slate-900 text-lg mb-1">{report.title}</h4>
                  <p className="text-sm text-slate-600 font-medium line-clamp-2">{report.description}</p>
                  <div className="text-xs text-slate-400 font-bold mt-2">
                    🧑🏽‍🦱 {report.user?.name || 'Warga'} • {new Date(report.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-700 bg-blue-50 border border-blue-100 p-3 rounded-xl font-medium">
                  <span className="text-base leading-none">🧠</span>
                  <span className="leading-snug">{report.aiReason || 'Tidak ada analisis AI'}</span>
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                  {report.whatsapp && (
                     <a href={`https://wa.me/${report.whatsapp.replace(/[^0-9]/g, '').replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                       💬 WA Warga
                     </a>
                  )}
                  {report.latitude && report.longitude && (
                     <a href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                       📍 Buka Lokasi
                     </a>
                  )}
                  {report.attachment && (
                    <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-700 font-bold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">
                      <Paperclip className="w-3.5 h-3.5" /> Lihat Gambar
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2 pt-4 border-t-2 border-slate-100/50">
                  {report.status === 'PENDING' && (
                    <button 
                      onClick={() => updateStatus(report.id, 'DIPROSES')}
                      className="text-xs font-bold bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Proses ⚡
                    </button>
                  )}
                  {report.status !== 'SELESAI' && (
                    <button 
                      onClick={() => updateStatus(report.id, 'SELESAI')}
                      className="col-span-2 text-xs font-bold bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      Tandai Selesai ✅
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
