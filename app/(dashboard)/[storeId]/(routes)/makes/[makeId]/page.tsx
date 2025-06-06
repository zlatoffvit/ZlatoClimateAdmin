import prismadb from "@/lib/prismadb";
import MakeForm from "./components/MakeForm";
import { UserRole } from "@prisma/client";
import RoleGate from "@/components/auth/RoleGate";


const MakePage = async ({
  params
}: {
  params: Promise<{ makeId: string }>
}) => {
  const { makeId } = await params;
  
  const make = await prismadb.make.findUnique({
    where: {
      id: makeId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <MakeForm initialData={make} />
        </RoleGate>
      </div>
    </div>
  )
}

export default MakePage;
