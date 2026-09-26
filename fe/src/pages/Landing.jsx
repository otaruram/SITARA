import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BrainCircuit, Activity, ArrowRight, Zap, CheckCircle2, X } from 'lucide-react';

export default function Landing() {
  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-4 border border-slate-200">
          <Zap className="w-4 h-4" />
          <span>Sistem Cerdas Bertenaga AI</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Pengelolaan Pengaduan RT, <br className="hidden md:block" /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
            Lebih Cepat & Tepat Sasaran
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          RT-Prioritas menggunakan kecerdasan buatan (NLP) untuk menganalisis dan memberikan skor prioritas (1-100) pada setiap laporan warga, memastikan masalah darurat ditangani lebih dulu.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link 
            to="/auth" 
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            Mulai Sekarang <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/auth" 
            className="bg-white text-slate-900 border border-slate-300 px-8 py-3.5 rounded-lg font-medium hover:bg-slate-50 transition-all w-full sm:w-auto text-center"
          >
            Masuk
          </Link>
        </div>
      </section>

      {/* Fitur & Teknologi */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
            <BrainCircuit className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Analisis AI (NLP)</h3>
          <p className="text-slate-600 leading-relaxed">
            Setiap laporan diproses oleh sistem Natural Language Processing untuk memahami konteks dan urgensi masalah secara otomatis.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
            <Activity className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Skor Prioritas 1-100</h3>
          <p className="text-slate-600 leading-relaxed">
            Sistem memberikan skor objektif. Laporan dengan skor mendekati 100 menandakan keadaan darurat yang butuh penanganan instan.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6 text-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Transparan & Tertib</h3>
          <p className="text-slate-600 leading-relaxed">
            Warga dapat memantau status laporan, sementara Pengurus RT mendapatkan daftar prioritas yang terstruktur rapi.
          </p>
        </div>
      </section>

      {/* Alur Kerja */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">3 Langkah Mudah</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Sistem yang dirancang agar setiap lapisan masyarakat dapat menggunakannya tanpa kesulitan.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">1</div>
            <h4 className="text-lg font-bold text-slate-900">Warga Lapor</h4>
            <p className="text-slate-600 text-sm">Warga mengirimkan keluhan melalui form sederhana dengan deskripsi kejadian.</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">2</div>
            <h4 className="text-lg font-bold text-slate-900">AI Analisis & Skor</h4>
            <p className="text-slate-600 text-sm">Sistem langsung membaca teks keluhan, menilai urgensi, dan memberi skor prioritas.</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">3</div>
            <h4 className="text-lg font-bold text-slate-900">RT Tindak Lanjut</h4>
            <p className="text-slate-600 text-sm">Pengurus RT membuka dashboard yang sudah terurut, lalu menangani masalah kritis lebih dulu.</p>
          </div>
        </div>
      </section>

      {/* Pricing / Info */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Investasi Kenyamanan Warga</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Sistem pengaduan berbasis AI khusus untuk Rukun Tetangga. Warga selalu gratis!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Paket Komunitas</h3>
            <p className="text-slate-500 text-sm mb-6">Untuk wilayah RT skala kecil</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-slate-900">Gratis</span>
              <span className="text-slate-500 font-medium text-sm"> / selamanya</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> Warga melaporkan tanpa batas
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0" /> Maksimal 20 laporan/bulan masuk ke sistem
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <X className="w-5 h-5 text-slate-300 shrink-0" /> Tanpa Analisis Prioritas AI
              </li>
            </ul>
            <Link to="/auth" className="block w-full py-3 px-4 bg-white border border-slate-300 text-slate-900 font-semibold rounded-xl text-center hover:bg-slate-50 transition-colors">
              Mulai Gratis
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col relative shadow-xl transform md:-translate-y-4">
            <div className="absolute top-0 right-6 transform -translate-y-1/2">
              <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Rekomendasi
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Paket RT Elite</h3>
            <p className="text-slate-400 text-sm mb-6">Kekuatan AI penuh untuk wilayah yang tertib</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">Rp 49.000</span>
              <span className="text-slate-400 font-medium text-sm"> / bulan</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Warga melaporkan tanpa batas
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Kapasitas laporan tak terbatas
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> Analisis AI Cerdas & Sorting Prioritas
              </li>
            </ul>
            <Link to="/auth" className="block w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-xl text-center hover:bg-slate-100 transition-colors">
              Upgrade ke Elite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
