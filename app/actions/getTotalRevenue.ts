import prismadb from "@/lib/prismadb"


export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  const totalRevenue: number = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + (item.product.price.toNumber() * item.quantity);
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalRevenue;
};