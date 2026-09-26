import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { analyzeComplaint } from '../services/ai.service';
import { uploadFile } from '../services/upload.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { supabase } from '../config/supabase';

// Validasi Zod untuk pembuatan laporan
const complaintSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter")
});

export const submitComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    console.log('[DEBUG] req.body:', req.body);
    console.log('[DEBUG] req.file:', req.file ? 'yes' : 'no');

    // Validasi Zod
    const validation = complaintSchema.safeParse(req.body);
    if (!validation.success) {
      console.log('[DEBUG] Zod validation error:', JSON.stringify(validation.error.issues || validation.error));
      res.status(400).json({ message: "Input tidak valid", errors: validation.error.issues || validation.error });
      return;
    }

    const { title, description } = validation.data;

    let attachmentUrl = null;
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '')}`;
      
      const { data, error } = await supabase.storage
        .from('SIRITA')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (error) {
        console.error("Error uploading to Supabase Storage:", error);
        res.status(500).json({ message: "Gagal mengupload gambar ke Supabase Storage" });
        return;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('SIRITA')
        .getPublicUrl(fileName);
        
      attachmentUrl = publicUrlData.publicUrl;
    }

    // Call Sumopod AI for NLP analysis
    // Jika AI gagal, di ai.service.ts sudah ada error handling fallback ke skor 50
    const aiAnalysis = await analyzeComplaint(title, description);

    // Save to Database
    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        attachment: attachmentUrl,
        category: aiAnalysis.category,
        score: aiAnalysis.score,
        aiReason: aiAnalysis.reason,
        userId: userId,
      }
    });

    res.status(201).json({
      message: "Pengaduan berhasil dikirim dan dianalisis",
      data: complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengirim pengaduan", error });
  }
};

export const getMyComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const complaints = await prisma.complaint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: complaints });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil riwayat pengaduan Anda", error });
  }
};

export const getComplaints = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Ambil data wilayah dari user RT yang sedang login
    const rtUser = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!rtUser) {
      res.status(401).json({ message: "User tidak ditemukan" });
      return;
    }

    // Hanya tampilkan laporan dari warga di wilayah RT yang sama
    const complaints = await prisma.complaint.findMany({
      where: {
        user: {
          rt: rtUser.rt,
          rw: rtUser.rw,
          kelurahan: rtUser.kelurahan,
          kecamatan: rtUser.kecamatan,
        }
      },
      include: {
        user: { select: { name: true, email: true, rt: true, rw: true } }
      },
      orderBy: {
        score: 'desc'
      }
    });

    res.json({ data: complaints });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pengaduan", error });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, DIPROSES, SELESAI
    
    if (!status || !['PENDING', 'DIPROSES', 'SELESAI'].includes(status)) {
      res.status(400).json({ message: "Status tidak valid" });
      return;
    }

    const complaint = await prisma.complaint.update({
      where: { id: String(id) },
      data: { status }
    });

    res.json({ message: "Status pengaduan berhasil diperbarui", data: complaint });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui status", error });
  }
};

export const deleteComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      res.status(404).json({ message: "Laporan tidak ditemukan" });
      return;
    }

    if (complaint.userId !== userId) {
      res.status(403).json({ message: "Hanya dapat menghapus laporan sendiri" });
      return;
    }

    if (complaint.status !== 'PENDING') {
      res.status(400).json({ message: "Hanya laporan PENDING yang bisa dibatalkan" });
      return;
    }

    await prisma.complaint.delete({
      where: { id }
    });

    res.json({ message: "Laporan berhasil dibatalkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal membatalkan laporan", error });
  }
};
