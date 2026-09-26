import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { prisma } from '../prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
    return;
  }

  try {
    // Verifikasi JWT token langsung menggunakan Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ message: "Token tidak valid." });
      return;
    }

    // Ambil data user beserta role dari database Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: data.user.id }
    });

    if (dbUser) {
      req.user = { id: dbUser.id, role: dbUser.role, email: dbUser.email };
    } else {
      // User ada di Supabase tapi belum ada di Prisma (baru login Google pertama kali)
      req.user = { id: data.user.id, role: 'NEW_USER', email: data.user.email || '' };
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid." });
  }
};

export const requireRole = (role: 'WARGA' | 'RT') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== role) {
      res.status(403).json({ message: "Anda tidak memiliki izin untuk akses ini." });
      return;
    }
    next();
  };
};
