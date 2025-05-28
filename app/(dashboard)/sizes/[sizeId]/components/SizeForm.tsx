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
import { Size } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Size name must be at minimum 1 character")
    .max(50, "Size name must be maximum 20 characters"),
  value: z
    .string()
    .min(1, "Size value must be at minimum 1 character")
    .max(50, "Size value must be maximum 20 characters"),
  department: z.string().min(1),
});

interface SizeFormProps {
  initialData: Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>;

function SizeForm({ initialData }: SizeFormProps) {
  const router = useRouter();
  const title = initialData ? "Edit size" : "Create size";
  const desc = initialData ? "Edit existing size" : "Add a new size";
  const toastMessage = initialData ? "Size updated!" : "New size created!";
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
      department: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);
      const departmentTypes = ["Male", "Female", "Unisex"];
      if (!departmentTypes.includes(data.department)) {
        toast.error("Please select a valid department");
        return;
      }
      if (initialData) {
        const resp = await axios.patch(`/api/sizes/${params.sizeId}`, data);
      } else {
        const resp = await axios.post(`/api/sizes`, data);
      }
      router.refresh();
      router.replace("/sizes");
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
      const resp = await axios.delete(`/api/sizes/${params.sizeId}`);
      router.refresh();
      toast.success("Size deleted!");
      router.replace("/sizes");
    } catch (error) {
      toast.error(
        "Make sure you have deleted all products using this size, first."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        action={onDelete}
        disabled={loading}
        setOpen={() => setOpen(!open)}
        title="Are you sure you want to delete this size?"
        desc="This action cannot be reversed. This will permanently delete this size, as long as no products are using this size."
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Size name"
                    {...field}
                    className="border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is your size display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Size value"
                    {...field}
                    className="border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is the value for the size.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger value={field.value}>
                      <SelectValue placeholder="Select department below" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={"Male"}>Men's</SelectItem>
                      <SelectItem value={"Female"}>Women's</SelectItem>
                      <SelectItem value={"Unisex"}>Both</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Is this size for men's or women's products or both?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading} className="font-bold">
            {initialData ? "Save Changes" : "Create Size"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default SizeForm;
