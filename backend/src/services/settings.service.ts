import prisma from '../config/prisma';

export class SettingsService {
  static async updateProfile(affiliateId: string, data: { name?: string, phone?: string }) {
    return await prisma.affiliate.update({
      where: { id: affiliateId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
      }
    });
  }
}
