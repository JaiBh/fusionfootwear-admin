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
import { Store } from "@prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be minimum 2 characters")
    .max(50, "Store name must be maximum 50 characters"),
});

function SettingsForm({ store }: { store: Store | null }) {
  const router = useRouter();
  const [{ isLoading }, setLoadingAtom] = useLoadingAtom();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store?.name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoadingAtom({ isLoading: true });
      await axios.patch(`/api/stores`, values);
      router.refresh();
      toast.success("Store updated!");
    } catch (error: any) {
      if (error.status === 401) {
        toast.error(
          error.response.data ||
            "Something went wrong... Only admins can be authorized for this action."
        );
      } else {
        toast.error("Something went wrong...");
        console.log("Error editing store name", error);
      }
    } finally {
      setLoadingAtom({ isLoading: false });
    }
  }

  return (
    <div className="py-6 border-b">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Store name"
                    {...field}
                    className="max-w-80 border-[2px] border-secondary"
                  />
                </FormControl>
                <FormDescription>
                  This is your store display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default SettingsForm;
