import { Response, NextFunction } from 'express';
import { PayoutService } from '../services/payout.service';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class PayoutController {
  static async requestPayout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body;
      const payout = await PayoutService.requestPayout(req.user!.id, amount);
      return sendResponse(res, 201, true, 'Payout request submitted', payout);
    } catch (error) {
      next(error);
    }
  }

  static async listPayouts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const { payouts, meta } = await PayoutService.getPayoutHistory(req.user!.id, page, limit);
      
      return sendResponse(res, 200, true, 'Payout history retrieved', payouts, meta);
    } catch (error) {
      next(error);
    }
  }

  static async approvePayout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const payout = await PayoutService.approvePayout(id);
      return sendResponse(res, 200, true, 'Payout approved (Admin Mock)', payout);
    } catch (error) {
      next(error);
    }
  }
}
