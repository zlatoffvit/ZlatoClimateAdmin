import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params;
  try {
    if (!messageId) {
      return new NextResponse("Message id is required", { status: 400 })
    }

    const message = await prismadb.message.findUnique({
      where: {
        id: messageId,
      }
    });

    return NextResponse.json(message);

  } catch (error) {
    console.log('[MESSAGE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string, messageId: string }> }
) {
  const { storeId, messageId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!messageId) {
      return new NextResponse("Message id is required", { status: 400 })
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

    const message = await prismadb.message.deleteMany({
      where: {
        id: messageId,
      }
    });

    return NextResponse.json(message);

  } catch (error) {
    console.log('[MESSAGE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


