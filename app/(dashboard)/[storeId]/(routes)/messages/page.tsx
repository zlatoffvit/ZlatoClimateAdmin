import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { MessageColumn } from "./components/MessageColumns";
import MessageClient from "./components/MesageClient";


const MessagesPage = async ({
  params
}: {
  params: Promise<{ storeId: string }>
}) => {
  const { storeId } = await params;
  const messages = await prismadb.message.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedMessages: MessageColumn[] = messages.map((item) => ({
    id: item.id,
    phone: item.phone,
    name: item.name,
    email: item.email,
    query: item.query,
    createdAt: format(item.createdAt, "HH:mm MMMM do, yyyy")
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MessageClient data={formattedMessages} />
      </div>
    </div>
  )
}

export default MessagesPage;
