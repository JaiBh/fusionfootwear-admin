"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColorColumn } from "./Columns";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AlertModal from "@/components/AlertModal";
import { useState, useTransition } from "react";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

interface CellActionProps {
  data: ColorColumn;
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
      router.push(`colors/${data.id}`);
    });
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/colors/${data.id}`);
      router.refresh();
      toast.success("Color deleted!");
      setOpen(false);
    } catch (error) {
      toast.error(
        "Make sure you have deleted all products using this color, first."
      );
      console.log("Error deleting color", error);
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
        title="Are you sure you want to delete this color?"
        desc="This action cannot be reversed. This will permanently delete this color, as long as no products are using it."
      ></AlertModal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis className="size-4"></Ellipsis>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={onUpdate}>Edit Color</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-700"
          >
            Delete Color
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default CellAction;
