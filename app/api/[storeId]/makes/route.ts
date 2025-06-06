import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function POST(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const body = await req.json();
    const { userId, name } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const make = await prismadb.make.create({
      data: {
        name, 
        storeId: storeId
      }
    });

    return NextResponse.json(make);
  } catch (error) {
    console.log('MAKES_POST', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const makes = await prismadb.make.findMany({
      where: {
        storeId
      }
    });

    return NextResponse.json(makes);
  } catch (error) {
    console.log('MAKES_GET', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}