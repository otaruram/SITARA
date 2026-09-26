import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { prisma } from '../prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// Cek apakah user sudah punya profil lengkap (sudah isi wilayah)
export const checkProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user && req.user?.email) {
      user = await prisma.user.findUnique({ where: { email: req.user.email } });
      if (user) {
        // Update ID back to sync
        await prisma.user.update({
          where: { email: req.user.email },
          data: { id: userId }
        });
        user.id = userId;
      }
    }

    if (!user) {
      // User ada di Supabase tapi belum di Prisma → perlu complete profile
      res.json({ profileComplete: false, user: null });
      return;
    }

    res.json({ 
      profileComplete: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        rt: user.rt,
        rw: user.rw,
        kelurahan: user.kelurahan,
        kecamatan: user.kecamatan,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memeriksa profil", error });
  }
};

// Lengkapi profil setelah login Google (pilih role + isi wilayah)
export const completeProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, role, rt, rw, kelurahan, kecamatan } = req.body;

    if (!name || !role || !rt || !rw || !kelurahan || !kecamatan) {
      res.status(400).json({ message: "Semua data wajib diisi (nama, role, rt, rw, kelurahan, kecamatan)." });
      return;
    }

    if (!['WARGA', 'RT'].includes(role)) {
      res.status(400).json({ message: "Role harus WARGA atau RT." });
      return;
    }

    let existing = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!existing) {
      existing = await prisma.user.findUnique({ where: { email: userEmail } });
      if (existing) {
        // Jika ketemu via email tapi ID beda (misal: user di-delete di Supabase lalu daftar lagi)
        // Kita sinkronkan ID-nya agar sesuai
        await prisma.user.update({
          where: { email: userEmail },
          data: { id: userId }
        });
      }
    }

    if (existing) {
      // Jika user sudah ada, tolak perubahan. 
      // Sesuai request: email yang sudah terdaftar tidak bisa ganti role selamanya.
      res.status(403).json({ message: "Profil Anda sudah terkunci dan role tidak dapat diubah lagi. Silakan kembali ke Beranda." });
      return;
    }

    // Buat profil baru (karena belum ada di database kita)
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        name,
        role,
        rt,
        rw,
        kelurahan,
        kecamatan,
      }
    });

    res.json({ 
      message: "Profil berhasil dilengkapi!", 
      user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal melengkapi profil", error });
  }
};

// Ambil daftar wilayah yang sudah didaftarkan oleh Pengurus RT
// Untuk digunakan dropdown oleh Warga
export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ambil semua kombinasi wilayah unik dari user yang ber-role RT
    const rtUsers = await prisma.user.findMany({
      where: { role: 'RT' },
      select: {
        rt: true,
        rw: true,
        kelurahan: true,
        kecamatan: true,
      },
      distinct: ['rt', 'rw', 'kelurahan', 'kecamatan'],
    });

    res.json({ data: rtUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data wilayah", error });
  }
};
