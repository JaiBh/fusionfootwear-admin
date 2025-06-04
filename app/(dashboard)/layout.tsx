import Navbar from "@/components/navbar/Navbar";

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Navbar></Navbar>
      <main>{children}</main>
    </div>
  );
}
export default layout;
