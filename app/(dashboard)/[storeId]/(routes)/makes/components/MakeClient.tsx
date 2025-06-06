"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/ApiList";

import { MakeColumn, columns } from "./MakeColumns";
import { useTranslation } from "react-i18next";


interface MakesClientProps {
  data: MakeColumn[]
}

const MakesClient: React.FC<MakesClientProps> = ({
  data
}) => {
  const { t } = useTranslation(['dashboard']);
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`${t('makes')} (${data.length})`}
          description={t('manage_makes')}
        />
        <Button onClick={() => router.push(`/${params.storeId}/makes/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('add_new')}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading 
        title="API"
        description={t('api_calls')}
      />
      <Separator />
      <ApiList entityName="makes" entityIdName="makeId" />
    </>
  )
}

export default MakesClient
