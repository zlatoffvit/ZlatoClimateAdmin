"use client";

import { useTranslation } from "react-i18next";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import { MessageColumn, columns } from "./MessageColumns";
import ApiList from "@/components/ui/ApiList";


interface MessageClientProps {
  data: MessageColumn[]
}

const MessageClient: React.FC<MessageClientProps> = ({
  data
}) => {
  const { t } = useTranslation(['dashboard']);
  return (
    <>
      <Heading 
        title={`${t('messages')} (${data.length})`}
        description={t('manage_messages')}
      />
      <Separator />
      <DataTable 
        searchKey="name" 
        columns={columns} 
        data={data} 
      />
      <Heading 
        title="API"
        description={t('api_calls')}
      />
      <Separator />
      <ApiList entityName="messages" entityIdName="messageId" />
    </>
  );
}

export default MessageClient;
