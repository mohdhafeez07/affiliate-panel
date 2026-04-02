import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/error.middleware';

export class AuthService {
  static async login(email: string, password: string) {
    const affiliate = await prisma.affiliate.findUnique({
      where: { email },
    });

    if (!affiliate) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await bcrypt.compare(password, affiliate.password);

    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    if (affiliate.status !== 'ACTIVE') {
      throw new AppError('Account is ' + affiliate.status.toLowerCase(), 403);
    }

    const payload = { id: affiliate.id, email: affiliate.email, role: affiliate.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: affiliate.id });

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        affiliateId: affiliate.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        role: affiliate.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(token: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { affiliate: true },
    });

    if (!storedToken || new Date() > storedToken.expiresAt) {
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const payload = { 
      id: storedToken.affiliate.id, 
      email: storedToken.affiliate.email, 
      role: storedToken.affiliate.role 
    };
    
    const accessToken = generateAccessToken(payload);
    
    return { accessToken };
  }

  static async logout(token: string) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  static async changePassword(affiliateId: string, currentPass: string, newPass: string) {
    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
    });

    if (!affiliate) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(currentPass, affiliate.password);
    if (!isMatch) throw new AppError('Current password incorrect', 400);

    const hashedNewPass = await bcrypt.hash(newPass, 10);

    await prisma.affiliate.update({
      where: { id: affiliateId },
      data: { password: hashedNewPass },
    });
  }
}
