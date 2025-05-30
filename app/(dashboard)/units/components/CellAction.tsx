"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnitColumn } from "./Columns";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import AlertModal from "@/components/AlertModal";
import { useState, useTransition } from "react";
import { useLoadingAtom } from "@/features/global/store/useLoadingAtom";

interface CellActionProps {
  data: UnitColumn;
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
      router.push(`units/${data.id}`);
    });
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/units/${data.id}`);
      router.refresh();
      toast.success("Unit deleted!");
      setOpen(false);
    } catch (error) {
      toast.error("Oops, something went wrong.");
      console.log("Error deleting unit", error);
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
        title="Are you sure you want to delete this unit?"
        desc="This action cannot be reversed. This will permanently delete this unit."
      ></AlertModal>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis className="size-4"></Ellipsis>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={onUpdate}>Edit unit</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-700"
          >
            Delete unit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
export default CellAction;
