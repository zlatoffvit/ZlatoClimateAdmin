"use client";

import * as z from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

import { Category, Image, Make, Product } from "@prisma/client";
import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { redirect, useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "@/components/ui/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea";
import CreatedOrUpdated from "@/components/CreatedOrUpdated";
import { useTranslation } from "react-i18next";


const formSchema = z.object({
  name: z.string().min(1),
  marking: z.string().min(1),
  power: z.string().min(1),
  make: z.string().min(1),
  description: z.string().min(10),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categories: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: Product & {
    images: Image[];
    categories: Category[];
  } | null;
  makes: Make[];
  categories: Category[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  makes,
  categories,
}) => {
  const { t } = useTranslation(['dashboard']);
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? t('edit_product') : t('create_product');
  const desc = initialData ? t('edit_product') : t('add_product');
  const toastMessage = initialData ? t('product_updated') : t('product_created');
  const action = initialData ? t('save_changes') : t('create');

  const { data: session } = useSession();
  const userId = session?.user.id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      categories: initialData?.categories.map((category) => category.id),
      price: parseFloat(String(initialData?.price)),
    } : {
      name: '',
      marking: '',
      power: '',
      make: '',
      description: '',
      images: [],
      price: 0,
      categories: [],
      isFeatured: false,
      isArchived: false,
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (userId) {
      try {
        setLoading(true);
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/products/${params.productId}`, {...data, userId});
        } else {
          await axios.post(`/api/${params.storeId}/products`, {...data, userId});
        }
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success(toastMessage);
      } catch (error) {
        console.error(error)
        toast.error(t('wrong'))
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
        await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success(t('product_deleted'))
      } catch (error) {
        console.error(error)
        toast.error(t('wrong'))
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
          description={desc}
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
          {initialData && session?.user?.name && <CreatedOrUpdated
            name={session?.user?.name}
            createdAt={initialData.createdAt!}
            updatedAt={initialData.updatedAt!}
          />}
          <FormField 
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('images')}</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
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
                    <Input disabled={loading} placeholder={t('product_name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('price')}</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="marking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('marking')}</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={loading} placeholder="marking..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('power')}</FormLabel>
                  <FormControl>
                    <Input type="text" disabled={loading} placeholder="power..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-around">
            <FormField 
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox 
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t('featured')}
                  </FormLabel>
                  <FormDescription>
                    {t('product_to_appear')}
                  </FormDescription>
                </div>
              </FormItem>
            )}
            />
            <FormField 
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      {t('archived')}
                    </FormLabel>
                    <FormDescription>
                      {t('product_not_to_appear')}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-10">
            <div className="flex justify-around">
              <FormField 
                control={form.control}
                name="categories"
                render={() => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <FormDescription className="mb-2">
                      {t('select_category')}
                    </FormDescription>                  
                    {categories.map((category) => (                
                      <FormField
                        key={category.id}
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={category.id}
                              className="flex flex-row p-2 rounded-md items-center space-x-3 space-y-0 h-6 hover:bg-gray-500 hover:text-black"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(category.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, category.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== category.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {category.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('makes')}</FormLabel>
                    <FormDescription className="mb-2">
                      {t('select_make')}
                    </FormDescription>    
                      <FormControl>  
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {makes.map((make) => (                
                            <FormItem
                              key={make.id}
                              className="flex flex-row p-2 rounded-md  items-center space-x-3 space-y-0 h-6 hover:bg-gray-500 hover:text-black"
                              >
                                <FormControl>
                                  <RadioGroupItem value={make.id}/>
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {make.name}
                                </FormLabel>
                            </FormItem>
                            )
                          )}
                        </RadioGroup>
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('product_desc')}</FormLabel>
                    <FormControl>
                      <Textarea disabled={loading} placeholder={t('awesome_product')} {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default ProductForm
