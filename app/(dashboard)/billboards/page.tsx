import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import BillboardClient from "./components/BillboardClient";
import { format } from "date-fns";

async function BillboardsPage() {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards = billboards.map((item) => {
    return {
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <Container>
      <div className="flex items-center justify-between border-b">
        <PageTitle
          title={`Billboards (${billboards.length})`}
          desc="Manage billboards for your store"
        ></PageTitle>
        <Button asChild>
          <Link href={`/billboards/new`} className="font-bold">
            + Add New
          </Link>
        </Button>
      </div>
      <BillboardClient data={formattedBillboards}></BillboardClient>
    </Container>
  );
}
export default BillboardsPage;
