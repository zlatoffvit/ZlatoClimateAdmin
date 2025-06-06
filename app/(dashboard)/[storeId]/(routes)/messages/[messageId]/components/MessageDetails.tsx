"use client";

import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";


interface MessageFormProps {
  id: string,
  createdAt: Date,
  name: string,
  email?: string,
  phone: string,
  query: string,
}

const MessageDetails: React.FC<MessageFormProps> = ({
  id,
  createdAt,
  name,
  email,
  phone,
  query
}) => {
  const { t } = useTranslation(['messages']);

  return (
    <>
      <div className="sm:flex text-sm md:text-lg lg:text-xl flex-row justify-between pb-5 items-center">
        <div className="flex space-x-5">
          <h1 className="font-bold">{t('message_id')}:</h1>
          <p>{id}</p>
        </div>
        <div className="flex space-x-3">
          <h1 className="font-bold">{t('created')}:</h1>
          <i>{format(createdAt, "MMMM do, yyyy")}</i>
        </div>
      </div>
      <Separator />
      <div className="sm:flex text-xs md:text-sm lg:text-lg flex-row justify-between text-center my-5">
        <div className="text-start">
          <Heading
            title={name}
            description={t('message_details')}
            className="text-lg md:text-xl lg:text-2xl"
          />
        </div>
        <div className="flex flex-col sm:w-1/3 text-right ">
          <h1>{t('email')}: {email}</h1>
          <h1>{t('phone')}: {phone}</h1>
        </div>
      </div>
      <Separator />
      <div className="flex-col sm:w-1/4 mt-4 text-start">
        <h1>{t('query')}:</h1>
        <div>
          {query}
        </div>
      </div>
    </>
  )
}

export default MessageDetails;
