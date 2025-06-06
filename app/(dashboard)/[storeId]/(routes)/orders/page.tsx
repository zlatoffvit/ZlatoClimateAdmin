import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import OrderClient from "./components/OrderClient";
import { OrderColumn } from "./components/OrderColumns";


const OrdersPage = async ({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;
  const orders = await prismadb.order.findMany({
    where: {
      storeId: storeId
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              make: true
            }
          },
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    name: item.name,
    products: item.orderItems.map((orderItem) => orderItem.product.make.name + " " + orderItem.product.marking).join(', '),
    quantities: item.orderItems.map((orderItem) => orderItem.quantity).join(', '),
    isPaid: item.isPaid,
    status: item.status,
    totalPrice: item.totalPrice,
    createdAt: format(item.createdAt, "HH:mm MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage;
