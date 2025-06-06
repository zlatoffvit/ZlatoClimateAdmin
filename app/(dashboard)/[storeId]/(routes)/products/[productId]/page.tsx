import prismadb from "@/lib/prismadb";
import ProductForm from "./components/ProductForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";


const ProductPage = async ({
  params
}: {
  params: Promise<{ productId: string, storeId: string }>
}) => {
  const { productId, storeId } = await params;

  const product = await prismadb.product.findUnique({
    where: {
      id: productId
    },
    include: {
      images: true,
      make: true,
      categories: true
    }
  });

  const makes = await prismadb.make.findMany({
    where: {
      storeId: storeId
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <ProductForm 
            initialData={product}
            makes={makes}
            categories={categories}
          />
        </RoleGate>
      </div>
    </div>
  )
}

export default ProductPage;
