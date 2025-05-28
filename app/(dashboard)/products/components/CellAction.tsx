"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductColumn } from "./Columns";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AlertModal from "@/components/AlertModal";
import { useState } from "react";

interface CellActionProps {
  data: ProductColumn;
}

function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onUpdate = () => {
    router.push(`products/${data.id}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/products/${data.id}`);
      router.refresh();
      toast.success("Product deleted!");
      setOpen(false);
    } catch (error) {
      toast.error("Oops, something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const onAddStock = async () => {
    router.push(`units/new?productId=${data.id}`);
  };

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Product Id copied to clipboard.");
  };

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
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis className="size-4"></Ellipsis>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={onUpdate}>Edit Product</DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy}>Copy ID</DropdownMenuItem>
          <DropdownMenuItem onClick={onAddStock}>
            Add units to Product
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-700"
          >
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default CellAction;
