export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, email, name, address } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid request: items array is empty or missing" }, { status: 400 });
    }

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
      }
    }

    const order = await prisma.order.create({
      data: {
        total,
        status: "CONFIRMED",
        userEmail: email || null,
        userName: name || null,
        address: address || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
    });

    // Send order confirmation email asynchronously
    if (email) {
      sendOrderEmail(email, order.id, name, address).catch((err) =>
        console.error("Failed to send order confirmation email:", err)
      );
    }

    return NextResponse.json({ orderId: order.id, status: order.status }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
