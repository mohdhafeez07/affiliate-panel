import { Request, Response, NextFunction } from 'express';
import { AssetService } from '../services/asset.service';
import { sendResponse } from '../utils/response';

export class AssetController {
  static async listAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const assets = await AssetService.getAssets();
      return sendResponse(res, 200, true, 'Assets list retrieved', assets);
    } catch (error) {
      next(error);
    }
  }
}
