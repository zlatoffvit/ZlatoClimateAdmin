"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

import { Category } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirect, useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import CreatedOrUpdated from "@/components/CreatedOrUpdated";
import { useTranslation } from "react-i18next";
import ImageUpload from "@/components/ui/ImageUpload";


const formSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData
}) => {
  const { t } = useTranslation(['dashboard']);
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? t('edit_category') : t('create_category');
  const description = initialData ? t('edit_category') : t('add_category');
  const toastMessage = initialData ? t('category_updated') : t('category_created');
  const action = initialData ? t('save_changes') : t('create');

  const { data: session } = useSession();
  const userId = session?.user.id;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      imageUrl: '',
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    if (userId) {
      try {
          setLoading(true);
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, {...data, userId});
        } else {
          await axios.post(`/api/${params.storeId}/categories`, {...data, userId});
        }
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success(toastMessage);
      } catch (error) {
        console.error(error)
        toast.error("Something went wrong.")
      } finally {
        setLoading(false)
      }
    } else {
      redirect("/auth/login")
    }
  };

  const onDelete = async () => {
    if (userId) {
      try {
          setLoading(true);
        await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success("Category deleted.")
      } catch (error) {
        console.error(error)
        toast.error("Make sure you removed all products using this category first.")
      } finally {
        setLoading(false)
        setOpen(false)
      }
   } else {
    redirect("/auth/login")
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
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {initialData && session?.user?.name && (
            <CreatedOrUpdated
              name={session?.user?.name}
              createdAt={initialData?.createdAt}
              updatedAt={initialData?.updatedAt}
            />
          )}
          <FormField 
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('background_image')}</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            disabled={loading} 
            className="ml-auto" 
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}

export default CategoryForm
