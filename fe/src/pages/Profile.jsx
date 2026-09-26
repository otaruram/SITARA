import React from 'react';
import { UserCircle, MapPin, Mail, ShieldUser, User } from 'lucide-react';

export default function Profile() {
  const userName = localStorage.getItem('name') || '-';
  const userEmail = localStorage.getItem('email') || '-';
  const userRole = (localStorage.getItem('role') || '').toUpperCase();
  const userRt = localStorage.getItem('rt') || '-';
  const userRw = localStorage.getItem('rw') || '-';
  const userKelurahan = localStorage.getItem('kelurahan') || '-';
  const userKecamatan = localStorage.getItem('kecamatan') || '-';

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
        <p className="text-slate-500 mt-1">Informasi dasar akun Anda</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-slate-900 w-full relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md">
              <UserCircle className="w-20 h-20 text-slate-300" />
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{userName}</h2>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <Mail className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
            </div>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                userRole === 'RT' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {userRole === 'RT' ? <ShieldUser className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {userRole}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400" />
              Data Wilayah
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium mb-1">Nomor RT</div>
                <div className="font-bold text-slate-900">{userRt}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium mb-1">Nomor RW</div>
                <div className="font-bold text-slate-900">{userRw}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium mb-1">Kelurahan</div>
                <div className="font-bold text-slate-900">{userKelurahan}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium mb-1">Kecamatan</div>
                <div className="font-bold text-slate-900">{userKecamatan}</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
