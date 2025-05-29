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

interface AlertModalProps {
  title: string;
  desc?: string;
  isOpen: boolean;
  disabled?: boolean;
  setOpen: () => void;
  action: () => void;
}

function AlertModal({
  isOpen,
  setOpen,
  action,
  title,
  desc,
  disabled,
}: AlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
          <Button
            variant={"destructive"}
            className="font-bold"
            onClick={action}
            disabled={disabled}
          >
            Delete
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default AlertModal;
