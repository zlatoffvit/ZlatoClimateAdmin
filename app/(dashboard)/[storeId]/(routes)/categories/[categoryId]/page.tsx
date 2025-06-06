import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/CategoryForm";
import RoleGate from "@/components/auth/RoleGate";
import { UserRole } from "@prisma/client";


interface CategoryPageProps {
  params: Promise<{ categoryId: string }>
}

const CategoryPage = async ({
  params
}: CategoryPageProps) => {
  const { categoryId } = await params;
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <CategoryForm 
            initialData={category} 
          />
        </RoleGate>
      </div>
    </div>
  )
}

export default CategoryPage;
