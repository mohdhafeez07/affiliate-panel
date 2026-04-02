import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/link', authMiddleware, ReferralController.getLink);
router.post('/track-click', authMiddleware, ReferralController.trackClick);
router.get('/funnel', authMiddleware, ReferralController.getFunnel);

export default router;
