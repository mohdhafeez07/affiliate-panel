import prisma from '../config/prisma';

export class EarningsService {
  static async getEarnings(affiliateId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [earnings, total] = await Promise.all([
      prisma.earnings.findMany({
        where: { affiliateId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.earnings.count({ where: { affiliateId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      earnings,
      meta: {
        total,
        page,
        limit,
        totalPages,
      }
    };
  }
}
