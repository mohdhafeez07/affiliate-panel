import prisma from '../config/prisma';

export class AssetService {
  static async getAssets() {
    return await prisma.marketingAsset.findMany();
  }
}
