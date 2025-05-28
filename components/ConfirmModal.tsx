"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  title: string;
  desc?: string;
  isOpen: boolean;
  setOpen: () => void;
  action: () => void;
  disabled?: boolean;
}

function ConfirmModal({
  isOpen,
  setOpen,
  action,
  title,
  desc,
  disabled,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
          <Button
            variant={"default"}
            className="font-bold"
            onClick={action}
            disabled={disabled}
          >
            Confirm
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default ConfirmModal;
