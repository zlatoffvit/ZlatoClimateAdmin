import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import MakeClient from "./components/MakeClient";
import { MakeColumn } from "./components/MakeColumns";



const MakesPage = async ({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;

  const makes = await prismadb.make.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedMakes: MakeColumn[] = makes.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MakeClient data={formattedMakes} />
      </div>
    </div>
  )
}

export default MakesPage;
