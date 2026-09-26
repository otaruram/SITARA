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

## 🔄 Alur Proses (Process Flow)

### 1. Registrasi & Autentikasi
- Pengguna (baik RT maupun Warga) login menggunakan **Google OAuth** melalui Supabase.
- Saat pertama kali login, pengguna akan diarahkan ke halaman **Lengkapi Profil**.
- Jika mendaftar sebagai **RT**, mereka wajib memasukkan detail wilayah (No. RT, RW, Kelurahan, Kecamatan).
- Jika mendaftar sebagai **Warga**, mereka akan memilih wilayah RT yang sudah terdaftar di sistem.
- Setelah profil disimpan, *role* akan terkunci dan pengguna diarahkan ke dashboard masing-masing.

### 2. Alur Pelaporan (Warga)
- Warga login dan masuk ke **Dashboard Warga**.
- Warga mengisi formulir pengaduan (Judul, Deskripsi) dan dapat melampirkan maksimal 1 gambar bukti.
- Laporan dikirim, dan gambar diunggah langsung ke **Supabase Storage**.
- Warga dapat membatalkan laporan (menghapusnya) selama statusnya masih **PENDING**.

### 3. Pemrosesan AI (Backend)
- Backend menerima teks laporan dan mengirimkannya ke API **Sumopod AI (LLM)**.
- Sistem **Redis** digunakan sebagai *cache*. Jika laporan yang sama persis pernah dianalisis, AI tidak akan dipanggil ulang (menghemat *cost* dan waktu).
- AI mengembalikan **Kategori**, **Skor Prioritas (0-100)**, dan **Alasan Analisis**.
- Data disimpan ke dalam database PostgreSQL.

### 4. Penanganan (Pengurus RT)
- Pengurus RT login dan melihat **Dashboard RT**.
- Dashboard akan menampilkan semua laporan warga di wilayahnya, **diurutkan secara otomatis dari skor AI tertinggi** (Paling Darurat).
- Laporan dengan skor tinggi (>= 70) dan berstatus PENDING akan ditandai dengan warna merah (Darurat).
- RT dapat mengubah status laporan menjadi **DIPROSES** lalu **SELESAI**.
- Status terbaru akan otomatis terlihat oleh Warga di dashboard mereka.

## 💻 Tech Stack & Arsitektur Teknikal

Sistem ini memisahkan antara *Frontend* dan *Backend* secara komplit (Micro-architecture) agar siap skalabilitas tinggi.

### Frontend (Client-side)
- **Framework:** React.js dengan Vite (Super fast build)
- **Styling:** Vanilla CSS & Tailwind CSS (Utility-first)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Deployment Target:** Vercel

### Backend (Server-side)
- **Environment:** Node.js & Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching:** Redis (Untuk *caching* hasil AI LLM & optimasi performa)
- **Authentication:** Supabase Auth (Google OAuth)
- **File Storage:** Supabase Storage (Bucket `SIRITA`)
- **AI Integration:** Sumopod AI (OpenAI Compatible Endpoint)
- **Deployment Target:** Render

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
