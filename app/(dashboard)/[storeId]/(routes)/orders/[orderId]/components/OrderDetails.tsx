"use client";

import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";


interface OrderFormProps {
  id: string,
  createdAt: Date,
  name: string,
  email: string,
  phone: string,
  address: string,
}

const OrderDetails: React.FC<OrderFormProps> = ({
  id,
  createdAt,
  name,
  email,
  phone,
  address
}) => {
  const { t } = useTranslation(['orders']);

  return (
    <>
      <div className="sm:flex text-sm md:text-lg lg:text-xl flex-row justify-between pb-5 items-center">
        <div className="flex space-x-5">
          <h1 className="font-bold">{t('order_id')}:</h1>
          <p>{id}</p>
        </div>
        <div className="flex space-x-3">
          <h1 className="font-bold">{t('created')}:</h1>
          <i>{format(createdAt, "MMMM do, yyyy")}</i>
        </div>
      </div>
      <Separator />
      <div className="sm:flex text-xs md:text-sm lg:text-lg flex-row justify-between my-5 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between mr-10">
          <Heading
            title={name}
            description={t('order_details')}
            className="text-lg md:text-xl lg:text-2xl"
            />
          <div className=" flex-col sm:w-1/3">
            <h1>{t('email')}: {email}</h1>
            <h1>{t('phone')}: {phone}</h1>
          </div>
          <div className="flex-col sm:w-1/4 text-start">
            <h1>{t('address')}:</h1>
            <div>
              {address}
            </div>
          </div>
        </div>
      </div>
      <Separator />
    </>
  )
}

export default OrderDetails;
