# SITARA (Sistem Tanggap Darurat & Laporan Warga)

Sitara adalah sebuah platform berbasis web modern yang dirancang untuk mempermudah komunikasi dan pelaporan masalah antara warga dengan pengurus RT (Rukun Tetangga). Dengan mengadopsi teknologi AI (Artificial Intelligence) dari Sumopod, sistem ini secara otomatis menganalisis, mengkategorikan, dan memberikan skor prioritas pada setiap laporan yang masuk, sehingga pengurus RT dapat menangani masalah darurat dengan lebih cepat dan efisien.

## 🎯 Target Pasar (Target Audience)

1. **Pengurus RT/RW (B2B/B2G-lite):** 
   Sebagai pengelola wilayah yang membutuhkan alat manajemen komplain yang terpusat, cepat, dan rapi tanpa harus tenggelam dalam ribuan chat di grup WhatsApp warga.
2. **Warga Masyarakat (B2C):** 
   Masyarakat umum (warga) yang ingin melaporkan keluhan (seperti lampu jalan mati, fasilitas rusak, atau masalah keamanan) dengan mudah, cepat, dan bisa melacak status penanganan laporan mereka.

## 💰 Model Bisnis & Pricing

Sitara menggunakan model bisnis **Freemium (B2B SaaS Pricing)** yang ditargetkan untuk lingkungan RT/RW:

- **Free Tier (Rp 0/Bulan):**
  Cocok untuk RT kecil dengan jumlah laporan yang sedikit. Mencakup fitur dasar pelaporan, dashboard warga dan RT standar, tanpa batasan jumlah warga, namun dengan limit pemrosesan AI harian.
  
- **Elite Tier (Langganan Bulanan):**
  Ditujukan untuk perumahan besar, apartemen, atau RT yang sangat aktif.
  - Prioritas Analisis AI (Skor Instan)
  - Penyimpanan lampiran tak terbatas (High-res Images)
  - Notifikasi darurat dan fitur ekspor laporan
  - Dukungan teknis prioritas

## 🔄 Metodologi & Cara Kerja Sistem (System Workflow)

Sistem ini dibangun dengan arsitektur terpisah (*decoupled architecture*) antara Client-side dan Server-side. Berikut adalah metodologi dan alur kerja sistem secara keseluruhan:

### 1. Registrasi & Autentikasi (Keamanan Akses)
- Pengguna (RT/Warga) melakukan autentikasi menggunakan standar **OAuth 2.0 (Google Login)** melalui layanan Supabase Auth.
- Sistem memisahkan peran (*Role-Based Access Control*) di mana profil pengguna diklasifikasikan menjadi **RT** (Rukun Tetangga) dan **Warga**.
- RT harus mendaftarkan detail wilayah administrasinya, sedangkan warga harus menautkan akunnya pada wilayah RT yang telah terdaftar.

### 2. Metodologi Pengumpulan Data Laporan
- Warga mengirimkan *input* berupa teks (Judul dan Deskripsi Laporan) beserta lampiran bukti visual (Gambar).
- File gambar diunggah (*uploaded*) secara asinkron ke *cloud storage* (Supabase Storage), sedangkan representasi teks dan URL gambar diteruskan ke REST API Backend.
- Pengguna (Warga) diberikan kontrol penuh untuk membatalkan (menghapus) laporan selama status laporan masih berada dalam tahap antrean (*PENDING*).

### 3. Pemrosesan Bahasa Alami (NLP) Menggunakan LLM
- Data teks deskriptif yang dikirim warga dikirim ke antarmuka AI berbasis *Large Language Model (LLM)* dari **Sumopod**.
- **Mekanisme NLP & Penentuan Urgentitas:** LLM diinstruksikan melalui *Prompt Engineering* khusus untuk bertindak sebagai analis sistem tanggap darurat. LLM mengekstrak semantik dari teks untuk mendeteksi kata kunci, konteks ancaman, dan skala dampak.
  - **Skor (0-100):** Sistem menghitung skor berdasarkan matriks risiko. Kasus yang mengancam nyawa, kerusakan infrastruktur berat (misal: kebakaran, kabel listrik putus) akan diberikan skor >80. Masalah administratif atau estetika (misal: rumput panjang) diberikan skor <40.
  - **Kategorisasi:** LLM menggunakan pemahaman konteks untuk mengelompokkan laporan ke dalam label statis (Infrastruktur, Keamanan, Lingkungan, dll).
  - **Reasoning:** Model diwajibkan memberikan alasan deduktif singkat mengapa skor tersebut diberikan, sehingga keputusan AI dapat diaudit (*Explainable AI*).
- **Mekanisme Caching:** Untuk efisiensi biaya dan *latency*, sistem memanfaatkan **Redis** sebagai memori *cache*. Jika laporan yang sama persis masuk kembali, AI tidak dipanggil ulang.

### 4. Tindak Lanjut oleh Pengurus RT
- Data yang telah diperkaya (*enriched data*) oleh AI akan disimpan ke *Relational Database* (PostgreSQL).
- Pengurus RT menerima visualisasi antrean laporan yang telah disortir secara otomatis (Algoritma Sorting *Descending*) berdasarkan Skor Prioritas AI tertinggi.
- RT dapat mengubah *state* laporan (*PENDING* -> *DIPROSES* -> *SELESAI*). Perubahan status ini langsung terhubung dengan antarmuka Warga secara *real-time* atau saat halaman dimuat ulang.

### 5. Sistem Keamanan & Privasi Data (Security)
- **Otentikasi Pihak Ketiga (OAuth 2.0):** Mengurangi risiko pencurian kata sandi dengan mendelegasikan proses otentikasi kepada Google melalui Supabase.
- **Role-Based Access Control (RBAC):** Proteksi *route* dan *endpoint API* di mana akses fungsi manipulasi laporan (*Update Status*) hanya diizinkan secara eksklusif untuk JWT (JSON Web Token) dengan peran `RT`.
- **Sanitasi dan Validasi Data:** Seluruh *input* pengguna yang masuk ke *backend* divalidasi menggunakan *library* **Zod** untuk mencegah serangan *SQL Injection* dan memastikan integritas data (misalnya: validasi panjang karakter).
- **Proteksi Media:** File yang diunggah diproses di dalam *memory storage* (buffer) sebelum dikirim ke Supabase, mencegah penyimpanan *malware* lokal di server Node.js.

## 📚 Tinjauan Pustaka / Teknologi yang Digunakan (Tech Stack)

Sistem ini dikembangkan menggunakan tumpukan teknologi (*Tech Stack*) modern berbasis JavaScript/TypeScript yang populer dalam rekayasa perangkat lunak saat ini:

### 1. Frontend (Antarmuka Pengguna)
- **React.js & Vite:** *Library* utama untuk membangun antarmuka web yang reaktif (*Single Page Application*). Vite digunakan sebagai *build tool* karena kecepatan kompilasinya yang tinggi.
- **Tailwind CSS:** *Framework* CSS berbasis *utility-first* untuk mempercepat proses penataan gaya (*styling*) antarmuka secara responsif.
- **React Router v6:** Digunakan untuk manajemen navigasi halaman (*routing*) tanpa perlu memuat ulang keseluruhan dokumen (*page reload*).

### 2. Backend (Layanan Server & API)
- **Node.js & Express.js:** Lingkungan *runtime* dan *framework* server untuk membangun arsitektur REST API yang menjembatani komunikasi data antara klien dan *database*.
- **TypeScript:** Superset dari JavaScript yang menambahkan fitur *Static Typing* untuk meminimalisir *bug* dan kesalahan logika saat fase pengembangan.
- **Prisma ORM:** *Object-Relational Mapping* yang digunakan untuk menjembatani komunikasi ke *database* SQL dengan pendekatan yang lebih aman terhadap tipe data (*type-safe*).

### 3. Infrastruktur & Layanan Pihak Ketiga
- **PostgreSQL:** Sistem manajemen basis data relasional (RDBMS) utama untuk menyimpan entitas Pengguna dan Laporan.
- **Redis:** Penyimpanan struktur data *in-memory* yang difungsikan sebagai sistem *caching* respons AI.
- **Supabase:** Penyedia layanan *Backend-as-a-Service* (BaaS) yang digunakan untuk dua fungsi krusial: Autentikasi Pengguna (Google OAuth) dan Penyimpanan Berkas (*Object Storage*).
- **Sumopod AI:** Layanan *Large Language Model* eksternal yang diintegrasikan melalui antarmuka kompatibel (OpenAI API Compatible) untuk melakukan pemrosesan teks tingkat lanjut.
- **Deployment Server:** Aplikasi ini disebarluaskan (*deployed*) menggunakan arsitektur *Cloud*, di mana Frontend di-*host* pada **Vercel** dan Backend pada **Render**.

## 🚀 Cara Menjalankan Secara Lokal

Pastikan Anda memiliki Node.js, PostgreSQL, dan Redis terpasang.

1. **Clone Repository:**
   ```bash
   git clone https://github.com/otaruram/SITARA.git
   cd SITARA
   ```

2. **Setup Backend:**
   ```bash
   cd be
   npm install
   # Isi file .env sesuai dengan .env.example
   npx prisma db push
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../fe
   npm install
   # Isi file .env dengan VITE_API_URL=http://localhost:5000 dan supabase keys
   npm run dev
   ```

4. Buka `http://localhost:5173` di browser Anda.
