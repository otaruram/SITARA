import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, CheckCircle2, Clock, FileSpreadsheet, MapPin, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="space-y-24 sm:space-y-36 pb-20">
      
      {/* ================= HERO SECTION ================= */}
      <section className="pt-6 sm:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-hairline text-xs font-mono-code text-[var(--text-muted)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-600 inline-block"></span>
            <span className="text-[var(--text-primary)] font-bold">sitara.biz.id</span>
            <span>&bull;</span>
            <span className="text-orange-600 font-semibold">Protokol Tanggap Wilayah RT</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] text-[var(--text-primary)] tracking-tight">
            Kelola pengaduan warga secara <span className="italic font-normal text-orange-600">terbuka</span>, adil, dan tanggap darurat.
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed max-w-xl">
            SITARA menggantikan obrolan grup WhatsApp warga yang berantakan dengan antrean cerdas berbasis AI. 
            Menganalisis ancaman secara kontekstual, memberi skor prioritas 0–100, dan membantu pengurus RT bertindak cepat pada masalah darurat.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link 
              to="/auth" 
              className="inline-flex items-center justify-center gap-2.5 bg-stone-900 text-stone-50 hover:bg-orange-700 font-mono-code text-sm font-semibold px-7 py-3.5 rounded transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              <span>Akses Portal Laporan</span>
              <ArrowRight className="w-4 h-4 text-orange-400" />
            </Link>

            <a 
              href="#triage-specimen" 
              className="inline-flex items-center justify-center gap-2 border border-hairline bg-[var(--bg-card)] text-[var(--text-primary)] hover:border-stone-400 font-mono-code text-sm font-medium px-6 py-3.5 rounded transition-colors"
            >
              <span>Lihat Spesimen Skoring</span>
              <span className="text-xs text-[var(--text-muted)]">↓</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-hairline font-mono-code text-xs text-[var(--text-muted)]">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif-display">&lt; 3 Detik</div>
              <div>Analisis NLP AI</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif-display">Skor 0–100</div>
              <div>Matriks Ancaman</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-serif-display">100% Bebas</div>
              <div>Diskriminasi Pelapor</div>
            </div>
          </div>
        </div>

        {/* Right Architectural Specimen Card (Simulating Live Emergency Triage) */}
        <div id="triage-specimen" class="lg:col-span-5">
          <div className="rounded-lg border-2 border-hairline bg-[var(--bg-card)] p-6 shadow-xl space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-hairline pb-3 text-xs font-mono-code">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  PRIORITAS DARURAT
                </span>
              </div>
              <span className="text-[var(--text-muted)]">LOG #2026-10-88</span>
            </div>

            {/* Specimen Case 1: High Priority */}
            <div className="space-y-3 p-4 rounded border border-red-200 bg-red-50/40">
              <div className="flex justify-between items-start gap-3">
                <h4 className="font-bold text-sm text-stone-900 leading-snug">
                  Kabel Listrik Tiang Utama Terputus & Mengeluarkan Percikan Api
                </h4>
                <div className="shrink-0 text-center font-mono-code bg-red-600 text-white px-2.5 py-1 rounded font-bold text-xs shadow-sm">
                  SKOR 94
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-sans">
                "Terjadi di jalan utama gang 3 samping pos kamling RT 05. Mengancam keselamatan anak-anak sekolah yang melintas."
              </p>

              <div className="pt-2 border-t border-red-200/80 flex items-center justify-between text-[11px] font-mono-code text-stone-600">
                <span>Kategori: Infrastruktur Kritis</span>
                <span className="font-semibold text-red-700">Tindakan: Dispatch PLN / RW</span>
              </div>
            </div>

            {/* Specimen Case 2: Standard Minor Case */}
            <div className="space-y-3 p-4 rounded border border-hairline bg-[var(--bg-surface)]">
              <div className="flex justify-between items-start gap-3">
                <h4 className="font-medium text-xs text-[var(--text-primary)]">
                  Jadwal Kerja Bakti Pembersihan Saluran Selokan Depan Musholla
                </h4>
                <div className="shrink-0 text-center font-mono-code bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-semibold text-[11px]">
                  SKOR 32
                </div>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                "Masuk kategori pemeliharaan berkala lingkungan. Diteruskan ke agenda bulanan."
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono-code text-[var(--text-muted)] pt-2 border-t border-hairline">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AI Reasoning Tervalidasi
              </span>
              <span>Audit Log Terbuka</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3 PILAR KEUNGGULAN (MATERIALITY CRAFT) ================= */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline pb-4">
          <div>
            <div className="font-mono-code text-xs text-orange-600 font-bold uppercase tracking-wider">
              Rekayasa Sistem
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[var(--text-primary)] mt-1">
              Dirancang untuk ketertiban wilayah nyata.
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono-code text-[var(--text-muted)] max-w-md">
            Meninggalkan tampilan generik yang membingungkan. Setiap elemen dirancang untuk kejelasan informasi darurat dan kemudahan akses seluruh warga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pilar 1 */}
          <div className="p-6 rounded border border-hairline bg-[var(--bg-card)] space-y-4 hover:border-orange-500/50 transition-colors">
            <div className="w-10 h-10 rounded border border-hairline bg-[var(--bg-surface)] flex items-center justify-center font-mono-code font-bold text-sm text-orange-600">
              01
            </div>
            <h3 className="font-serif-display text-2xl text-[var(--text-primary)] font-normal">
              Zero-Shot NLP Triage
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Memanfaatkan Large Language Model untuk mengekstrak semantik dan konteks ancaman secara objektif, bukan sekadar mencocokkan kata kunci (*keyword matching*).
            </p>
            <div className="pt-2 font-mono-code text-[11px] text-orange-600 font-medium flex items-center gap-1">
              <span>Deteksi ancaman jiwa instan</span>
              <span>→</span>
            </div>
          </div>

          {/* Pilar 2 */}
          <div className="p-6 rounded border border-hairline bg-[var(--bg-card)] space-y-4 hover:border-orange-500/50 transition-colors">
            <div className="w-10 h-10 rounded border border-hairline bg-[var(--bg-surface)] flex items-center justify-center font-mono-code font-bold text-sm text-orange-600">
              02
            </div>
            <h3 className="font-serif-display text-2xl text-[var(--text-primary)] font-normal">
              Skor Prioritas Transparan (0–100)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Setiap skor dilengkapi alasan deduktif (*Explainable AI*). Warga dapat memantau kapan laporan mereka dijadwalkan tanpa perlu curiga atau berasumsi.
            </p>
            <div className="pt-2 font-mono-code text-[11px] text-orange-600 font-medium flex items-center gap-1">
              <span>Keadilan penanganan laporan</span>
              <span>→</span>
            </div>
          </div>

          {/* Pilar 3 */}
          <div className="p-6 rounded border border-hairline bg-[var(--bg-card)] space-y-4 hover:border-orange-500/50 transition-colors">
            <div className="w-10 h-10 rounded border border-hairline bg-[var(--bg-surface)] flex items-center justify-center font-mono-code font-bold text-sm text-orange-600">
              03
            </div>
            <h3 className="font-serif-display text-2xl text-[var(--text-primary)] font-normal">
              Ekspor Arsip Resmi (.xlsx)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Pengurus RT dapat mengunduh seluruh rekap keluhan bulanan lengkap dengan tanggal, status, kategori, dan identitas untuk musyawarah RW atau laporan kelurahan.
            </p>
            <div className="pt-2 font-mono-code text-[11px] text-orange-600 font-medium flex items-center gap-1">
              <span>Standar format SP4N siap pakai</span>
              <span>→</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= ALUR OPERASIONAL PROTOKOL ================= */}
      <section className="rounded-xl border border-hairline bg-[var(--bg-card)] p-8 sm:p-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="font-mono-code text-xs text-orange-600 font-bold uppercase tracking-wider">
            Protokol 3 Langkah
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[var(--text-primary)]">
            Alur Penanganan Laporan Wilayah
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Dibuat sesederhana mungkin agar dapat digunakan oleh warga lanjut usia maupun anak muda di lingkungan RT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="space-y-4 relative">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-stone-900 text-white font-mono-code font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide font-mono-code">
                Warga Mengirim Bukti
              </h4>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Warga menuliskan deskripsi singkat kejadian, melampirkan foto kondisi lapangan, dan membagikan lokasi GPS akurat hanya dengan satu ketukan.
            </p>
            <div className="p-3 rounded border border-hairline bg-[var(--bg-surface)] font-mono-code text-[11px] text-[var(--text-muted)]">
              Input: Foto + Teks + Geotag
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-4 relative">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-orange-700 text-white font-mono-code font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide font-mono-code">
                AI Menilai & Mengurutkan
              </h4>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Model Sumopod AI mengevaluasi tingkat bahaya dan memetakan skor prioritas. Sistem Redis mencegah latensi jika terdapat laporan berulang.
            </p>
            <div className="p-3 rounded border border-hairline bg-[var(--bg-surface)] font-mono-code text-[11px] text-[var(--text-muted)]">
              Output: Skor 0–100 + Kategori + Reason
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-4 relative">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-emerald-700 text-white font-mono-code font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-sm text-[var(--text-primary)] uppercase tracking-wide font-mono-code">
                RT Mengeksekusi Tindakan
              </h4>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Pengurus RT memeriksa laporan paling darurat di urutan teratas, menghubungi pelapor lewat WhatsApp langsung, dan memperbarui status hingga selesai.
            </p>
            <div className="p-3 rounded border border-hairline bg-[var(--bg-surface)] font-mono-code text-[11px] text-[var(--text-muted)]">
              Status: PENDING → PROSES → SELESAI
            </div>
          </div>

        </div>
      </section>

      {/* ================= MODEL KEBERLANJUTAN / PRICING ================= */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="font-mono-code text-xs text-orange-600 font-bold uppercase tracking-wider">
            Model Biaya Wilayah
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[var(--text-primary)]">
            Transparan untuk Warga. Terjangkau untuk RT.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            Aplikasi selalu gratis tanpa biaya untuk warga pelapor. Paket keanggotaan RT mendanai komputasi AI server dan penyimpanan berkas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Paket Komunitas RT (Free) */}
          <div className="p-8 rounded-xl border border-hairline bg-[var(--bg-card)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline font-mono-code">
                <span className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)]">Paket Komunitas</span>
                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded">RT Rintisan</span>
              </div>
              
              <div>
                <span className="font-serif-display text-4xl font-bold text-[var(--text-primary)]">Rp 0</span>
                <span className="font-mono-code text-xs text-[var(--text-muted)]"> / selamanya</span>
              </div>

              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Pilihan tepat untuk lingkungan RT kecil dengan frekuensi pelaporan warga standar.
              </p>

              <ul className="space-y-3 text-xs text-[var(--text-primary)] font-mono-code pt-4 border-t border-hairline">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Warga melapor tanpa batas jumlah akun</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kapasitas hingga 20 laporan per bulan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dashboard RT & Rekap data standar</span>
                </li>
              </ul>
            </div>

            <Link 
              to="/auth" 
              className="w-full text-center py-3 rounded border border-hairline bg-[var(--bg-surface)] hover:bg-stone-200 text-[var(--text-primary)] font-mono-code text-xs font-bold transition-colors block"
            >
              Mulai Gunakan Gratis
            </Link>
          </div>

          {/* Paket RT Mandiri & Elite */}
          <div className="p-8 rounded-xl border-2 border-stone-800 bg-stone-900 text-stone-100 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex justify-between items-baseline font-mono-code">
                <span className="text-xs uppercase font-bold tracking-wider text-orange-400">Paket RT Elite</span>
                <span className="text-[11px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded font-bold">
                  REKOMENDASI WILAYAH
                </span>
              </div>
              
              <div>
                <span className="font-serif-display text-4xl font-bold text-white">Rp 49.000</span>
                <span className="font-mono-code text-xs text-stone-400"> / bulan</span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                Untuk perumahan cluster, komplek padat, atau wilayah aktif yang memerlukan penanganan darurat instan.
              </p>

              <ul className="space-y-3 text-xs text-stone-200 font-mono-code pt-4 border-t border-stone-800">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prioritas Analisis AI Sumopod tanpa batasan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Penyimpanan foto resolusi tinggi tak terbatas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ekspor format Excel (.xlsx) dengan metadata lengkap</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Notifikasi prioritas untuk situasi bahaya</span>
                </li>
              </ul>
            </div>

            <Link 
              to="/auth" 
              className="w-full text-center py-3 rounded bg-orange-600 hover:bg-orange-500 text-white font-mono-code text-xs font-bold transition-colors shadow-sm block"
            >
              Daftarkan Wilayah RT Anda
            </Link>
          </div>

        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="text-center py-12 px-6 rounded-xl border border-hairline bg-[var(--bg-card)] space-y-6 max-w-4xl mx-auto">
        <h2 className="font-serif-display text-3xl sm:text-5xl text-[var(--text-primary)]">
          Wujudkan lingkungan RT yang tenang dan tertib.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Masuk menggunakan akun Google Anda dan mulai laporkan atau kelola keluhan lingkungan dalam hitungan detik.
        </p>
        <div>
          <Link 
            to="/auth" 
            className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 hover:bg-orange-700 font-mono-code text-sm font-semibold px-8 py-3.5 rounded transition-colors"
          >
            <span>Masuk ke SITARA Sekarang</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </Link>
        </div>
      </section>

    </div>
  );
}
