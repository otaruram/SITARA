import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BrainCircuit, Activity, ArrowRight, Zap, CheckCircle2, X } from 'lucide-react';

export default function Landing() {
  return (
    <div className="space-y-32 pb-16 bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-32 pb-12 max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-center lg:text-left z-10">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Kelola Pengaduan Warga <br className="hidden lg:block" /> 
            <span className="text-slate-500">Secara Pintar,</span> <br className="hidden lg:block" />
            <span className="text-slate-500">Terbuka & Berkeadilan</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            RT-Prioritas menggunakan kecerdasan buatan untuk menganalisis laporan warga secara instan. Membantu Pak RT fokus pada hal yang paling darurat.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
            <Link 
              to="/auth" 
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto justify-center"
            >
              Mulai Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Illustration (Simulated with Emojis & Clean CSS shapes) */}
        <div className="relative w-full h-[400px] flex items-center justify-center lg:justify-end">
          <div className="absolute w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-50 top-10 right-10"></div>
          <div className="absolute w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 bottom-0 left-10"></div>
          
          <div className="relative z-10 animate-bounce-slow" style={{ animationDuration: '4s' }}>
             <div className="drop-shadow-2xl relative">
                <img src="/assets/hero_gabungan.jpg" alt="Ilustrasi SITARA" className="w-[320px] h-[320px] lg:w-[400px] lg:h-[400px] rounded-[3rem] object-cover border-4 border-white shadow-2xl" />
                
                {/* Floating Badges */}
                <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 absolute top-8 -right-6 rotate-6 animate-pulse">
                  <div className="text-lg font-black text-slate-800">⚡ Prioritas Cepat</div>
                </div>
                
                <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 absolute bottom-12 -left-8 -rotate-3 hover:scale-105 transition-transform">
                  <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-xs">Baru</span> 
                    Lampu Jalan Mati 💡
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
          <div className="mb-6 transform group-hover:scale-110 transition-transform">
            <img src="/assets/ai_robot_mini.jpg" alt="AI Robot" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-3">Analisis AI (NLP)</h3>
          <p className="text-slate-600 font-medium leading-relaxed">
            Sistem kami membaca konteks laporan secara otomatis seperti asisten manusia yang super pintar.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
          <div className="mb-6 transform group-hover:scale-110 transition-transform">
             <img src="/assets/skor_prioritas.jpg" alt="Skor" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-3">Skor Prioritas 1-100</h3>
          <p className="text-slate-600 font-medium leading-relaxed">
            Tidak ada lagi laporan darurat yang tertumpuk. Sistem memberi skor 100 untuk hal yang mengancam nyawa.
          </p>
        </div>
        <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
          <div className="mb-6 transform group-hover:scale-110 transition-transform">
             <img src="/assets/kaca_pembesar.jpg" alt="Transparan" className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-3">Transparan & Tertib</h3>
          <p className="text-slate-600 font-medium leading-relaxed">
            Warga tenang karena tahu status laporannya, Pak RT pun kerja lebih fokus dan terarah.
          </p>
        </div>
      </section>

      {/* 3 Langkah Mudah - Horizontal Timeline */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">3 Langkah Mudah</h2>
            <p className="text-lg text-slate-600 font-medium">Desain ramah warga, siapapun bisa pakai.</p>
          </div>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-slate-200 rounded-full z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-[280px]">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-900 flex items-center justify-center text-5xl shadow-xl mb-6 overflow-hidden">
                <img src="/assets/warga_laporan.jpg" alt="Warga Lapor" className="w-full h-full object-cover" />
              </div>
              <div className="bg-slate-900 text-white w-8 h-8 rounded-full font-bold flex items-center justify-center -mt-10 mb-4 border-4 border-slate-50 relative z-20">1</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Warga Lapor</h4>
              <p className="text-slate-600 font-medium text-sm">Kirim foto dan deskripsi singkat kejadian di lingkungan.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-[280px]">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center text-5xl shadow-lg mb-6 overflow-hidden">
                <img src="/assets/ai_robot_mini.jpg" alt="AI Menilai" className="w-full h-full object-cover" />
              </div>
              <div className="bg-slate-300 text-slate-800 w-8 h-8 rounded-full font-bold flex items-center justify-center -mt-10 mb-4 border-4 border-slate-50 relative z-20">2</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">AI Menilai</h4>
              <p className="text-slate-600 font-medium text-sm">Sistem membaca tingkat bahaya dan memberikan skor prioritas instan.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-[280px]">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-amber-400 flex items-center justify-center text-5xl shadow-xl mb-6 overflow-hidden">
                <img src="/assets/pak_rt_jempol.jpg" alt="RT Bertindak" className="w-full h-full object-cover" />
              </div>
              <div className="bg-amber-400 text-amber-950 w-8 h-8 rounded-full font-bold flex items-center justify-center -mt-10 mb-4 border-4 border-slate-50 relative z-20">3</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">RT Bertindak</h4>
              <p className="text-slate-600 font-medium text-sm">RT membuka daftar dan menindaklanjuti laporan paling darurat lebih dulu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Pricing</h2>
          <p className="text-lg text-slate-600 font-medium">
            Gratis untuk warga. Terjangkau untuk kemajuan RT.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Paket Komunitas (White) */}
          <div className="bg-white rounded-[2rem] p-10 border-2 border-slate-100 shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Paket Komunitas</h3>
            <p className="text-slate-500 font-medium mb-8">Pilihan pas untuk RT berskala kecil.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-slate-900">Gratis</span>
              <span className="text-slate-500 font-medium"> / selamanya</span>
            </div>
            <ul className="space-y-5 mb-10">
              <li className="flex items-center gap-4 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-slate-300" /> Warga lapor tanpa batas
              </li>
              <li className="flex items-center gap-4 text-slate-700 font-medium">
                <CheckCircle2 className="w-6 h-6 text-slate-300" /> 20 Laporan/bulan masuk ke sistem
              </li>
              <li className="flex items-center gap-4 text-slate-400 font-medium">
                <X className="w-6 h-6 text-slate-200" /> Tanpa Analisis Skor AI
              </li>
            </ul>
            <Link to="/auth" className="block w-full py-4 px-6 bg-slate-100 text-slate-900 font-bold rounded-2xl text-center hover:bg-slate-200 transition-colors">
              Mulai Gratis
            </Link>
          </div>

          {/* Paket RT Elite (Dark Charcoal with Gold) */}
          <div className="bg-slate-900 rounded-[2.5rem] p-10 border-4 border-slate-800 shadow-2xl relative transform md:-translate-y-4">
            <div className="absolute -top-5 right-10">
              <span className="bg-[#FFD700] text-amber-950 text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg border-2 border-[#FFD700]">
                Rekomendasi
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Paket RT Elite</h3>
            <p className="text-slate-400 font-medium mb-8">Kekuatan AI penuh untuk wilayah super tertib.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">Rp 49K</span>
              <span className="text-slate-400 font-medium"> / bulan</span>
            </div>
            <ul className="space-y-5 mb-10">
              <li className="flex items-center gap-4 text-slate-200 font-medium">
                <CheckCircle2 className="w-6 h-6 text-[#FFD700]" /> Warga lapor tanpa batas
              </li>
              <li className="flex items-center gap-4 text-slate-200 font-medium">
                <CheckCircle2 className="w-6 h-6 text-[#FFD700]" /> Kapasitas laporan tak terbatas
              </li>
              <li className="flex items-center gap-4 text-slate-200 font-medium">
                <CheckCircle2 className="w-6 h-6 text-[#FFD700]" /> Analisis AI Cerdas & Sorting Prioritas
              </li>
            </ul>
            <Link to="/auth" className="block w-full py-4 px-6 bg-[#FFD700] text-amber-950 font-black rounded-2xl text-center hover:bg-yellow-400 transition-colors shadow-lg">
              Upgrade ke Elite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
