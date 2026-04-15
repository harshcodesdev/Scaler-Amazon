export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";

/**
 * POST /api/auth/signup
 *
 * Body: { email, password, name?, mobile? }
 *
 * - Creates a new User with a hashed password.
 * - Generates a 6-digit OTP saved to OTPVerification.
 * - Sends OTP via email (and SMS if mobile provided).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, mobile } = body;

    // Validate required fields
    if (!email || typeof email !== "string" || !name || !mobile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email before creating new one
    await prisma.oTPVerification.deleteMany({ where: { email } });

    // Save OTP and pending user data to DB
    await prisma.oTPVerification.create({
      data: {
        email,
        code: otp,
        name,
        password: hashedPassword,
        phone: mobile,
        expiresAt,
      },
    });

    // Send OTP via email
    await sendOtpEmail(email, otp);

    return NextResponse.json(
      {
        message: "OTP sent. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
