import { Request, Response, NextFunction } from 'express';
import { ReferralService } from '../services/referral.service';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class ReferralController {
  static async getLink(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const link = await ReferralService.getReferralLink(req.user!.id);
      return sendResponse(res, 200, true, 'Referral link retrieved', link);
    } catch (error) {
      next(error);
    }
  }

  static async trackClick(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { ip, device, source } = req.body;
      const click = await ReferralService.trackClick(req.user!.id, { ip, device, source });
      return sendResponse(res, 201, true, 'Click tracked', click);
    } catch (error) {
      next(error);
    }
  }

  static async getFunnel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const funnel = await ReferralService.getFunnelStats(req.user!.id);
      return sendResponse(res, 200, true, 'Funnel stats retrieved', funnel);
    } catch (error) {
      next(error);
    }
  }
}
