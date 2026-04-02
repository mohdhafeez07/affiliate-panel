import prisma from '../config/prisma';

export class ReferralService {
  static async getReferralLink(affiliateId: string) {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      select: { referralCode: true }
    });
    
    // Example platform URL
    const platformUrl = 'https://gaming-platform.com/register';
    return {
      referralCode: affiliate?.referralCode,
      referralLink: `${platformUrl}?ref=${affiliate?.referralCode}`
    };
  }

  static async trackClick(affiliateId: string, data: { ip: string, device: string, source: string }) {
    return await prisma.clickTracking.create({
      data: {
        affiliateId,
        ipAddress: data.ip,
        device: data.device,
        source: data.source,
      }
    });
  }

  static async getFunnelStats(affiliateId: string) {
    const clicks = await prisma.clickTracking.count({ where: { affiliateId } });
    const registrations = await prisma.registration.count({ where: { affiliateId } });
    const deposits = await prisma.deposit.count({ 
      where: { affiliateId, isFirstDeposit: true } 
    });

    const regConversion = clicks > 0 ? (registrations / clicks) * 100 : 0;
    const depConversion = registrations > 0 ? (deposits / registrations) * 100 : 0;

    return {
      clicks,
      registrations,
      deposits,
      conversions: {
        registrationRate: Number(regConversion.toFixed(2)),
        depositRate: Number(depConversion.toFixed(2)),
      }
    };
  }
}
