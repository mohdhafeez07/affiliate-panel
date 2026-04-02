import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.put('/profile', authMiddleware, SettingsController.updateProfile);

export default router;
