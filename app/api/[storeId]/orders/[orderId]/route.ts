import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  
  try {
    if (!orderId) {
      return new NextResponse("Order id is required", { status: 400 })
    }

    const order = await prismadb.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: true,
      }
    });

    return NextResponse.json(order);

  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string, orderId: string}>}
) {
  const { storeId, orderId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();

    const { selectedStatus, selectedIsPaid } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }
    
    if (!orderId) {
      return new NextResponse("Order id is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const order = await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: selectedStatus,
        isPaid: selectedIsPaid
      }
    })

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string, orderId: string }> }
) {
  const { storeId, orderId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!orderId) {
      return new NextResponse("Order id is required", { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const order = await prismadb.order.deleteMany({
      where: {
        id: orderId,
      }
    });

    return NextResponse.json(order);

  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


