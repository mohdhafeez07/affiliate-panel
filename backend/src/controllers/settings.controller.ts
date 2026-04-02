import { Response, NextFunction } from 'express';
import { SettingsService } from '../services/settings.service';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class SettingsController {
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, phone } = req.body;
      const profile = await SettingsService.updateProfile(req.user!.id, { name, phone });
      return sendResponse(res, 200, true, 'Profile updated successfully', profile);
    } catch (error) {
      next(error);
    }
  }
}
