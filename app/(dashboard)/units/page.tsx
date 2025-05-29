import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import UnitClient from "./components/UnitClient";
import RouteLink from "@/components/RouteLink";

async function UnitsPage() {
  const units = await prismadb.unit.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    include: {
      product: {
        select: {
          name: true,
          color: true,
        },
      },
      size: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedUnits = units.map((item) => {
    return {
      id: item.id,
      productName: item.product.name,
      productId: item.productId,
      color: item.product.color.name,
      size: item.size.name,
      isArchived: item.isArchived.toString(),
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <Container>
      <div className="md:flex md:items-center md:justify-between border-b pb-4">
        <PageTitle
          title={`Units (${units.length})`}
          desc="Manage product units for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/units/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <UnitClient data={formattedUnits}></UnitClient>
    </Container>
  );
}
export default UnitsPage;
