import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@/auth";
import { corsHeaders } from "@/lib/utils";


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  try {
    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 })
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        categories: true,
        make: true,
      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string, productId: string }>}
) {
  const { storeId, productId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;
    const body = await req.json();
    const {  

      name,
      description,
      price,
      marking,
      power,
      categories,
      make,
      images,
      isFeatured,
      isArchived
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!marking) {
      return new NextResponse("Marking is required", { status: 400 });
    }

    if (!power) {
      return new NextResponse("Power is required", { status: 400 });
    }

    if (!description) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Pice is required", { status: 400 });
    }

    if (!categories) {
      return new NextResponse("At least one category is required", { status: 400 });
    }
  
    if (!make) {
      return new NextResponse("Make is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 })
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

    const categoriesByProduct = await prismadb.category.findMany({
      where: {
        id: {
          in: categories,
        },
      },
    });

    if (!categoriesByProduct) {
      return new NextResponse("No such categories exist", { status: 400 });
    };

    const categoriesToCreate = categoriesByProduct.map((categoryByProduct) => {
      return {
        id: categoryByProduct.id,
      };
    });   

    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        marking,
        power,
        description,
        categories: {
          set: [],
          connect: categoriesToCreate
        },
        makeId: make,
        images: {
          deleteMany: {}
        },
        isFeatured,
        isArchived,
      }
    });

    const product = await prismadb.product.update({
      where: {
        id: productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    })

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string, productId: string }> }
) {
  const { storeId, productId } = await params;
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 })
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 })
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
      }
    });

    return NextResponse.json(product);

  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


