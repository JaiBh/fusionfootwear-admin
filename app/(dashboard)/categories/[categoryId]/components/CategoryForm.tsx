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
import { Billboard, Category } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import BillboardSelect from "@/components/BillboardSelect";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import DepartmentSelect from "@/components/DepartmentSelect";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at minimum 2 characters")
    .max(50, "Category name must be maximum 50 characters"),
  billboardMaleId: z.string().optional(),
  billboardFemaleId: z.string().optional(),
  department: z.string().min(1, "Please select a sex."),
  isArchived: z.boolean(),
});

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

type CategoryFormValues = z.infer<typeof formSchema>;

function CategoryForm({ initialData, billboards }: CategoryFormProps) {
  const router = useRouter();
  const title = initialData ? "Edit Category" : "Create Category";
  const desc = initialData ? "Edit existing category" : "Add a new category";
  const toastMessage = initialData
    ? "Category updated!"
    : "New category created!";
  const [{ isLoading }, setLoadingAtom] = useLoadingAtom();
  const [open, setOpen] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          billboardMaleId: initialData?.billboardMaleId || undefined,
          billboardFemaleId: initialData?.billboardFemaleId || undefined,
        }
      : {
          name: "",
          billboardMaleId: "",
          billboardFemaleId: "",
          department: "",
          isArchived: false,
        },
  });

  const showMaleBillboardSelect =
    form.watch("department") === "mens" ||
    form.getValues().department === "unisex";
  const showFemaleBillboardSelect =
    form.watch("department") === "womens" ||
    form.getValues().department === "unisex";

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoadingAtom({ isLoading: true });
      const departmentTypes = ["mens", "womens", "unisex"];
      if (!departmentTypes.includes(data.department)) {
        toast.error("Please select a valid department");
        setLoadingAtom({ isLoading: false });

        return;
      }
      if (data.department === "mens") {
        if (!data.billboardMaleId) {
          toast.error("Please select a billboard for the men's store.");
          setLoadingAtom({ isLoading: false });

          return;
        }
        data = { ...data, billboardFemaleId: undefined };
      }
      if (data.department === "womens") {
        if (!data.billboardFemaleId) {
          toast.error("Please select a billboard for the women's store.");
          setLoadingAtom({ isLoading: false });

          return;
        }
        data = { ...data, billboardMaleId: undefined };
      }
      if (data.department === "unisex") {
        if (!data.billboardFemaleId || !data.billboardMaleId) {
          toast.error(
            "Please select a billboard for both the men's and women's store."
          );
          setLoadingAtom({ isLoading: false });

          return;
        }
      }

      if (initialData) {
        await axios.patch(`/api/categories/${params.categoryId}`, data);
      } else {
        await axios.post(`/api/categories`, data);
      }
      router.refresh();
      router.replace("/categories");
      toast.success(toastMessage);
    } catch (error: any) {
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

      await axios.delete(`/api/categories/${params.categoryId}`);
      router.refresh();
      toast.success("Category deleted!");
      router.replace("/categories");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(
          error.response.data ||
            "Something went wrong... Only admins can be authorized for this action."
        );
      } else {
        toast.error(
          "Make sure you have deleted all products using this category, first."
        );
        console.log("Error deleting category", error);
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
        title="Are you sure you want to delete this category?"
        desc="This action cannot be reversed. This will permanently delete this category, as long as no products are using this category."
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <DepartmentSelect
                    value={field.value ? field.value : ""}
                    onChange={(url) => {
                      field.onChange(url);
                    }}
                  ></DepartmentSelect>
                </FormControl>
                <FormDescription>
                  This will determine if this category is shown in the men's
                  store, women's store (or both if unisex is selected).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {showMaleBillboardSelect && (
            <FormField
              control={form.control}
              name="billboardMaleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard for men's store</FormLabel>
                  <FormControl>
                    <BillboardSelect
                      value={field.value ? field.value : ""}
                      onChange={(url) => field.onChange(url)}
                      billboards={billboards}
                    ></BillboardSelect>
                  </FormControl>
                  <FormDescription>
                    This is the billboard that will be displayed on the category
                    page for the men's store.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {showFemaleBillboardSelect && (
            <FormField
              control={form.control}
              name="billboardFemaleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard for women's store</FormLabel>
                  <FormControl>
                    <BillboardSelect
                      value={field.value ? field.value : ""}
                      onChange={(url) => field.onChange(url)}
                      billboards={billboards}
                    ></BillboardSelect>
                  </FormControl>
                  <FormDescription>
                    This is the billboard that will be displayed on the category
                    page for the women's store.
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
                      "This category will not be visible to users in the store."
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
            {initialData ? "Save Changes" : "Create Category"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default CategoryForm;
