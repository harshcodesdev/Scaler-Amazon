export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signJWT } from '@/lib/jwt';

/**
 * POST /api/auth/verify
 *
 * Body: { email, code }
 *
 * - Verifies the OTP code matches and hasn't expired.
 * - Creates the user account and returns a JWT token.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    const otpRecords = await prisma.oTPVerification.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (otpRecords.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const latestOtp = otpRecords[0];

    if (latestOtp.code !== code) {
      return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
    }

    if (latestOtp.expiresAt < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    await prisma.oTPVerification.deleteMany({ where: { email } });

    const user = await prisma.user.create({
      data: {
        email,
        name: latestOtp.name || 'Amazon Buyer',
        password: latestOtp.password || '',
        phone: latestOtp.phone || '',
      },
    });

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(
      {
        message: 'Email verified and account created successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/auth/verify error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}