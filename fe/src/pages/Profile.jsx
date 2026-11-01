import React from 'react';
import { UserCheck, MapPin, Mail, ShieldAlert, Award } from 'lucide-react';

export default function Profile() {
  const userName = localStorage.getItem('name') || 'Warga';
  const userEmail = localStorage.getItem('email') || '-';
  const userRole = (localStorage.getItem('role') || '').toUpperCase();
  const userRt = localStorage.getItem('rt') || '-';
  const userRw = localStorage.getItem('rw') || '-';
  const userKelurahan = localStorage.getItem('kelurahan') || '-';
  const userKecamatan = localStorage.getItem('kecamatan') || '-';
  const userKota = localStorage.getItem('kota') || 'KOTA BOGOR';

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 pb-16">
      
      {/* Title */}
      <div className="space-y-1 border-b border-hairline pb-4">
        <div className="font-mono-code text-xs text-orange-600 font-bold uppercase tracking-wider">
          Administrasi Akun Wilayah
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl text-[var(--text-primary)] font-normal">
          Buku Registrasi Identitas
        </h1>
        <p className="text-xs text-[var(--text-muted)] font-mono-code">
          Data kependudukan dan yurisdiksi pelaporan yang tertaut pada sistem SITARA.
        </p>
      </div>

      {/* Main Ledger Card */}
      <div className="rounded border-2 border-hairline bg-[var(--bg-card)] shadow-md overflow-hidden">
        
        {/* Top Header Strip */}
        <div className="bg-stone-900 text-stone-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="font-mono-code text-xs text-orange-400 font-bold uppercase tracking-wider">
              {userRole === 'RT' ? 'PENGURUS RUKUN TETANGGA' : 'WARGA TERDAFTAR'}
            </div>
            <h2 className="font-serif-display text-3xl font-bold tracking-tight text-white">
              {userName}
            </h2>
            <div className="flex items-center gap-2 text-stone-400 font-mono-code text-xs">
              <Mail className="w-3.5 h-3.5" />
              <span>{userEmail}</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 font-mono-code text-xs font-bold px-3 py-1.5 rounded border border-orange-500/40 bg-orange-500/10 text-orange-300">
            <Award className="w-4 h-4 text-orange-400" />
            <span>TERVERIFIKASI AKTIF</span>
          </div>
        </div>

        {/* Data Wilayah Territory Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="font-mono-code text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Wilayah Yurisdiksi Administrasi:</span>
            </h3>
            <span className="font-mono-code text-[11px] text-[var(--text-muted)]">SP4N Code Verified</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono-code">
            <div className="p-3.5 rounded border border-hairline bg-[var(--bg-surface)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Rukun Tetangga</div>
              <div className="text-base font-bold text-[var(--text-primary)]">RT {userRt}</div>
            </div>

            <div className="p-3.5 rounded border border-hairline bg-[var(--bg-surface)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Rukun Warga</div>
              <div className="text-base font-bold text-[var(--text-primary)]">RW {userRw}</div>
            </div>

            <div className="p-3.5 rounded border border-hairline bg-[var(--bg-surface)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Kelurahan</div>
              <div className="text-sm font-bold text-[var(--text-primary)] truncate">{userKelurahan}</div>
            </div>

            <div className="p-3.5 rounded border border-hairline bg-[var(--bg-surface)] space-y-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Kecamatan</div>
              <div className="text-sm font-bold text-[var(--text-primary)] truncate">{userKecamatan}</div>
            </div>

            <div className="p-3.5 rounded border border-hairline bg-[var(--bg-surface)] space-y-1 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Kota / Kab</div>
              <div className="text-sm font-bold text-[var(--text-primary)] truncate">{userKota}</div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded border border-hairline bg-[var(--bg-surface)] font-mono-code text-xs text-[var(--text-muted)] leading-relaxed space-y-1">
            <div className="font-bold text-[var(--text-primary)]">Perhatian Privasi Wilayah:</div>
            <div>
              Alamat email dan identitas Anda hanya dibagikan kepada pengurus RT setempat saat Anda mengirimkan pengaduan darurat. Seluruh data dijaga kerahasiaannya.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
