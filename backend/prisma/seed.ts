import { PrismaClient, AffiliateStatus, PayoutStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // 1. Create Demo Affiliate
  const demoAffiliate = await prisma.affiliate.upsert({
    where: { email: 'affiliate@test.com' },
    update: {},
    create: {
      name: 'Demo Affiliate',
      email: 'affiliate@test.com',
      password: hashedPassword,
      referralCode: 'AFF12345',
      phone: '+1234567890',
      status: AffiliateStatus.ACTIVE,
      balance: 1560.50,
      role: 'AFFILIATE',
    },
  });

  console.log('Demo Affiliate created:', demoAffiliate.email);

  // 2. Marketing Assets
  const assetsData = [
    {
      title: 'Gaming Banner 728x90',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=728&h=90',
      downloadUrl: '#',
    },
    {
      title: 'Mega Promo 300x250',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=300&h=250',
      downloadUrl: '#',
    },
    {
      title: 'Welcome Bonus 160x600',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=160&h=600',
      downloadUrl: '#',
    },
  ];

  for (const asset of assetsData) {
    await prisma.marketingAsset.create({ data: asset });
  }

  // 3. Stats Data (Clicks, Registrations, Deposits)
  const now = new Date();
  
  // Last 7 days conversion trend
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);

    // Create 10-20 clicks per day
    const clickCount = Math.floor(Math.random() * 10) + 10;
    for (let j = 0; j < clickCount; j++) {
      await prisma.clickTracking.create({
        data: {
          affiliateId: demoAffiliate.id,
          ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
          device: Math.random() > 0.5 ? 'Mobile' : 'Desktop',
          source: 'Google Ads',
          clickedAt: date,
        },
      });
    }

    // Create 2-5 registrations per day
    const regCount = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < regCount; j++) {
      await prisma.registration.create({
        data: {
          affiliateId: demoAffiliate.id,
          username: `player_${i}_${j}`,
          email: `player_${i}_${j}@test.com`,
          registeredAt: date,
        },
      });

      // 50% chance of deposit
      if (Math.random() > 0.5) {
        const amount = Math.floor(Math.random() * 500) + 100;
        await prisma.deposit.create({
          data: {
            affiliateId: demoAffiliate.id,
            playerId: `P-${i}-${j}`,
            amount: amount,
            depositedAt: date,
            isFirstDeposit: true,
          },
        });

        // Add earning for first deposit (10%)
        await prisma.earnings.create({
          data: {
            affiliateId: demoAffiliate.id,
            amount: amount * 0.1,
            commissionPercentage: 10,
            revenueType: 'CPA',
            createdAt: date,
          },
        });
      }
    }
  }

  // 4. Payout History
  const payoutData = [
    { amount: 500, status: PayoutStatus.APPROVED, requestedAt: new Date(now.getTime() - 86400000 * 10), approvedAt: new Date(now.getTime() - 86400000 * 9) },
    { amount: 250, status: PayoutStatus.PENDING, requestedAt: new Date(now.getTime() - 86400000 * 2) },
    { amount: 100, status: PayoutStatus.REJECTED, requestedAt: new Date(now.getTime() - 86400000 * 15) },
  ];

  for (const payout of payoutData) {
    await prisma.payoutRequest.create({
      data: {
        affiliateId: demoAffiliate.id,
        ...payout,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
