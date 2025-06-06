import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import prismadb from '@/lib/prismadb';
import { getCurrentLocale } from '@/actions/getCurrentLocale';
import Navbar from '@/components/Navbar';


async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>
}) {
  const session = await auth();
  const currentLocale = await getCurrentLocale();

  if (!session?.user) {
    redirect('/auth/login')
  }

  const { storeId } = await params;

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId: session?.user.id
    }
  });

  if (!store) {
    redirect('/');
  }

  // const orders = await prismadb.order.findMany({
  //   where: {
  //     storeId: store.id
  //   },
  //   orderBy: {
  //     createdAt: 'desc'
  //   }
  // });

  // const messages = await prismadb.message.findMany({
  //   where: {
  //     storeId: store.id
  //   },
  //   orderBy: {
  //     createdAt: 'desc'
  //   }
  // });

  // const newOrders: number = orders.reduce((total, order) => {
  //   return total + (order.status === "PENDING" ? 1 : 0);
  // }, 0);

  // const newMessages: number = messages.reduce((total) => {
  //   return total + 1;
  // }, 0);

  return (
    <>
      <Navbar locale={currentLocale} newOrders={0} newMessages={0} />
      {children}
    </>
  )
}

export default DashboardLayout

