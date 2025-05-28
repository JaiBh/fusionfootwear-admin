import { UserButton } from "@clerk/nextjs";
import StoreName from "./StoreName";
import Sidebar from "../sidebar/Sidebar";
import { ThemeToggle } from "../ThemeToggle";

function Navbar() {
  return (
    <nav className={"top-0 left-0 w-screen border-b bg-secondary z-10"}>
      <div className="flex justify-between items-center py-4 max-w-[1440px] mx-auto w-[90vw]">
        <div className="flex items-center gap-4">
          <Sidebar></Sidebar>
          <StoreName></StoreName>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle></ThemeToggle>
          <UserButton></UserButton>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
