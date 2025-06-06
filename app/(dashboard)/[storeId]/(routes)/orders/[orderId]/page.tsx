import prismadb from "@/lib/prismadb"
import OrderDetails from "./components/OrderDetails";
import { OrderItemColumn, columns } from "./components/OrderItemColumn";
import { DataTable } from "@/components/ui/data-table";
import OrderStatus from "./components/OrderStatus";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";
import { EuroFormatter, priceInRUB, UsdFormatter,  } from "@/lib/utils";
import getExchangeRates, { ExchangeRate } from "@/actions/getExchangeRate";
import initTranslations from "@/lib/i18n/i18n";
import Currency from "@/components/ui/Currency";
import { cookies } from "next/headers";


const OrderPage = async ({
  params
}: {
  params: Promise<{ orderId: string }>
}) => {
  const { orderId } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru'; 
  const { t } = await initTranslations({
    locale: locale,
    namespaces: ['orders']
  });

  const order = await prismadb.order.findUnique({
    where: {
      id: orderId
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
      },
    },
  });

  const formattedOrderItem: OrderItemColumn[] = order!.orderItems.map((item) => ({
    productName: item.product.name,
    productPower: item.product.power,
    productMarking: item.product.marking,
    productMake: item.product.make.name,
    productPrice: item.product.make.id === "868d064a-979c-4c09-b55a-68011a1ee0db" 
      ? EuroFormatter.format(item.product.price.toNumber())
      : UsdFormatter.format(item.product.price.toNumber()),
    quantity: Number(item.quantity),
    totalPrice: item.product.make.id === "868d064a-979c-4c09-b55a-68011a1ee0db" 
      ? EuroFormatter.format(item.product.price.toNumber() * Number(item.quantity))
      : UsdFormatter.format(item.product.price.toNumber() * Number(item.quantity)),
  }));

  const exchangeRates: ExchangeRate = await getExchangeRates();

  return (
    <div className="p-10">
      <RoleGate allowedRole={UserRole.ADMIN}>
        {order &&
        <>
          <OrderDetails 
            id={order!.id}
            createdAt={order!.createdAt}
            name={order!.name}
            email={order!.email}
            phone={order!.phone}
            address={order!.address}
          />
          <div className="sm:flex flex-row justify-between my-5">
            <div className="flex justify-between space-x-5 items-center">
              <h1 className="font-semibold text-lg">{t('grand_total')}:</h1>
              <Currency value={order.orderItems.reduce((total, item) => {
                  return total + Number(priceInRUB(item.product.id, (Number(item.product.price) * Number(item.quantity)).toString(), exchangeRates.rates))
                }, 0 )} />
            </div>
            <OrderStatus status={order.status} isPaid={order.isPaid} />
          </div>
          <DataTable searchKey="productName" columns={columns} data={formattedOrderItem} />
        </>}
      </RoleGate>
    </div>
  )
}

export default OrderPage;