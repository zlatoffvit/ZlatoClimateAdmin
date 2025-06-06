import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import SettingsForm from "./components/SettingsForm";
import { auth } from "@/auth";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";


interface SettingsPageProps {
  params: Promise<{
    storeId: string,
  }>
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
  params
}) => {
  const session = await auth();
  const userId = session?.user.id;
  const { storeId } = await params;

  if (!userId) {
    redirect("/auth/login");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId
    }
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <SettingsForm initialData={store} />
        </RoleGate>
      </div>
    </div>
  )
}

export default SettingsPage;
