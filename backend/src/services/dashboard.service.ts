import prisma from '../config/prisma';

export class DashboardService {
  static async getStats(affiliateId: string) {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      select: { balance: true }
    });

    const clicks = await prisma.clickTracking.count({ where: { affiliateId } });
    const registrations = await prisma.registration.count({ where: { affiliateId } });
    const deposits = await prisma.deposit.count({ where: { affiliateId } });
    const firstDeposits = await prisma.deposit.count({ 
      where: { affiliateId, isFirstDeposit: true } 
    });

    const totalEarnings = await prisma.earnings.aggregate({
      where: { affiliateId },
      _sum: { amount: true }
    });

    const pendingPayouts = await prisma.payoutRequest.aggregate({
      where: { affiliateId, status: 'PENDING' },
      _sum: { amount: true }
    });

    const approvedPayouts = await prisma.payoutRequest.aggregate({
      where: { affiliateId, status: 'APPROVED' },
      _sum: { amount: true }
    });

    return {
      balance: Number(affiliate?.balance || 0),
      totalClicks: clicks,
      totalRegistrations: registrations,
      totalDeposits: deposits,
      totalFirstDeposits: firstDeposits,
      totalEarnings: Number(totalEarnings._sum.amount || 0),
      pendingPayouts: Number(pendingPayouts._sum.amount || 0),
      approvedPayouts: Number(approvedPayouts._sum.amount || 0),
    };
  }

  static async getChartData(affiliateId: string) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    const chartData = await Promise.all(last7Days.map(async (date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const clicks = await prisma.clickTracking.count({
        where: {
          affiliateId,
          clickedAt: { gte: date, lt: nextDay }
        }
      });

      const registrations = await prisma.registration.count({
        where: {
          affiliateId,
          registeredAt: { gte: date, lt: nextDay }
        }
      });

      const deposits = await prisma.deposit.count({
        where: {
          affiliateId,
          depositedAt: { gte: date, lt: nextDay }
        }
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks,
        registrations,
        deposits
      };
    }));

    return chartData;
  }
}
