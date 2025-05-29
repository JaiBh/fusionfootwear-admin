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
import { useEffect, useState } from "react";
import { Category, Color, Image, Product, ProductLine } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import AlertModal from "@/components/AlertModal";
import ColorSelect from "@/components/ColorSelect";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";
import CategorySelect from "@/components/CategorySelect";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import ProductLineSelect from "@/components/ProductLineSelect";
import DepartmentSelect from "@/components/DepartmentSelect";

const formSchema = z.object({
  productLineId: z.string().min(1, "Please select a product line."),
  name: z
    .string()
    .min(2, "Product name must be at minimum 2 characters.")
    .max(50, "Product name must be maximum 50 characters."),
  price: z.number().min(1, "Price must be at least 1"),
  desc: z.string().min(20, "Description must be at  least 20 characters"),
  categoryId: z.string().min(1, "Please select a category."),
  department: z.string().min(1, "Please select a department."),
  colorId: z.string().min(1, "Please select a color."),
  isArchived: z.boolean(),
  isFeatured: z.boolean(),
  images: z
    .object({ url: z.string() })
    .array()
    .min(2, "Please provide at least 2 images for the product."),
});

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        category: Category;
      })
    | null;
  categories: Category[];
  colors: Color[];
  productLines: (ProductLine & {
    category: Category;
  })[];
}

type ProductFormValues = z.infer<typeof formSchema>;

function ProductForm({
  initialData,
  categories,
  colors,
  productLines,
}: ProductFormProps) {
  const title = initialData ? "Edit Product" : "Create Product";
  const desc = initialData ? "Edit existing product" : "Add a new product";
  const toastMessage = initialData
    ? "Product updated!"
    : "New product created!";
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [archiveUnits, setArchiveUnits] = useState(false);
  const [unArchiveUnits, setUnArchiveUnits] = useState(false);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(initialData?.category);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData?.price)) }
      : {
          name: "",
          price: undefined,
          department: "",
          desc: "",
          categoryId: "",
          productLineId: "",
          colorId: "",
          isFeatured: false,
          isArchived: false,
          images: [],
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const departmentTypes = ["Male", "Female", "Unisex"];
      if (!departmentTypes.includes(data.department)) {
        toast.error("Please select a valid department");
        return;
      }
      if (initialData) {
        await axios.patch(`/api/products/${params.productId}`, data);
        if (archiveUnits) {
          await axios.patch("/api/units", {
            action: "archive",
            productId: initialData.id,
          });
        }
        if (unArchiveUnits) {
          await axios.patch("/api/units", {
            action: "unarchive",
            productId: initialData.id,
          });
        }
      } else {
        await axios.post(`/api/products`, data);
      }
      router.refresh();
      router.replace("/products");
      toast.success(toastMessage);
    } catch (error: any) {
      if (error?.request?.status !== 500) {
        toast.error(error.request?.response);
      } else {
        toast.error("Something went wrong...");
      }
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${params.productId}`);
      router.refresh();
      toast.success("Product deleted!");
      router.replace("/products");
    } catch (error) {
      toast.error("Something went wrong...");
      console.log("Error deleting product", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <AlertModal
        isOpen={open}
        action={onDelete}
        disabled={loading}
        setOpen={() => setOpen(!open)}
        title="Are you sure you want to delete this product?"
        desc="This action cannot be reversed. This will permanently delete this product."
      ></AlertModal>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title={title} desc={desc}></PageTitle>

        {initialData && (
          <Button
            variant={"destructive"}
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash></Trash>
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[550px] pb-10"
        >
          <FormField
            control={form.control}
            name="productLineId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Line</FormLabel>
                <FormControl>
                  <ProductLineSelect
                    value={field.value ? field.value : ""}
                    onChange={(url) => {
                      const selectedProductLine = productLines.filter(
                        (line) => line.id === url
                      )[0];
                      form.setValue("name", selectedProductLine.name);
                      form.setValue(
                        "department",
                        selectedProductLine.department
                      );
                      form.setValue(
                        "categoryId",
                        selectedProductLine.categoryId
                      );
                      field.onChange(url);
                    }}
                    productLines={productLines}
                  ></ProductLineSelect>
                </FormControl>
                <FormDescription>
                  This is the product line that your product will belong to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div
            className={cn(
              "space-y-8",
              form.watch("productLineId") === "" && "hidden"
            )}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
                      disabled={true}
                      {...field}
                      className="border-[2px] border-secondary"
                    />
                  </FormControl>
                  <FormDescription>This is your product name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your description here."
                      {...field}
                    ></Textarea>
                  </FormControl>
                  <FormDescription>
                    This is your product description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (dollars)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || undefined)
                      }
                      className="border-[2px] border-secondary"
                    />
                  </FormControl>
                  <FormDescription>This is your product price.</FormDescription>
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
                        setSelectedCategory(
                          categories.find((cat) => cat.id === url)
                        );
                        field.onChange(url);
                      }}
                      categories={categories}
                      disabled={true}
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
                          ? selectedCategory.department === "Unisex"
                            ? ["Male", "Female", "Unisex"]
                            : [selectedCategory?.department]
                          : ["Male", "Female", "Unisex"]
                      }
                      value={field.value ? field.value : ""}
                      onChange={(url) => field.onChange(url)}
                      disabled={true}
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
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <ColorSelect
                      value={field.value ? field.value : ""}
                      onChange={(url) => field.onChange(url)}
                      colors={colors}
                    ></ColorSelect>
                  </FormControl>
                  <FormDescription>
                    This is the color that your product will belong be.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomCheckbox
                      value={field.value ? field.value : false}
                      label={"Featured"}
                      text={"This product will appear on the home page."}
                      onChange={(value) => field.onChange(value === "true")}
                    ></CustomCheckbox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
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
                        onChange={(value) => {
                          field.onChange(value === "true");
                        }}
                      ></CustomCheckbox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {initialData && (
                <CustomCheckbox
                  value={archiveUnits}
                  label="Archive all units"
                  disabled={unArchiveUnits === true}
                  text="This will archive all units under this product-line that are not already archived."
                  onChange={(value) => setArchiveUnits(value === "true")}
                ></CustomCheckbox>
              )}
              {initialData && (
                <CustomCheckbox
                  value={unArchiveUnits}
                  disabled={archiveUnits === true}
                  label="Un-archive all units"
                  text="This will un-archive all units under this product-line that are currently archived."
                  onChange={(value) => setUnArchiveUnits(value === "true")}
                ></CustomCheckbox>
              )}
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      disabled={loading}
                      onChange={(url) => {
                        const currentValues = form.getValues("images") || []; // Get the latest value directly from the form
                        form.setValue("images", [...currentValues, { url }], {
                          shouldValidate: true,
                        });
                      }}
                      onRemove={(url) => {
                        const currentValues = form.getValues("images") || [];
                        form.setValue(
                          "images",
                          currentValues.filter((image) => image.url !== url),
                          { shouldValidate: true }
                        );
                      }}
                    ></ImageUpload>
                  </FormControl>
                  <FormDescription>
                    These images will be displayed on the product page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="font-bold w-full">
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default ProductForm;
