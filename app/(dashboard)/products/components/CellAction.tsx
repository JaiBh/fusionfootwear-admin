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
import { useState, useTransition } from "react";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

interface CellActionProps {
  data: ProductColumn;
}

function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [_, setLoadingAtom] = useLoadingAtom();

  const onUpdate = () => {
    setLoadingAtom({ isLoading: true });
    startTransition(() => {
      router.push(`products/${data.id}`);
    });
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
      console.log("Error deleting product", error);
    } finally {
      setLoading(false);
    }
  };

  const onAddStock = async () => {
    setLoadingAtom({ isLoading: true });
    startTransition(() => {
      router.push(`units/new?productId=${data.id}`);
    });
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
