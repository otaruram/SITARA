import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const citizenNames = [
  'Siti Nurhaliza', 'Ahmad Fauzi', 'Nurul Hidayati', 'Hendra Wijaya', 'Rina Andriani',
  'Bambang Suryono', 'Tri Wahyuni', 'Agus Setiawan', 'Fitri Handayani', 'Joko Susilo',
  'Sri Rahayu', 'Dedi Kurniawan', 'Ratna Sari', 'Wulan Dari', 'Ilham Ramadhan',
  'Mega Utami', 'Budi Santoso', 'Eko Prasetyo', 'Dewi Lestari', 'Fajar Pratama'
];

async function main() {
  console.log('Seeding 100 Complaints for SITARA...');

  const rtNumber = '005';
  const rwNumber = '007';
  const kelurahan = 'Kebon Kelapa';
  const kecamatan = 'Bogor Tengah';
  const kota = 'KOTA BOGOR';

  // 1. Create or ensure RT User exists
  const rtUser = await prisma.user.upsert({
    where: { email: 'rt005.kebonkelapa@sitara.id' },
    update: {
      rt: rtNumber,
      rw: rwNumber,
      kelurahan,
      kecamatan,
      kota,
      role: 'RT'
    },
    create: {
      id: 'usr-rt-005',
      name: 'Anen (Ketua RT 005)',
      email: 'rt005.kebonkelapa@sitara.id',
      role: 'RT',
      rt: rtNumber,
      rw: rwNumber,
      kelurahan,
      kecamatan,
      kota
    }
  });

  // 2. Create sample citizen users in this RT
  const createdCitizens = [];
  for (let i = 0; i < citizenNames.length; i++) {
    const name = citizenNames[i];
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: { rt: rtNumber, rw: rwNumber, kelurahan, kecamatan, kota },
      create: {
        id: `usr-warga-${i + 1}`,
        name,
        email,
        role: 'WARGA',
        rt: rtNumber,
        rw: rwNumber,
        kelurahan,
        kecamatan,
        kota
      }
    });
    createdCitizens.push(user);
  }

  // Sample templates distributed across urgent, medium, and low
  const complaintTemplates = [
    // 1-20: Urgent / High Danger (Score 80-98)
    {
      title: "Kabel Listrik Utama Menjuntai Rendah di Depan Gang Kelapa",
      desc: "Kabel listrik PLN putus sebagian dan menjuntai hanya 1,5 meter dari tanah di depan Gang Kelapa RT 005. Sempat mengeluarkan percikan api saat angin kencang.",
      category: "Darurat & Infrastruktur",
      score: 96,
      reason: "Ancaman keselamatan jiwa langsung berupa bahaya sengatan listrik dan potensi kebakaran fatal di jalan utama pemukiman padat.",
      status: "SELESAI"
    },
    {
      title: "Pohon Trembesi Tua Tumbang Menutup Total Akses Jalan Utama RT 005",
      desc: "Akibat hujan deras semalam, dahan besar pohon trembesi tua dekat pos ronda patah dan tumbang melintang menimpa pagar warga serta menutup akses gang.",
      category: "Darurat & Kebencanaan",
      score: 92,
      reason: "Akses evakuasi dan mobilitas warga terputus total serta adanya kerusakan fisik pada pagar pemukiman warga.",
      status: "SELESAI"
    },
    {
      title: "Percobaan Pembobolan Rumah Kosong di Blok C RT 005",
      desc: "Sekitar jam 02.30 dini hari terdeteksi dua orang mencurigakan merusak gembok pagar rumah nomor C-04 yang ditinggal pemiliknya ke luar kota.",
      category: "Keamanan & Ketertiban",
      score: 88,
      reason: "Tindak kriminalitas aktif yang mengancam harta benda dan menciptakan keresahan keamanan masif di lingkungan RT.",
      status: "DIPROSES"
    },
    {
      title: "Pipa Distribusi Utama Tirta Pakuan Pecah Menggenangi Jalan",
      desc: "Pipa air bersih bawah tanah pecah di pertigaan gang RT 005. Air menyembur deras mengikis pondasi jalan paving dan membanjiri garasi rumah warga.",
      category: "Darurat & Infrastruktur",
      score: 89,
      reason: "Pemborosan debit air bersih skala besar, erosi pondasi jalan, dan genangan air ke dalam rumah warga.",
      status: "SELESAI"
    },
    {
      title: "Tiga Balita di RT 005 Positif DBD, Lahan Kosong Penuh Jentik",
      desc: "Dua anak tetangga dan satu balita di gang RT 005 sudah dirawat inap di RSUD terkonfirmasi DBD. Banyak tumpukan ban bekas terisi air hujan.",
      category: "Kesehatan & Lingkungan",
      score: 94,
      reason: "Wabah penyakit menular berbahaya yang menimbulkan korban rawat inap pada kelompok rentan balita.",
      status: "SELESAI"
    },
    {
      title: "Tebing Penahan Saluran Drainase Longsor di Belakang RT 005",
      desc: "Tembok penahan tanah saluran drainase ambrol terbawa arus luapan air hujan lebat kemarin sore. Tanah di bawah jalan setapak mulai tergerus.",
      category: "Darurat & Kebencanaan",
      score: 90,
      reason: "Potensi amblasnya jalur transportasi pemukiman warga akibat longsor tebing drainase aktif saat musim hujan.",
      status: "DIPROSES"
    },
    {
      title: "Pembakaran Sampah B3 Kabel & Ban Berasap Pekat di Tepi Parit",
      desc: "Penyewa gudang rongsok membakar tumpukan kulit kabel tembaga dan ban bekas. Asap hitam pekat beracun masuk ke rumah warga hingga lansia sesak napas.",
      category: "Darurat & Lingkungan",
      score: 91,
      reason: "Polusi udara bahan kimia berbahaya ilegal yang mengancam saluran pernapasan warga lansia dan anak secara langsung.",
      status: "SELESAI"
    },
    {
      title: "Pencurian Sepeda Motor di Garasi Rumah Warga RT 005",
      desc: "Terjadi kehilangan sepeda motor Honda Beat di teras rumah nomor B-10 RT 005 sekitar pukul 04.15 subuh. Rekaman CCTV menangkap pelaku bermasker.",
      category: "Keamanan & Ketertiban",
      score: 87,
      reason: "Tindak kejahatan pencurian kendaraan bermotor (Curanmor) beraksi langsung di teras pemukiman warga RT 005.",
      status: "DIPROSES"
    },
    {
      title: "Luapan Air Selokan Masuk Rumah Warga Akibat Sampah Gorong-gorong",
      desc: "Gorong-gorong pembuangan utama RT 005 tersumbat kasur dan batang kayu. Air kotor meluap hingga 30 cm merendam 6 rumah warga di deretan bawah.",
      category: "Darurat & Kebencanaan",
      score: 93,
      reason: "Banjir genangan air kotor yang merendam pemukiman, mengancam perabot rumah tangga, dan memicu risiko kuman penyakit.",
      status: "SELESAI"
    },
    {
      title: "Anjing Peliharaan Dilepas Liar Menggigit Kurir Paket",
      desc: "Penghuni rumah ujung RT 005 membiarkan anjing besar berkeliaran di jalan gang tanpa tali penuntun. Tadi siang mengejar dan menggigit betis kurir ekspedisi.",
      category: "Keamanan & Ketertiban",
      score: 86,
      reason: "Ancaman keselamatan fisik warga dan pekerja pelayanan umum akibat gigitan hewan peliharaan tanpa pengawasan.",
      status: "SELESAI"
    },

    // 21-60: Medium / Gangguan Lingkungan (Score 40-79)
    {
      title: "Lampu Penerangan Jalan Umum (PJU) Mati di Tikungan Gang 3",
      desc: "Sudah 4 hari lampu PJU di tikungan gang 3 RT 005 padam total. Area menjadi gelap gulita dan rawan terpeleset saat warga melintas di malam hari.",
      category: "Fasilitas Umum & Infrastruktur",
      score: 65,
      reason: "Penurunan visibilitas jalan malam hari yang meningkatkan risiko kecelakaan pejalan kaki dan titik buta keamanan.",
      status: "DIPROSES"
    },
    {
      title: "Sampah Rumah Tangga Menumpuk di Bak Depan RT 005",
      desc: "Armada truk pengangkut sampah terlambat 3 hari sehingga bak sampah di depan gang meluber dan mengeluarkan bau tidak sedap.",
      category: "Kebersihan & Lingkungan",
      score: 68,
      reason: "Keterlambatan pengangkutan sampah menimbulkan bau menyengat dan mengundang lalat ke area pemukiman warga terdekat.",
      status: "DIPROSES"
    },
    {
      title: "Saluran Drainase Depan Rumah Blok B Mampet Penuh Endapan Lumpur",
      desc: "Endapan lumpur dan pasir sisa renovasi menyumbat parit depan rumah B-05 sampai B-08. Jika hujan gerimis air sudah mulai menggenang.",
      category: "Infrastruktur & Lingkungan",
      score: 58,
      reason: "Penurunan kapasitas debit drainase yang dapat memicu genangan air hujan ke badan jalan pemukiman.",
      status: "PENDING"
    },
    {
      title: "Mobil Parkir Sembarangan di Jalur Evakuasi dan Mempersempit Gang",
      desc: "Penghuni kontrakan baru memarkir mobil di bahu gang utama sehingga mobil ambulans atau pemadam kebakaran dipastikan tidak bisa melintas.",
      category: "Ketertiban Umum",
      score: 72,
      reason: "Pelanggaran ruang jalan umum yang menghambat potensi akses darurat kendaraan penyelamat warga.",
      status: "DIPROSES"
    },
    {
      title: "Kucing Liar Berkembang Biak Mengotori Loteng dan Halaman Warga",
      desc: "Banyak kucing liar tanpa pemilik buang kotoran di teras dan halaman warga sekitar pos kamling, menimbulkan bau pesing dan kotoran.",
      category: "Kebersihan Lingkungan",
      score: 45,
      reason: "Gangguan kebersihan dan estetika lingkungan pemukiman terkait populasi hewan liar.",
      status: "SELESAI"
    },
    {
      title: "Spanduk Iklan Komersial Liar Dipasang Menutup Rambu Petunjuk Arah",
      desc: "Pihak sales leasing memasang spanduk baliho besar di tiang gapura RT 005 tanpa izin, menutupi papan petunjuk nama jalan RT.",
      category: "Ketertiban & Fasilitas",
      score: 48,
      reason: "Pemasangan media promosi tanpa izin yang mengganggu ketertiban visual dan fasilitas informasi wilayah.",
      status: "SELESAI"
    },

    // 61-100: Low / Minor & Administratif (Score 10-39)
    {
      title: "Permohonan Surat Pengantar Pembuatan KTP Elektronik Baru",
      desc: "Anak saya baru genap berusia 17 tahun dan memerlukan surat keterangan domisili dari Pak RT Anen untuk perekaman e-KTP di kantor kecamatan.",
      category: "Pelayanan & Administrasi",
      score: 25,
      reason: "Kebutuhan layanan administrasi kependudukan rutin warga tanpa ada unsur bahaya fisik.",
      status: "SELESAI"
    },
    {
      title: "Usulan Penggantian Bohlam Lampu Pos Ronda yang Redup",
      desc: "Bohlam lampu di pos siskamling RT 005 sudah mulai berkedip redup saat bapak-bapak jaga malam. Diusulkan ganti bohlam LED 15 watt.",
      category: "Fasilitas Umum",
      score: 30,
      reason: "Perawatan sarana penunjang kegiatan keamanan lingkungan rukun tetangga.",
      status: "SELESAI"
    },
    {
      title: "Pemberitahuan Rencana Renovasi Teras Rumah Nomor A-12",
      desc: "Melaporkan bahwa mulai hari Senin akan ada material pasir di depan pagar rumah nomor A-12 selama 3 hari untuk perbaikan kanopi.",
      category: "Pemberitahuan & Izin",
      score: 20,
      reason: "Pemberitahuan administratif aktivitas renovasi privat untuk menjaga kenyamanan tetangga sekitar.",
      status: "SELESAI"
    },
    {
      title: "Jadwal Posyandu Balita dan Cek Kesehatan Lansia Bulan Ini",
      desc: "Menanyakan konfirmasi jadwal pelaksanaan posyandu balita dan penimbangan di balai warga RT 005 apakah hari Selasa atau Rabu.",
      category: "Pelayanan & Kesehatan",
      score: 28,
      reason: "Permintaan informasi jadwal pelayanan kesehatan swadaya masyarakat tingkat RT.",
      status: "SELESAI"
    }
  ];

  // Generate 100 complaints by cycling and varying templates
  let count = 0;
  for (let i = 0; i < 100; i++) {
    const tpl = complaintTemplates[i % complaintTemplates.length];
    const citizen = createdCitizens[i % createdCitizens.length];
    
    // Vary date
    const day = (i % 28) + 1;
    const month = (i % 3) + 8; // Aug, Sep, Oct
    const dateStr = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Slight score variation to keep realistic distribution
    let score = tpl.score;
    if (i >= 60) {
      score = 15 + ((i * 3) % 24); // 15 - 38
    } else if (i >= 20) {
      score = 42 + ((i * 4) % 36); // 42 - 77
    } else {
      score = 82 + ((i * 2) % 17); // 82 - 98
    }

    let status = tpl.status;
    if (score >= 80 && i % 3 === 0) status = 'PENDING';
    else if (score >= 50 && i % 2 === 0) status = 'DIPROSES';
    else if (score < 40) status = 'SELESAI';

    await prisma.complaint.create({
      data: {
        id: `seed-lap-${rtNumber}-${String(i + 1).padStart(3, '0')}`,
        title: `${tpl.title} (#${i + 1})`,
        description: tpl.desc,
        category: tpl.category,
        score,
        aiReason: tpl.reason,
        status,
        whatsapp: `0812-87${String(i % 50).padStart(2, '0')}-${2000 + i}`,
        latitude: -6.5971 + (i * 0.0001),
        longitude: 106.7949 + (i * 0.0001),
        userId: citizen.id,
        createdAt: new Date(`${dateStr}T10:${String(i % 55).padStart(2, '0')}:00Z`)
      }
    });
    count++;
  }

  console.log(`Successfully seeded ${count} reports for RT ${rtNumber}!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

