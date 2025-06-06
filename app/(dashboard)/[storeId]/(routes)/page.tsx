import { CreditCard, Package } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  { RubFormatter } from "@/lib/utils";
import { getTotalRevenue } from "@/app/actions/getTotalRevenue";
import { getSalesCount } from "@/app/actions/getSalesCount";
import { getStockCount } from "@/app/actions/getStockCount";
import Overview from "@/components/Overview";
import { getGraphRevenue } from "@/app/actions/getGraphRevenue";
import initTranslations from "@/lib/i18n/i18n";
import { cookies } from "next/headers";


interface DashboardPageProps {
  params: Promise<{storeId: string }>
};

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params
}) => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ru'; 
  const { storeId } = await params;
  const { t } = await initTranslations({
    locale,
    namespaces: ['dashboard']
  })

  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading 
          title={t('dashboard')}
          description={t('description')}
        />
        <Separator />
        <div className="grid gap-4 grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('total_revenue')}
              </CardTitle>
              {t('rub')}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {RubFormatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('sales')}
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{salesCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('products_in_stock')}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t('overview')}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage;
