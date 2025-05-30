"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LoadingSpinner({ size }: { size?: string }) {
  return (
    <div className="flex items-center justify-center h-full w-full p-4">
      <motion.div
        className={cn(
          "border-4 border-t-transparent border-blue-500 rounded-full",
          size ? `w-${size} h-${size}` : "w-12 h-12 "
        )}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
    </div>
  );
}
