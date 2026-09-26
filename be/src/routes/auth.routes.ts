import { Router } from 'express';
import { checkProfile, completeProfile, getLocations } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Cek apakah profil lengkap (setelah Google login)
router.get('/profile', authenticate, checkProfile);

// Lengkapi profil (pilih role + isi wilayah)
router.post('/complete-profile', authenticate, completeProfile);

// Ambil daftar wilayah RT yang tersedia (untuk dropdown Warga)
router.get('/locations', getLocations);

export default router;
