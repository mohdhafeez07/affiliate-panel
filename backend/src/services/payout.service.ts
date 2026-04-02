import prisma from '../config/prisma';
import { AppError } from '../middleware/error.middleware';

export class PayoutService {
  static async requestPayout(affiliateId: string, amount: number) {
    if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);

    // Use Prisma Transaction for safety
    return await prisma.$transaction(async (tx) => {
      const affiliate = await tx.affiliate.findUnique({
        where: { id: affiliateId },
        select: { balance: true },
      });

      if (!affiliate || Number(affiliate.balance) < amount) {
        throw new AppError('Insufficient balance', 400);
      }

      // 1. Deduct balance
      await tx.affiliate.update({
        where: { id: affiliateId },
        data: {
          balance: { decrement: amount }
        }
      });

      // 2. Create payout request
      const payout = await tx.payoutRequest.create({
        data: {
          affiliateId,
          amount,
          status: 'PENDING',
        }
      });

      return payout;
    });
  }

  static async getPayoutHistory(affiliateId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [payouts, total] = await Promise.all([
      prisma.payoutRequest.findMany({
        where: { affiliateId },
        orderBy: { requestedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payoutRequest.count({ where: { affiliateId } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      payouts,
      meta: {
        total,
        page,
        limit,
        totalPages,
      }
    };
  }

  // Admin only logic (mock for the panel)
  static async approvePayout(payoutId: string) {
    return await prisma.payoutRequest.update({
      where: { id: payoutId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      }
    });
  }
}
