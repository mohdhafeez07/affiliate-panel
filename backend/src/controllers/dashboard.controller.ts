import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';

export class DashboardController {
  static async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getStats(req.user!.id);
      return sendResponse(res, 200, true, 'Dashboard stats retrieved', stats);
    } catch (error) {
      next(error);
    }
  }

  static async getChartData(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const chartData = await DashboardService.getChartData(req.user!.id);
      return sendResponse(res, 200, true, 'Chart data retrieved', chartData);
    } catch (error) {
      next(error);
    }
  }
}
