import { Response, NextFunction } from 'express';
import { EarningsService } from '../services/earnings.service';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class EarningsController {
  static async listEarnings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const { earnings, meta } = await EarningsService.getEarnings(req.user!.id, page, limit);
      
      return sendResponse(res, 200, true, 'Earnings list retrieved', earnings, meta);
    } catch (error) {
      next(error);
    }
  }
}
