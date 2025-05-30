import SidebarLink from "./SidebarLink";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import prismadb from "@/lib/prismadb";

async function Sidebar() {
  const store = await prismadb.store.findUnique({
    where: {
      id: process.env.STORE_ID,
    },
  });
  return (
    <Sheet>
      <SheetTrigger>
        <Menu></Menu>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>{store?.name || "FusionFootwear"}</SheetTitle>
        </SheetHeader>
        <div className="mt-8">
          <SidebarLink href={"/"} text="Overview"></SidebarLink>
          <SidebarLink href={"/billboards"} text="Billboards"></SidebarLink>
          <SidebarLink href={"/categories"} text="Categories"></SidebarLink>
          <SidebarLink href={"/colors"} text="Colors"></SidebarLink>
          <SidebarLink href={"/sizes"} text="Sizes"></SidebarLink>
          <SidebarLink
            href={"/productLines"}
            text="Product Lines"
          ></SidebarLink>
          <SidebarLink href={"/products"} text="Products"></SidebarLink>
          <SidebarLink href={"/units"} text="Units"></SidebarLink>
          <SidebarLink href={"/orders"} text="Orders"></SidebarLink>
          <SidebarLink href={"/settings"} text="Settings"></SidebarLink>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default Sidebar;
