"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { redirect, useParams, useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatus as Status } from '@prisma/client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';


interface OrderStatusProps {
  status: Status
  isPaid: boolean
}

const OrderStatus: React.FC<OrderStatusProps> = ({
  status,
  isPaid
}) => {
  const { t } = useTranslation(['orders']);
  const params = useParams();
  const router = useRouter();
  
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [selectedIsPaid, setSelectedIsPaid] = useState(isPaid);
  const [loading, setLoading] = useState(false);

  const handleSelectStatusChange = (status: Status) => {
    setSelectedStatus(status);
  };

  const { data: session } = useSession();
  const userId = session?.user.id;

  const handleSubmit = async (selectedStatus: Status, selectedIsPaid: boolean) => {
    if (userId) {
      try {
        setLoading(true);
        await axios.patch(`/api/${params.storeId}/orders/${params.orderId}`, { selectedStatus, selectedIsPaid })
        router.refresh();
        toast.success("Order updated.")
        router.push(`/${params.storeId}/orders`);
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong.")
      } finally {
        setLoading(false)
      }
    } else {
      redirect("/auth/sign-in")
    }
  }

  return (
    <div>
      <Button
        disabled={loading || (selectedStatus === status && selectedIsPaid === isPaid)}
        onClick={() => handleSubmit(selectedStatus, selectedIsPaid)}
        className='w-full my-2 h-8'
      >
        {t('update_status')}
      </Button>
      <div className="flex justify-between items-center space-x-5">
        <h1 className="font-semibold text-lg">{t('status')}: </h1>
        <div className='w-fit'>
          <Select value={selectedStatus} onValueChange={handleSelectStatusChange}>
            <SelectTrigger   
              className={`${
                selectedStatus === 'PENDING'
                ? 'bg-red-300 dark:text-red-700'
                  : selectedStatus === 'APPROVED'
                  ? 'bg-yellow-300 dark:text-yellow-700'
                  : selectedStatus === 'SHIPPED'
                  ? 'bg-blue-300 dark:text-blue-700'
                  : selectedStatus === 'DELIVERED'
                  ? 'bg-green-300 dark:text-green-700'
                  : ''
                } border-none border-white rounded-sm h-8`}
                >
              <SelectValue defaultValue={selectedStatus} />
            </SelectTrigger>
            <SelectContent className='pr-2'>
              <SelectItem value="PENDING" className="bg-red-300 m-2 dark:text-red-500">{t('pending')}</SelectItem>
              <SelectItem value="APPROVED" className="bg-yellow-300 m-2 dark:text-yellow-700">{t('approved')}</SelectItem>
              <SelectItem value="SHIPPED" className="bg-blue-300 m-2 dark:text-blue-700">{t('shipped')}</SelectItem>
              <SelectItem value="DELIVERED" className="bg-green-300 m-2 dark:text-green-700">{t('delivered')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between items-center space-y-2">
        <h1>{t('paid')}:</h1>
        <div className={`${
              selectedIsPaid
              ? 'bg-green-300 dark:text-green-700'
              : 'bg-red-300 dark:text-red-700'}
              border-none border-white rounded-sm h-8 flex text-lg w-fit justify-between items-center px-2 space-x-8`}>
          <Switch
            checked={selectedIsPaid}
            onCheckedChange={() => setSelectedIsPaid(!selectedIsPaid)}
          />
          <Label htmlFor="isPaid">{selectedIsPaid ? t('yes') : t('no')}</Label>
        </div>
      </div>
    </div>
  )
}

export default OrderStatus;