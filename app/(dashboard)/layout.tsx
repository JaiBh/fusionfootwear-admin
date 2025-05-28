import Navbar from "@/components/navbar/Navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function layout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Navbar></Navbar>
      <main>{children}</main>
    </div>
  );
}
export default layout;
