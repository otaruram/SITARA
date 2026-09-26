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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Pengurus RT</h1>
          <p className="text-slate-500 mt-1">Daftar keluhan telah diurutkan berdasarkan skala prioritas AI.</p>
        </div>
        <button onClick={fetchComplaints} className="text-sm font-medium bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          Refresh Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total Laporan</div>
            <div className="text-3xl font-bold text-slate-900">{totalReports}</div>
          </div>
        </div>
        
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-400">Menunggu Penanganan (Darurat)</div>
            <div className="text-3xl font-bold text-white">{emergencyReports}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Selesai Ditangani</div>
            <div className="text-3xl font-bold text-slate-900">{completedReports}</div>
          </div>
        </div>
      </div>

      {/* Inbox Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Kotak Masuk Pengaduan 
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded-md ml-2 font-medium">Auto-sorted by AI</span>
          </h3>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold w-1/4">Info Laporan</th>
                <th className="px-6 py-4 font-semibold w-1/4">Kategori & Analisis AI</th>
                <th className="px-6 py-4 font-semibold text-center w-32">Prioritas</th>
                <th className="px-6 py-4 font-semibold text-center w-32">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                       <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                       <p>Memuat data dari server...</p>
                    </div>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Tidak ada laporan saat ini.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className={`hover:bg-slate-50 transition-colors ${(report.score || 0) >= 70 && report.status !== 'SELESAI' ? 'bg-red-50/20' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 mb-1">{report.title}</div>
                      <div className="text-sm text-slate-600 mb-2 line-clamp-2">{report.description}</div>
                      <div className="text-xs text-slate-400 font-medium mb-2">Dari: {report.user?.name || 'Warga'} • {new Date(report.createdAt).toLocaleDateString('id-ID')}</div>
                      {report.attachment && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-slate-700 font-medium bg-slate-100 px-2 py-1.5 rounded-md w-fit hover:bg-slate-200 transition-colors">
                            <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">Lihat Bukti Lampiran</span>
                          </a>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900 mb-1">{categorizeProblem(report.score)}</div>
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-100 p-2 rounded-lg">
                        <BrainCircuit className="w-3.5 h-3.5 mt-0.5 text-slate-700 flex-shrink-0" />
                        <span>{report.aiReason || 'Tidak ada analisis'}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className={`inline-flex flex-col items-center justify-center w-12 h-12 rounded-xl font-black text-xl shadow-sm ${getScoreColor(report.score)}`}>
                        {report.score || '-'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                       <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${
                          report.status === 'PENDING' ? 'bg-white border-slate-300 text-slate-700' : 
                          report.status === 'DIPROSES' ? 'bg-slate-100 border-slate-300 text-slate-900' : 
                          'bg-slate-900 border-slate-900 text-white'
                       }`}>
                         {report.status}
                       </span>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col gap-2 justify-end">
                        {report.status === 'PENDING' && (
                          <button 
                            onClick={() => updateStatus(report.id, 'DIPROSES')}
                            className="text-xs font-semibold bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors w-full"
                          >
                            Terima & Proses
                          </button>
                        )}
                        {report.status !== 'SELESAI' && (
                          <button 
                            onClick={() => updateStatus(report.id, 'SELESAI')}
                            className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors shadow-sm w-full"
                          >
                            Tandai Selesai
                          </button>
                        )}
                        {report.status === 'SELESAI' && (
                           <span className="text-xs font-medium text-slate-500">Tidak ada aksi</span>
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
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              <p>Memuat data...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center text-slate-500">Tidak ada laporan saat ini.</div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className={`p-5 flex flex-col gap-3 ${(report.score || 0) >= 70 && report.status !== 'SELESAI' ? 'bg-red-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className={`inline-flex px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                        report.status === 'PENDING' ? 'bg-white border-slate-300 text-slate-700' : 
                        report.status === 'DIPROSES' ? 'bg-slate-100 border-slate-300 text-slate-900' : 
                        'bg-slate-900 border-slate-900 text-white'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className={`inline-flex items-center justify-center rounded-lg font-bold text-sm px-2.5 py-1 ${getScoreColor(report.score)}`}>
                    Score: {report.score || '-'}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{report.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-2">{report.description}</p>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">
                    Dari: {report.user?.name || 'Warga'} • {new Date(report.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                  <BrainCircuit className="w-4 h-4 text-slate-700 flex-shrink-0" />
                  <span className="leading-relaxed">{report.aiReason || 'Tidak ada analisis'}</span>
                </div>

                {report.attachment && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    <a href={report.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      <Paperclip className="w-3 h-3" /> 1 Gambar
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
                  {report.status === 'PENDING' && (
                    <button 
                      onClick={() => updateStatus(report.id, 'DIPROSES')}
                      className="text-xs font-semibold bg-white border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition-colors w-full"
                    >
                      Terima & Proses
                    </button>
                  )}
                  {report.status !== 'SELESAI' && (
                    <button 
                      onClick={() => updateStatus(report.id, 'SELESAI')}
                      className="col-span-2 text-xs font-semibold bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors w-full"
                    >
                      Tandai Selesai
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
