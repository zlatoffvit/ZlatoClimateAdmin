import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string }>}
) {
  const { storeId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId
      },
      data: {
        name
      }
    });

    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string }>}
) {
  const { storeId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 })
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 })
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId
      }
    });

    return NextResponse.json(store);

  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
