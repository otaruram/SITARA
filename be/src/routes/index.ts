import { Router } from 'express';
import authRoutes from './auth.routes';
import complaintRoutes from './complaint.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);

export default router;
