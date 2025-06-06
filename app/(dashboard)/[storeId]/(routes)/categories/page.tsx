import { Locale, format } from "date-fns";
import { uk, ru, enGB } from 'date-fns/locale'

import prismadb from "@/lib/prismadb";

import CategoryClient from "./components/CategoryClient";
import { CategoryColumn } from "./components/CategoryColumns";
import { getCurrentLocale } from "@/actions/getCurrentLocale";


interface DashboardPageProps {
  params: Promise<{storeId: string }>
};

const CategoriesPage: React.FC<DashboardPageProps> = async ({
  params,
}) => {

  const locale = await getCurrentLocale();
  const currentLocale: Locale = locale === 'uk' ? uk : locale === 'ru' ? ru : enGB;
  const { storeId } = await params;

  const categories = await prismadb.category.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy", { locale: currentLocale })
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default CategoriesPage;
