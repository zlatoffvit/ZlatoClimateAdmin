import prismadb from "@/lib/prismadb"
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";
import MessageDetails from "./components/MessageDetails";


const MessagePage = async ({
  params
}: {
  params: Promise<{ messageId: string }>
}) => {
  const { messageId } = await params;

  const message = await prismadb.message.findUnique({
    where: {
      id: messageId
    },
  });


  return (
    <div className="p-10">
      <RoleGate allowedRole={UserRole.ADMIN}>
        {message &&
          <MessageDetails
            id={message!.id}
            createdAt={message!.createdAt}
            name={message!.name}
            email={message!.email}
            phone={message!.phone}
            query={message!.query}
          />}
      </RoleGate>
    </div>
  )
}

export default MessagePage;