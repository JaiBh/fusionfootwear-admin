import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/BillboardClient";
import { format } from "date-fns";
import RouteLink from "@/components/RouteLink";

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
      <div className="md:flex md:items-center md:justify-between border-b pb-4">
        <PageTitle
          title={`Billboards (${billboards.length})`}
          desc="Manage billboards for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/billboards/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <BillboardClient data={formattedBillboards}></BillboardClient>
    </Container>
  );
}
export default BillboardsPage;
