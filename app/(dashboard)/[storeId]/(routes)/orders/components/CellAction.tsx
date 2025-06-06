"use client";

import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/AlertModal";
import { OrderColumn } from "./OrderColumns";


interface CellActionsProps {
  data: OrderColumn
}

const CellAction: React.FC<CellActionsProps> = ({
  data
}) => {
  const router = useRouter();
  const params = useParams();

  const { data: session } = useSession();
  const userId = session?.user.id;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      // Start loading indicator
      document.body.style.cursor = 'wait';
    } else {
      // Reset loading indicator
      document.body.style.cursor = 'auto';
    }
  }, [loading]);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Order Id copied to the clipboard.");
  };

  const onDelete = async () => {
    if (userId) {
      try {
        setLoading(true);
        await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
        router.refresh();
        toast.success("Order deleted.")
      } catch (error) {
        toast.error("Something went wrong.")
      } finally {
        setLoading(false)
        setOpen(false)
      }
   } else {
    redirect("/auth/sign-in")
   }
  };

  return (
    <>
    <AlertModal 
      isOpen={open}
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Opne menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4"/>
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/orders/${data.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default CellAction;
