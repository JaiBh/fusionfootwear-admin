"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Color, Product, Size, Unit } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import SizeSelect from "@/components/SizeSelect";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import { cn } from "@/lib/utils";
import NumberSelect from "@/components/NumberSelect";
import ProductSelect from "@/components/ProductSelect";

const formSchema = z.object({
  quantity: z
    .number()
    .min(
      1,
      "Please select the number of units you would like to add to this product line."
    ),
  productId: z.string().min(1, "Please select a product"),
  sizeId: z.string().min(1, "Please select a size for your product."),
  isArchived: z.boolean(),
});

interface UnitFormProps {
  initialData: Unit | null;
  sizes: Size[];
  products: (Omit<Product, "price"> & {
    color: Color;
    price: number;
  })[];
}

type UnitFormValues = z.infer<typeof formSchema>;

function UnitForm({ initialData, sizes, products }: UnitFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const title = initialData ? "Edit Unit(s)" : "Create Unit(s)";
  const desc = initialData
    ? "Edit existing unit"
    : "Add new unit(s) to product line";
  const toastMessage = initialData ? "Unit updated!" : "New unit(s) created!";
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          productId: initialData.productId,
          sizeId: initialData.sizeId,
          isArchived: initialData.isArchived,
          quantity: 1,
        }
      : {
          productId: searchParams.get("productId") || "",
          sizeId: "",
          isArchived: false,
          quantity: 1,
        },
  });

  const onSubmit = async (data: UnitFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const resp = await axios.patch(`/api/units/${params.unitId}`, data);
      } else {
        const array = Array.from({ length: data.quantity }, (_, i) => ({
          id: i + 1,
        }));
        array.forEach(async (item) => {
          const resp = await axios.post(`/api/units`, data);
        });
      }
      router.refresh();
      form.setValue("isArchived", false);
      form.setValue("sizeId", "");
      form.setValue("quantity", 1);
      toast.success(toastMessage);
    } catch (error: any) {
      if (error?.request?.status !== 500) {
        toast.error(error.request?.response);
      } else {
        toast.error("Something went wrong...");
      }
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const resp = await axios.delete(`/api/units/${params.unitId}`);
      router.refresh();
      toast.success("Unit deleted!");
      router.replace("/units");
    } catch (error) {
      toast.error("Oops, something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={alertOpen}
        action={onDelete}
        disabled={loading}
        setOpen={() => setAlertOpen(!alertOpen)}
        title="Are you sure you want to delete this unit?"
        desc="This action cannot be reversed. This will permanently delete this unit."
      ></AlertModal>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title={title} desc={desc}></PageTitle>

        {initialData && (
          <Button
            variant={"destructive"}
            disabled={loading}
            onClick={() => setAlertOpen(true)}
          >
            <Trash></Trash>
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[550px]"
        >
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ProductSelect
                    value={field.value ? field.value : ""}
                    onChange={(url) => field.onChange(url)}
                    products={products}
                  ></ProductSelect>
                </FormControl>
                <FormDescription>Select product.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sizeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <SizeSelect
                    value={field.value ? field.value : ""}
                    onChange={(url) => field.onChange(url)}
                    sizes={sizes}
                  ></SizeSelect>
                </FormControl>
                <FormDescription>
                  This is the size that the unit(s) will be.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!initialData && (
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className={cn(initialData && "")}>
                  <FormLabel>Number of units to add</FormLabel>
                  <FormControl>
                    <NumberSelect
                      value={field.value ? field.value : 1}
                      onChange={(num) => field.onChange(Number(num))}
                      min={1}
                      max={25}
                    ></NumberSelect>
                  </FormControl>
                  <FormDescription>
                    This is the total number of units you wish to add to the
                    selected product line.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="isArchived"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomCheckbox
                    value={field.value ? field.value : false}
                    label={"Archived"}
                    text={
                      "This product will not be visible to users in the store."
                    }
                    onChange={(value) => field.onChange(value === "true")}
                  ></CustomCheckbox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="font-bold">
            {initialData ? "Save Changes" : "Create Unit(s)"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default UnitForm;
