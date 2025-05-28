"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SizeColumn } from "./Columns";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AlertModal from "@/components/AlertModal";
import { useState } from "react";

interface CellActionProps {
  data: SizeColumn;
}

function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onUpdate = () => {
    router.push(`sizes/${data.id}`);
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/sizes/${data.id}`);
      router.refresh();
      toast.success("Size deleted!");
      setOpen(false);
    } catch (error) {
      toast.error(
        "Make sure you have deleted all products using this size, first."
      );
    } finally {
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
        desc="This action cannot be reversed. This will permanently delete this size, as long as no products are using it."
      ></AlertModal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis className="size-4"></Ellipsis>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={onUpdate}>Edit Size</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-700"
          >
            Delete Size
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default CellAction;
