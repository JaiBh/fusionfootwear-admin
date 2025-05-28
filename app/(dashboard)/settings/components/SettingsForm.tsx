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
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Store name must be minimum 2 characters")
    .max(50, "Store name must be maximum 50 characters"),
});

function SettingsForm({ store }: { store: Store | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store?.name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const resp = await axios.patch(`/api/stores`, values);
      router.refresh();
      toast.success("Store updated!");
    } catch (error) {
      toast.error("Something went wrong...");
    } finally {
      setLoading(false);
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
          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
export default SettingsForm;
