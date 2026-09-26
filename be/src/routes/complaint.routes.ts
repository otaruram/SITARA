import { Router } from 'express';
import { submitComplaint, getComplaints, getMyComplaints, updateComplaintStatus, deleteComplaint } from '../controllers/complaint.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const router = Router();

// Warga: Submit Complaint, Get My Complaints & Delete
router.post('/', authenticate, requireRole('WARGA'), uploadMiddleware.single('file'), submitComplaint);
router.get('/my', authenticate, requireRole('WARGA'), getMyComplaints);
router.delete('/:id', authenticate, requireRole('WARGA'), deleteComplaint);

// RT: Get All Complaints sorted by AI Score & Update Status
router.get('/', authenticate, requireRole('RT'), getComplaints);
router.patch('/:id/status', authenticate, requireRole('RT'), updateComplaintStatus);

export default router;
