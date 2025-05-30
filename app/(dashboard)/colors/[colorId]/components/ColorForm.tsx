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
import { Color } from "@prisma/client";
import PageTitle from "@/components/PageTitle";
import { Trash } from "lucide-react";
import AlertModal from "@/components/AlertModal";
import { cn } from "@/lib/utils";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Color name must be at minimum 2 characters")
    .max(50, "Color name must be maximum 20 characters"),
  value: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: "Invalid hex color. Use a format like #FFF or #FFFFFF.",
  }),
});

interface ColorFormProps {
  initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>;

function ColorForm({ initialData }: ColorFormProps) {
  const router = useRouter();
  const title = initialData ? "Edit Color" : "Create Color";
  const desc = initialData ? "Edit existing color" : "Add a new color";
  const toastMessage = initialData ? "Color updated!" : "New color created!";
  const [{ isLoading }, setLoadingAtom] = useLoadingAtom();
  const [open, setOpen] = useState(false);
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoadingAtom({ isLoading: true });
      if (initialData) {
        await axios.patch(`/api/colors/${params.colorId}`, data);
      } else {
        await axios.post(`/api/colors`, data);
      }
      router.refresh();
      router.replace("/colors");
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

      await axios.delete(`/api/colors/${params.colorId}`);
      router.refresh();
      toast.success("Color deleted!");
      router.replace("/colors");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(
          error.response.data ||
            "Something went wrong... Only admins can be authorized for this action."
        );
      } else {
        toast.error(
          "Make sure you have deleted all products using this color, first."
        );
        console.log("Error deleting color", error);
      }

      setLoadingAtom({ isLoading: false });
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        disabled={isLoading}
        action={onDelete}
        setOpen={() => setOpen(!open)}
        title="Are you sure you want to delete this color?"
        desc="This action cannot be reversed. This will permanently delete this color, as long as no products are using this color."
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
                    placeholder="Color name"
                    {...field}
                    className="border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is your color display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center justify-between">
                    <span>Value</span>
                    <div
                      className={cn(
                        `bg-[${field.value}]`,
                        "size-4 rounded-[50%]"
                      )}
                    ></div>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Color value"
                    {...field}
                    className="border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is the hex value for the color.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="font-bold">
            {initialData ? "Save Changes" : "Create Color"}
          </Button>
        </form>
      </Form>
    </>
  );
}
export default ColorForm;
