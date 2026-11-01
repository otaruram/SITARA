import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import csv
import os

wb = openpyxl.Workbook()

# Setup Sheet 1: Dataset Utama
ws1 = wb.active
ws1.title = "Data Pengaduan (100 Data)"
ws1.views.sheetView[0].showGridLines = True

# Palet warna profesional modern (Teal & Navy tone)
DARK_TEAL = "0F766E"       # Header background
WHITE = "FFFFFF"           # Header text
ZEBRA_ROW = "F0FDFA"       # Mint soft zebra
BORDER_GRAY = "CBD5E1"     # Slate 300
BORDER_DARK = "94A3B8"     # Slate 400

font_title = Font(name="Segoe UI", size=14, bold=True, color="0F172A")
font_subtitle = Font(name="Segoe UI", size=9, italic=True, color="475569")
font_header = Font(name="Segoe UI", size=9, bold=True, color=WHITE)
font_data = Font(name="Segoe UI", size=9, color="1E293B")
font_bold = Font(name="Segoe UI", size=9, bold=True, color="1E293B")

# Badge fills & fonts
fill_tinggi = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid") # Red soft
font_tinggi = Font(name="Segoe UI", size=9, bold=True, color="991B1B")

fill_sedang = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Amber soft
font_sedang = Font(name="Segoe UI", size=9, bold=True, color="92400E")

fill_rendah = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid") # Sky soft
font_rendah = Font(name="Segoe UI", size=9, bold=True, color="075985")

fill_selesai = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid") # Green soft
font_selesai = Font(name="Segoe UI", size=9, bold=True, color="166534")

fill_proses = PatternFill(start_color="DBEAFE", end_color="DBEAFE", fill_type="solid") # Blue soft
font_proses = Font(name="Segoe UI", size=9, bold=True, color="1E40AF")

fill_pending = PatternFill(start_color="FFEDD5", end_color="FFEDD5", fill_type="solid") # Orange soft
font_pending = Font(name="Segoe UI", size=9, bold=True, color="9A3412")

fill_ditolak = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid") # Slate soft
font_ditolak = Font(name="Segoe UI", size=9, bold=True, color="475569")

thin_border = Border(
    left=Side(style='thin', color=BORDER_GRAY),
    right=Side(style='thin', color=BORDER_GRAY),
    top=Side(style='thin', color=BORDER_GRAY),
    bottom=Side(style='thin', color=BORDER_GRAY)
)

header_fill = PatternFill(start_color=DARK_TEAL, end_color=DARK_TEAL, fill_type="solid")
zebra_fill = PatternFill(start_color=ZEBRA_ROW, end_color=ZEBRA_ROW, fill_type="solid")

# Judul Dokumen di Sheet 1 (Sesuai wilayah user: RT 005 / RW 007, Kel. Kebon Kelapa, Kec. Bogor Tengah, Kota Bogor)
ws1["A1"] = "DATASET PENGADUAN DAN ASPIRASI WARGA TINGKAT RT (SITARA) - RT 005 / RW 007"
ws1["A1"].font = font_title
ws1["A2"] = "Wilayah: RT 005 / RW 007, Kel. Kebon Kelapa, Kec. Bogor Tengah, Kota Bogor, Jawa Barat | Pengurus RT: Anen | Pengurus RW: Sopian Sayuri | Standar Schema: Satu Data SP4N-LAPOR! & Triase LLM STSI4401 UT"
ws1["A2"].font = font_subtitle

headers = [
    "No",
    "ID Laporan",
    "Tanggal Masuk",
    "Kode Prov",
    "Provinsi",
    "Kode Kab/Kota",
    "Kabupaten/Kota",
    "Kecamatan",
    "Kelurahan",
    "RW",
    "RT",
    "Nama Pelapor",
    "Nomor WhatsApp",
    "Tipe Laporan",
    "Sumber Laporan",
    "Klasifikasi Laporan",
    "Kategori (Analisis LLM)",
    "Skor Prioritas (0-100)",
    "Tingkat Prioritas",
    "Judul Laporan",
    "Teks Pengaduan Warga",
    "Reasoning / Alasan LLM",
    "Pihak Terdisposisi",
    "Status Laporan",
    "Tindak Lanjut / Keterangan"
]

header_row = 4
for col_idx, header in enumerate(headers, 1):
    cell = ws1.cell(row=header_row, column=col_idx, value=header)
    cell.font = font_header
    cell.fill = header_fill
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = thin_border
ws1.row_dimensions[header_row].height = 28

# Import raw data dari complaints_data.py
from complaints_data import data_rows

names_pool = [
    "Budi Santoso", "Siti Nurhaliza", "Ahmad Fauzi", "Dewi Lestari", "Hendra Wijaya",
    "Rina Andriani", "Eko Prasetyo", "Tri Wahyuni", "Agus Setiawan", "Nurul Hidayati",
    "Bambang Suryono", "Fitri Handayani", "Joko Susilo", "Sri Rahayu", "Dedi Kurniawan",
    "Ratna Sari", "Gunawan Wibisono", "Wulan Dari", "Ilham Ramadhan", "Mega Utami",
    "Faisal Tanjung", "Indah Permata", "Rizki Pratama", "Maya Anggraini", "Bayu Pratama",
    "Neneng Hasanah", "Doni Darmawan", "Lia Marlina", "Rudi Hartono", "Titin Sumarni",
    "Yusuf Maulana", "Eni Sulastri", "Hadi Purnomo", "Dian Sastro", "Arief Budiman",
    "Siska Amelia", "Herman Susanto", "Rini Astuti", "Wahyu Nugroho", "Anisa Rahma",
    "Teguh Pribadi", "Erna Wati", "Sony Hermanto", "Lestari Dewi", "Imam Ghazali",
    "Yanti Novita", "Dimas Anggara", "Kurnia Sandi", "Zulfikar Ali", "Desi Ratnasari"
]

for idx, item in enumerate(data_rows, 1):
    row_num = header_row + idx
    
    # Pelapor & WhatsApp
    if item["tipe"] == "Anonim":
        pelapor = "Masyarakat (Anonim)"
        wa = "0812-****-****"
    elif item["tipe"] == "Rahasia":
        p_name = names_pool[(idx * 3) % len(names_pool)]
        pelapor = f"{p_name} (Rahasia)"
        wa = f"0813-****-{1000 + idx}"
    else:
        pelapor = names_pool[idx % len(names_pool)]
        wa = f"0812-87{idx:02d}-{2000 + idx}"

    rt_num = "RT 005"
    rw_num = "RW 007"
    id_lap = f"LAP-SITARA-2026-{idx:03d}"
    
    values = [
        idx,
        id_lap,
        item["tanggal"],
        "32",
        "JAWA BARAT",
        "32.71",
        "KOTA BOGOR",
        "Bogor Tengah",
        "Kebon Kelapa",
        rw_num,
        rt_num,
        pelapor,
        wa,
        item["tipe"],
        item["sumber"],
        item["klasifikasi"],
        item["kategori"],
        item["score"],
        item["prioritas"],
        item["judul"],
        item["isi"],
        item["reason"],
        item["disposisi"],
        item["status"],
        item["tindak_lanjut"]
    ]
    
    is_zebra = (idx % 2 == 0)
    
    for col_idx, val in enumerate(values, 1):
        c = ws1.cell(row=row_num, column=col_idx, value=val)
        c.font = font_data
        c.border = thin_border
        
        # Alignment
        if col_idx in [1, 2, 3, 4, 6, 8, 9, 10, 11, 13, 14, 15, 16, 18, 19, 24]:
            c.alignment = Alignment(horizontal="center", vertical="center")
        elif col_idx in [20, 21, 22, 23, 25]:
            c.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        else:
            c.alignment = Alignment(horizontal="left", vertical="center")
            
        # Base zebra
        if is_zebra:
            c.fill = zebra_fill
            
        # Badge coloring for Prioritas (Col 19)
        if col_idx == 19:
            if val == "Tinggi":
                c.fill = fill_tinggi
                c.font = font_tinggi
            elif val == "Sedang":
                c.fill = fill_sedang
                c.font = font_sedang
            elif val == "Rendah":
                c.fill = fill_rendah
                c.font = font_rendah
                
        # Badge coloring for Status (Col 24)
        if col_idx == 24:
            if val == "SELESAI":
                c.fill = fill_selesai
                c.font = font_selesai
            elif val == "PROSES":
                c.fill = fill_proses
                c.font = font_proses
            elif val == "PENDING":
                c.fill = fill_pending
                c.font = font_pending
            elif val == "DITOLAK":
                c.fill = fill_ditolak
                c.font = font_ditolak
                
    ws1.row_dimensions[row_num].height = 36

# Atur lebar kolom
col_widths = {
    1: 6,    # No
    2: 18,   # ID Laporan
    3: 14,   # Tanggal Masuk
    4: 10,   # Kode Prov
    5: 14,   # Provinsi
    6: 14,   # Kode Kab/Kota
    7: 16,   # Kab/Kota
    8: 16,   # Kecamatan
    9: 16,   # Kelurahan
    10: 9,   # RW
    11: 9,   # RT
    12: 22,  # Nama Pelapor
    13: 16,  # WhatsApp
    14: 12,  # Tipe Laporan
    15: 16,  # Sumber Laporan
    16: 20,  # Klasifikasi Laporan
    17: 24,  # Kategori LLM
    18: 14,  # Skor Prioritas
    19: 16,  # Tingkat Prioritas
    20: 32,  # Judul Laporan
    21: 45,  # Teks Pengaduan
    22: 40,  # Reasoning LLM
    23: 30,  # Pihak Terdisposisi
    24: 14,  # Status Laporan
    25: 44   # Tindak Lanjut
}

for col_idx, width in col_widths.items():
    ws1.column_dimensions[get_column_letter(col_idx)].width = width

ws1.freeze_panes = "C5"


# ==========================================
# Sheet 2: Metadata & Kamus Data Standar Satu Data SP4N-LAPOR & SITARA
# ==========================================
ws2 = wb.create_sheet(title="Metadata & Kamus Data")
ws2.views.sheetView[0].showGridLines = True

ws2["A1"] = "METADATA DATASET PENGADUAN WARGA (STANDAR SATU DATA SP4N-LAPOR & SITARA)"
ws2["A1"].font = font_title
ws2["A2"] = "Lokasi Studi: RT 005 / RW 007, Kel. Kebon Kelapa, Kec. Bogor Tengah, Kota Bogor | Pengurus RT: Anen | Pengurus RW: Sopian Sayuri | Acuan: SP4N-LAPOR! & Proposal STSI4401 UT"
ws2["A2"].font = font_subtitle

meta_info = [
    ("Judul Dataset", "Dataset Pengaduan dan Aspirasi Masyarakat Tingkat RT (SITARA) Berbasis LLM"),
    ("Wilayah Studi Kasus", "RT 005 / RW 007, Kelurahan Kebon Kelapa, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat"),
    ("Nama Pengurus RT", "Anen (Ketua RT 005)"),
    ("Nama Pengurus RW", "Sopian Sayuri (Ketua RW 007)"),
    ("Kode Referensi Wilayah", "Kode Provinsi: 32 (Jawa Barat) | Kode Kabupaten/Kota: 32.71 (Kota Bogor)"),
    ("Kode Dataset / ID Dokumen", "SDI-BOGOR-SITARA-RT005-2026"),
    ("Nama Produsen Data", "Pengurus RT 005 (Anen) & Pengurus RW 007 (Sopian Sayuri), Kelurahan Kebon Kelapa & Tim SITARA Capstone STSI4401"),
    ("Instansi Pembina Data", "Dinas Komunikasi dan Informatika (Diskominfo) & Kelurahan Kebon Kelapa"),
    ("Platform Asal", "SITARA (Sistem Informasi Triase dan Aduan Warga) & Form SP4N-LAPOR!"),
    ("Periode Data", "Agustus 2026 - November 2026 (100 Record Sampel Aduan Warga)"),
    ("Klasifikasi Laporan (SP4N)", "1. Pengaduan (Keluhan atas gangguan/kerusakan lingkungan)\n2. Aspirasi (Saran/usulan pembenahan lingkungan RT)\n3. Permintaan Informasi (Kebutuhan informasi pelayanan kependudukan)"),
    ("Model Klasifikasi & Triase", "Large Language Model (LLM: Sumopod AI / GPT) Zero-Shot Prompt Engineering"),
    ("Skala Skor Prioritas", "Skala Rasio 0 - 100 berdasarkan tingkat urgensi, dampak fisik/sosial, dan potensi bahaya"),
    ("Pembagian Prioritas (Tabel 2.1)", "• 0 - 40 : Prioritas Rendah (Info, usulan non-mendesak, estetika)\n• 41 - 79 : Prioritas Sedang (Gangguan fasilitas, lingkungan, kenyamanan)\n• 80 - 100 : Prioritas Tinggi (Darurat keselamatan, kebakaran, kriminalitas aktif, wabah penyakit)"),
    ("Format Penyimpanan", "PostgreSQL Database (Prisma ORM) & Redis Caching (30 hari)")
]

ws2.cell(row=4, column=1, value="Atribut Metadata").font = font_header
ws2.cell(row=4, column=1).fill = header_fill
ws2.cell(row=4, column=2, value="Keterangan / Nilai").font = font_header
ws2.cell(row=4, column=2).fill = header_fill
ws2.row_dimensions[4].height = 24

for idx, (attr, desc) in enumerate(meta_info, 5):
    c1 = ws2.cell(row=idx, column=1, value=attr)
    c1.font = font_bold
    c1.border = thin_border
    c1.fill = zebra_fill
    c1.alignment = Alignment(vertical="center")
    
    c2 = ws2.cell(row=idx, column=2, value=desc)
    c2.font = font_data
    c2.border = thin_border
    c2.alignment = Alignment(vertical="center", wrap_text=True)
    ws2.row_dimensions[idx].height = 34 if "\n" in desc else 22

ws2.column_dimensions["A"].width = 30
ws2.column_dimensions["B"].width = 85

# Kamus Kolom di Sheet 2
kamus_start = len(meta_info) + 7
ws2.cell(row=kamus_start, column=1, value="KAMUS KOLOM / DATA DICTIONARY").font = font_title

kamus_headers = ["No", "Nama Kolom / Field", "Tipe Data", "Standar / Sumber", "Keterangan & Contoh"]
for c_idx, kh in enumerate(kamus_headers, 1):
    c = ws2.cell(row=kamus_start+1, column=c_idx, value=kh)
    c.font = font_header
    c.fill = header_fill
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = thin_border
ws2.row_dimensions[kamus_start+1].height = 24

data_dict = [
    (1, "No", "Integer", "Umum", "Nomor urut data laporan (1 - 100)"),
    (2, "ID Laporan", "Varchar(30)", "SITARA System", "Kode unik aduan (LAP-SITARA-2026-xxx)"),
    (3, "Tanggal Masuk", "Date (YYYY-MM-DD)", "SP4N-LAPOR!", "Tanggal laporan pertama kali dikirim oleh warga"),
    (4, "Kode Prov", "Varchar(10)", "Kemendagri / SDI", "Kode referensi wilayah provinsi (32 = Jawa Barat)"),
    (5, "Provinsi", "Varchar(50)", "Kemendagri / SDI", "Nama provinsi lokasi pelaporan (JAWA BARAT)"),
    (6, "Kode Kab/Kota", "Varchar(10)", "Kemendagri / SDI", "Kode referensi kabupaten/kota (32.71 = Kota Bogor)"),
    (7, "Kabupaten/Kota", "Varchar(50)", "Kemendagri / SDI", "Nama wilayah administratif kota (KOTA BOGOR)"),
    (8, "Kecamatan", "Varchar(50)", "SITARA Profile", "Wilayah kecamatan tempat RT berkedudukan (Bogor Tengah)"),
    (9, "Kelurahan", "Varchar(50)", "SITARA Profile", "Wilayah kelurahan pemukiman warga (Kebon Kelapa)"),
    (10, "RW", "Varchar(10)", "SITARA Profile", "Nomor Rukun Warga (RW 007 - Pengurus RW: Sopian Sayuri)"),
    (11, "RT", "Varchar(10)", "SITARA Profile", "Nomor Rukun Tetangga domisili aduan (RT 005 - Pengurus RT: Anen)"),
    (12, "Nama Pelapor", "Varchar(100)", "SP4N-LAPOR!", "Nama warga pengirim aduan, atau 'Anonim' jika memilih merahasiakan"),
    (13, "Nomor WhatsApp", "Varchar(20)", "SITARA Schema", "Kontak WhatsApp pengirim untuk notifikasi tanggapan RT"),
    (14, "Tipe Laporan", "Enum", "SP4N-LAPOR!", "Derajat privasi: Publik, Rahasia, atau Anonim"),
    (15, "Sumber Laporan", "Varchar(50)", "SP4N-LAPOR!", "Kanal masuk: SITARA Web, WhatsApp Warga, Form SP4N-LAPOR"),
    (16, "Klasifikasi Laporan", "Enum", "Perpres 76/2013", "Pengaduan (Keluhan), Aspirasi (Usulan), Permintaan Informasi"),
    (17, "Kategori (LLM)", "Varchar(50)", "LLM Classifier", "Kategori yang diprediksi oleh LLM (Kebersihan, Keamanan, Fasum, dll)"),
    (18, "Skor Prioritas", "Integer (0-100)", "LLM Scoring", "Nilai triase numerik yang dihitung model berdasarkan urgensi & dampak"),
    (19, "Tingkat Prioritas", "Enum", "Proposal Tabel 2.1", "Tinggi (80-100), Sedang (41-79), Rendah (0-40)"),
    (20, "Judul Laporan", "Varchar(150)", "SP4N-LAPOR!", "Ringkasan inti pokok aduan"),
    (21, "Teks Pengaduan", "Text", "User Input", "Teks alami bahasa sehari-hari warga yang diproses oleh LLM"),
    (22, "Reasoning LLM", "Text", "LLM Output", "Penjelasan logis sistem AI mengapa aduan diberi skor & kategori tertentu"),
    (23, "Pihak Terdisposisi", "Varchar(100)", "SP4N-LAPOR!", "Penanggung jawab lapangan (Ketua RT 005 Anen, Pengurus RW 007 Sopian Sayuri, Seksi Keamanan, Puskesmas, dll)"),
    (24, "Status Laporan", "Enum", "SITARA Schema", "Status eksekusi: PENDING, PROSES, SELESAI, DITOLAK"),
    (25, "Tindak Lanjut", "Text", "RT Action Log", "Catatan langkah riil penyelesaian yang diambil oleh pihak RT 005 (Anen)")
]

for idx, (num, col_name, dtype, source, d_desc) in enumerate(data_dict, kamus_start+2):
    row_vals = [num, col_name, dtype, source, d_desc]
    for c_i, v in enumerate(row_vals, 1):
        cell = ws2.cell(row=idx, column=c_i, value=v)
        cell.font = font_data
        cell.border = thin_border
        if c_i in [1, 3]:
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif c_i in [2, 4]:
            cell.alignment = Alignment(horizontal="left", vertical="center")
            cell.font = font_bold
        else:
            cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
            
        if idx % 2 == 0:
            cell.fill = zebra_fill
    ws2.row_dimensions[idx].height = 22

ws2.column_dimensions["A"].width = 6
ws2.column_dimensions["B"].width = 24
ws2.column_dimensions["C"].width = 18
ws2.column_dimensions["D"].width = 20
ws2.column_dimensions["E"].width = 65


# ==========================================
# Sheet 3: Ringkasan Eksekutif & Statistik Data
# ==========================================
ws3 = wb.create_sheet(title="Statistik & Rekapitulasi")
ws3.views.sheetView[0].showGridLines = True

ws3["A1"] = "REKAPITULASI DAN DISTRIBUSI DATA DUMMY SITARA (100 DATA)"
ws3["A1"].font = font_title
ws3["A2"] = "Gambaran Kinerja Triase Otomatis Large Language Model - RT 005 / RW 007 (Pengurus RT: Anen | Pengurus RW: Sopian Sayuri), Kel. Kebon Kelapa, Kec. Bogor Tengah, Kota Bogor"
ws3["A2"].font = font_subtitle

# Hitung statistik dari data_rows
stat_prioritas = {"Tinggi": 0, "Sedang": 0, "Rendah": 0}
stat_status = {"SELESAI": 0, "PROSES": 0, "PENDING": 0, "DITOLAK": 0}
stat_klasifikasi = {"Pengaduan": 0, "Aspirasi": 0, "Permintaan Informasi": 0}
stat_kategori = {}

for row in data_rows:
    p = row["prioritas"]
    stat_prioritas[p] = stat_prioritas.get(p, 0) + 1
    
    s = row["status"]
    stat_status[s] = stat_status.get(s, 0) + 1
    
    k = row["klasifikasi"]
    stat_klasifikasi[k] = stat_klasifikasi.get(k, 0) + 1
    
    kat = row["kategori"]
    stat_kategori[kat] = stat_kategori.get(kat, 0) + 1

# Tabel 1: Rekap Prioritas
ws3.cell(row=4, column=1, value="Tabel 1. Distribusi Tingkat Prioritas (Sesuai Tabel 2.1 Proposal)").font = font_bold
headers_t1 = ["Tingkat Prioritas", "Rentang Skor", "Jumlah Laporan", "Persentase (%)"]
for c_i, h in enumerate(headers_t1, 1):
    c = ws3.cell(row=5, column=c_i, value=h)
    c.font = font_header
    c.fill = header_fill
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = thin_border

t1_data = [
    ("Tinggi (Darurat / Kritis)", "80 - 100", stat_prioritas.get("Tinggi", 0), f"{stat_prioritas.get('Tinggi', 0)}%"),
    ("Sedang (Menengah / Gangguan)", "41 - 79", stat_prioritas.get("Sedang", 0), f"{stat_prioritas.get('Sedang', 0)}%"),
    ("Rendah (Info / Aspirasi)", "0 - 40", stat_prioritas.get("Rendah", 0), f"{stat_prioritas.get('Rendah', 0)}%"),
    ("Total Keseluruhan", "0 - 100", 100, "100.0%")
]

for r_i, (tp, rng, jml, pct) in enumerate(t1_data, 6):
    r_cells = [
        ws3.cell(row=r_i, column=1, value=tp),
        ws3.cell(row=r_i, column=2, value=rng),
        ws3.cell(row=r_i, column=3, value=jml),
        ws3.cell(row=r_i, column=4, value=pct),
    ]
    is_total = (r_i == 9)
    for c in r_cells:
        c.font = font_bold if is_total else font_data
        c.border = thin_border
        c.alignment = Alignment(horizontal="center", vertical="center")
        if is_total:
            c.fill = zebra_fill

# Tabel 2: Rekap Status Penyelesaian
ws3.cell(row=11, column=1, value="Tabel 2. Status Penanganan Laporan di Tingkat RT 005 (Pengurus RT: Anen)").font = font_bold
headers_t2 = ["Status Laporan", "Keterangan Operasional", "Jumlah", "Persentase (%)"]
for c_i, h in enumerate(headers_t2, 1):
    c = ws3.cell(row=12, column=c_i, value=h)
    c.font = font_header
    c.fill = header_fill
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = thin_border

t2_data = [
    ("SELESAI", "Telah ditindaklanjuti dan diverifikasi tuntas oleh RT 005 (Anen)", stat_status.get("SELESAI", 0), f"{stat_status.get('SELESAI', 0)}%"),
    ("PROSES", "Sedang dalam pengerjaan teknis / mediasi pihak RT 005 (Anen)", stat_status.get("PROSES", 0), f"{stat_status.get('PROSES', 0)}%"),
    ("PENDING", "Menunggu giliran penanganan / disposisi lapangan", stat_status.get("PENDING", 0), f"{stat_status.get('PENDING', 0)}%"),
    ("DITOLAK", "Laporan tidak relevan / melanggar norma / di luar kewenangan RT 005", stat_status.get("DITOLAK", 0), f"{stat_status.get('DITOLAK', 0)}%"),
    ("Total", "Seluruh aduan terdaftar di sistem SITARA RT 005 (Anen)", 100, "100.0%")
]

for r_i, (st, desc, jml, pct) in enumerate(t2_data, 13):
    c1 = ws3.cell(row=r_i, column=1, value=st)
    c2 = ws3.cell(row=r_i, column=2, value=desc)
    c3 = ws3.cell(row=r_i, column=3, value=jml)
    c4 = ws3.cell(row=r_i, column=4, value=pct)
    is_total = (r_i == 17)
    for c in [c1, c2, c3, c4]:
        c.font = font_bold if is_total else font_data
        c.border = thin_border
        if c in [c1, c3, c4]:
            c.alignment = Alignment(horizontal="center", vertical="center")
        else:
            c.alignment = Alignment(horizontal="left", vertical="center")
        if is_total:
            c.fill = zebra_fill

# Tabel 3: Rekap Kategori LLM
ws3.cell(row=19, column=1, value="Tabel 3. Distribusi Kategori Pengaduan Hasil Klasifikasi LLM").font = font_bold
headers_t3 = ["No", "Kategori Permasalahan (LLM)", "Jumlah Laporan", "Proporsi (%)"]
for c_i, h in enumerate(headers_t3, 1):
    c = ws3.cell(row=20, column=c_i, value=h)
    c.font = font_header
    c.fill = header_fill
    c.alignment = Alignment(horizontal="center", vertical="center")
    c.border = thin_border

sorted_kat = sorted(stat_kategori.items(), key=lambda x: x[1], reverse=True)
for k_idx, (k_name, count) in enumerate(sorted_kat, 1):
    r_pos = 20 + k_idx
    c1 = ws3.cell(row=r_pos, column=1, value=k_idx)
    c2 = ws3.cell(row=r_pos, column=2, value=k_name)
    c3 = ws3.cell(row=r_pos, column=3, value=count)
    c4 = ws3.cell(row=r_pos, column=4, value=f"{count}%")
    for c in [c1, c2, c3, c4]:
        c.font = font_data
        c.border = thin_border
        if c in [c1, c3, c4]:
            c.alignment = Alignment(horizontal="center", vertical="center")
        else:
            c.alignment = Alignment(horizontal="left", vertical="center")
        if k_idx % 2 == 0:
            c.fill = zebra_fill

tot_row = 21 + len(sorted_kat)
ws3.cell(row=tot_row, column=1, value="Total").alignment = Alignment(horizontal="center", vertical="center")
ws3.cell(row=tot_row, column=2, value="Semua Kategori").alignment = Alignment(horizontal="left", vertical="center")
ws3.cell(row=tot_row, column=3, value=100).alignment = Alignment(horizontal="center", vertical="center")
ws3.cell(row=tot_row, column=4, value="100.0%").alignment = Alignment(horizontal="center", vertical="center")
for col in range(1, 5):
    tc = ws3.cell(row=tot_row, column=col)
    tc.font = font_bold
    tc.border = thin_border
    tc.fill = zebra_fill

ws3.column_dimensions["A"].width = 30
ws3.column_dimensions["B"].width = 50
ws3.column_dimensions["C"].width = 18
ws3.column_dimensions["D"].width = 18

# Simpan File Excel
import shutil

output_excel_path = r"c:\Users\asus\Pictures\Tugas\Dataset_Dummy_Pengaduan_SITARA_100_Data.xlsx"
wb.save(output_excel_path)
print(f"File Excel berhasil dibuat di: {output_excel_path}")

# Export Sheet 1 ke CSV
output_csv_path = r"c:\Users\asus\Pictures\Tugas\Dataset_Dummy_Pengaduan_SITARA_100_Data.csv"
with open(output_csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    for r in range(4, ws1.max_row + 1):
        row_vals = [ws1.cell(row=r, column=c).value for c in range(1, ws1.max_column + 1)]
        writer.writerow(row_vals)

print(f"File CSV berhasil diekspor di: {output_csv_path}")

# Sinkronisasi file ke fe/public dan fe/dist
dest_dirs = [
    r"c:\Users\asus\Pictures\Tugas\fe\public",
    r"c:\Users\asus\Pictures\Tugas\fe\dist"
]

for d in dest_dirs:
    if os.path.exists(d):
        shutil.copy2(output_excel_path, os.path.join(d, "Dataset_Dummy_Pengaduan_SITARA_100_Data.xlsx"))
        shutil.copy2(output_csv_path, os.path.join(d, "Dataset_Dummy_Pengaduan_SITARA_100_Data.csv"))
        print(f"File berhasil disinkronkan ke: {d}")

