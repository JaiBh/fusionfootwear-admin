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
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { Category, ProductLine } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import CategorySelect from "@/components/CategorySelect";
import DepartmentSelect from "@/components/DepartmentSelect";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Product line name must be at minimum 2 characters")
    .max(50, "Product line name must be maximum 50 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  department: z.string().min(1, "Please select a sex."),
  isArchived: z.boolean(),
});

interface ProductLineFormProps {
  initialData:
    | (ProductLine & {
        category: Category;
      })
    | null;
  categories: Category[];
}

type ProductLineFormValues = z.infer<typeof formSchema>;

function ProductLineForm({ initialData, categories }: ProductLineFormProps) {
  const router = useRouter();
  const title = initialData ? "Edit Product Line" : "Create Product Line";
  const desc = initialData
    ? "Edit existing product line"
    : "Add a new product line";
  const toastMessage = initialData
    ? "Product line updated!"
    : "New product line created!";
  const [{ isLoading }, setLoadingAtom] = useLoadingAtom();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(initialData?.category);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      categoryId: "",
      department: "",
      isArchived: false,
    },
  });

  const onSubmit = async (data: ProductLineFormValues) => {
    try {
      setLoadingAtom({ isLoading: true });
      const departmentTypes = ["mens", "womens", "unisex"];
      if (!departmentTypes.includes(data.department)) {
        toast.error("Please select a valid department");
        return;
      }
      if (initialData) {
        await axios.patch(`/api/productLines/${params.productLineId}`, data);
      } else {
        await axios.post(`/api/productLines`, data);
      }
      router.refresh();
      router.replace("/productLines");
      toast.success(toastMessage);
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(
          error.response.data ||
            "Something went wrong... Only admins can be authorized for this action."
        );
      }
      if (error?.request?.status !== 500) {
        toast.error(error.request?.response);
      } else {
        toast.error("Something went wrong...");
      }
      setLoadingAtom({ isLoading: false });
    }
  };

  const onDelete = async () => {
    try {
      setLoadingAtom({ isLoading: true });

      await axios.delete(`/api/productLines/${params.productLineId}`);
      router.refresh();
      toast.success("Product Line deleted!");
      router.replace("/productLines");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(
          error.response.data ||
            "Something went wrong... Only admins can be authorized for this action."
        );
      } else {
        toast.error(
          "Make sure you have deleted all products using this product line, first."
        );
        console.log("Error deleting product-line", error);
      }

      setLoadingAtom({ isLoading: false });
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        action={onDelete}
        disabled={isLoading}
        setOpen={() => setOpen(!open)}
        title="Are you sure you want to delete this product line?"
        desc="This action cannot be reversed. This will permanently delete this product line, as long as no products are using it."
      ></AlertModal>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title={title} desc={desc}></PageTitle>

        {initialData && (
          <Button
            variant={"destructive"}
            disabled={isLoading}
            onClick={() => setOpen(true)}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Category name"
                    {...field}
                    className="border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is your category display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect
                    value={field.value ? field.value : ""}
                    onChange={(url) => {
                      if (url !== field.value) {
                        form.setValue("department", "");
                      }
                      setSelectedCategory(
                        categories.find((cat) => cat.id === url)
                      );
                      field.onChange(url);
                    }}
                    categories={categories}
                  ></CategorySelect>
                </FormControl>
                <FormDescription>
                  This is the category that your product will belong to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <DepartmentSelect
                    options={
                      selectedCategory
                        ? selectedCategory.department === "unisex"
                          ? ["mens", "womens", "unisex"]
                          : [selectedCategory?.department]
                        : ["mens", "womens", "unisex"]
                    }
                    value={field.value ? field.value : ""}
                    onChange={(url) => field.onChange(url)}
                  ></DepartmentSelect>
                </FormControl>
                <FormDescription>
                  This will determine if this product is shown in the men's
                  store, women's store (or both if unisex is selected).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      "This product line will not be visible to users in the store."
                    }
                    onChange={(value) => {
                      field.onChange(value === "true");
                    }}
                  ></CustomCheckbox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="font-bold">
            {initialData ? "Save Changes" : "Create Product Line"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default ProductLineForm;
