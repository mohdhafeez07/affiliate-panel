import { Router } from 'express';
import { PayoutController } from '../controllers/payout.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/request', authMiddleware, PayoutController.requestPayout);
router.get('/history', authMiddleware, PayoutController.listPayouts);

// Admin only (Mocking that admins can approve via this endpoint)
router.patch('/:id/approve', authMiddleware, roleMiddleware(['ADMIN', 'AFFILIATE']), PayoutController.approvePayout);

export default router;
