import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason, type } = body;

    console.log(`[API] Processing ${type} request for order ${id}`);

    if (!reason || !type) {
      return NextResponse.json(
        { error: "Reason and type are required" },
        { status: 400 }
      );
    }

    // Normalize type and map to valid OrderStatus
    const statusType = type.toString().toUpperCase();
    const newStatus = statusType === "RETURN" ? "RETURN_REQUESTED" : "EXCHANGED";

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus as any,
        returnReason: reason,
        returnType: statusType,
      },
    });

    console.log(`[API] Order ${id} updated to ${newStatus}`);

    return NextResponse.json({
      message: "Request submitted successfully",
      status: updatedOrder.status,
    });
  } catch (error: any) {
    console.error("POST /api/orders/[id]/return error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process return/exchange",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
