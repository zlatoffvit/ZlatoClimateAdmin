import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import ProductClient from "./components/ProductClient";
import { ProductColumn } from "./components/ProductColumns";
import { EuroFormatter, UsdFormatter } from "@/lib/utils";



const ProductsPage = async ({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;

  const products = await prismadb.product.findMany({
    where: {
      storeId: storeId
    },
    include: {
      categories: true,
      make: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: item.make.id === "868d064a-979c-4c09-b55a-68011a1ee0db" 
                              ? EuroFormatter.format(item.price.toNumber())
                              : UsdFormatter.format(item.price.toNumber()),
    make: item.make.name,
    marking: item.marking,
    power: item.power,
    categories: item.categories,
    description: item.description,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default ProductsPage;
