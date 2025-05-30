"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BillboardColumn } from "./Columns";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AlertModal from "@/components/AlertModal";
import { useState, useTransition } from "react";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

interface CellActionProps {
  data: BillboardColumn;
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
      router.push(`billboards/${data.id}`);
    });
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/billboards/${data.id}`);
      router.refresh();
      toast.success("Billboard deleted!");
      setOpen(false);
    } catch (error) {
      toast.error(
        "Make sure you have deleted all categories using this billboard, first."
      );
      console.log("Error deleting billboard", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        action={onDelete}
        setOpen={() => setOpen(!open)}
        disabled={loading}
        title="Are you sure you want to delete this billboard?"
        desc="This action cannot be reversed. This will permanently delete this billboard, as long as no categories are using it."
      ></AlertModal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis className="size-4"></Ellipsis>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={onUpdate}>Edit Billboard</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-700"
          >
            Delete Billboard
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default CellAction;
