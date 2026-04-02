import { Router } from 'express';
import { EarningsController } from '../controllers/earnings.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, EarningsController.listEarnings);

export default router;
