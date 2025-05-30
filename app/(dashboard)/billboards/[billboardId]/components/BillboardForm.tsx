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
import { Billboard } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import AlertModal from "@/components/AlertModal";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

const formSchema = z.object({
  label: z
    .string()
    .min(2, "Billboard label must be at minimum 2 characters")
    .max(50, "Billboard label must be maximum 50 characters"),
  imageUrl: z.string().min(1, "An image is required to create a Billboard"),
});

interface BillboardFormProps {
  initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;

function BillboardForm({ initialData }: BillboardFormProps) {
  const router = useRouter();
  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const desc = initialData ? "Edit existing billboard" : "Add a new billboard";
  const toastMessage = initialData
    ? "Billboard updated!"
    : "New billboard created!";
  const [open, setOpen] = useState(false);
  const [{ isLoading }, setLoadingAtom] = useLoadingAtom();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoadingAtom({ isLoading: true });
      if (initialData) {
        await axios.patch(`/api/billboards/${params.billboardId}`, data);
      } else {
        await axios.post(`/api/billboards`, data);
      }
      router.refresh();
      router.replace("/billboards");
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

      await axios.delete(`/api/billboards/${params.billboardId}`);
      router.refresh();
      toast.success("Billboard deleted!");
      router.replace("/billboards");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(
          error.response.data ||
            "Something went wrong... Only admins can be authorized for this action."
        );
      } else {
        toast.error("Something went wrong...");
        console.log("Error deleting billboard", error);
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
        title="Are you sure you want to delete this billboard?"
        desc="This action cannot be reversed. This will permanently delete this billboard, as long as no categories are using it."
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
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Billboard label"
                    {...field}
                    className="border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is your billboard display label.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onRemove={() => {
                      field.onChange("");
                    }}
                    onChange={(url) => field.onChange(url)}
                  ></ImageUpload>
                </FormControl>
                <FormDescription>
                  This will the image displayed on your billboard
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="font-bold">
            {initialData ? "Save Changes" : "Create Billboard"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default BillboardForm;
