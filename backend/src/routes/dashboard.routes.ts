import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', authMiddleware, DashboardController.getDashboardStats);
router.get('/chart', authMiddleware, DashboardController.getChartData);

export default router;
