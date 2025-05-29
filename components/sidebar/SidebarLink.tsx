"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SheetClose } from "../ui/sheet";
import RouteLink from "../RouteLink";

interface SidebarLinkProps {
  text: string;
  href: string;
}

function SidebarLink({ text, href }: SidebarLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <RouteLink
      href={href}
      className={cn(
        "block transition-all rounded-r-lg",
        active
          ? "bg-primary text-primary-foreground font-bold"
          : "hover:bg-secondary hover:text-primary hover:font-bold"
      )}
    >
      <SheetClose
        className={cn(
          "w-full h-full px-2 py-3 transition-all text-start",
          active ? "px-4" : "hover:px-4"
        )}
      >
        {text}
      </SheetClose>
    </RouteLink>
  );
}
export default SidebarLink;
