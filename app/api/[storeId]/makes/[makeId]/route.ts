import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ makeId: string }> }
) {
  try {
    const { makeId } = await params;
    if (!makeId) {
      return new NextResponse("Make id is required", { status: 400 })
    }

    const make = await prismadb.make.findUnique({
      where: {
        id: makeId,
      }
    });

    return NextResponse.json(make);

  } catch (error) {
    console.log('[MAKE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string, makeId: string }>}
) {
  try {
    const { storeId, makeId } = await params;
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }
  
    if (!value) {
      return new NextResponse("Value is required", { status: 400 })
    }

    if (!makeId) {
      return new NextResponse("Make id is required", { status: 400 })
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

    const make = await prismadb.make.updateMany({
      where: {
        id: makeId,
      },
      data: {
        name
      }
    });

    return NextResponse.json(make);

  } catch (error) {
    console.log('[MAKE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string, makeId: string }> }
) {
  try {
    const { storeId, makeId } = await params;
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!makeId) {
      return new NextResponse("Make id is required", { status: 400 })
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

    const make = await prismadb.make.deleteMany({
      where: {
        id: makeId,
      }
    });

    return NextResponse.json(make);

  } catch (error) {
    console.log('[MAKE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


