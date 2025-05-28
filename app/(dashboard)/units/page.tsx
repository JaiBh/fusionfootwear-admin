import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import { format } from "date-fns";
import UnitClient from "./components/UnitClient";

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
      <div className="flex items-center justify-between border-b">
        <PageTitle
          title={`Units (${units.length})`}
          desc="Manage product units for your store"
        ></PageTitle>
        <Button asChild>
          <Link href={`/units/new`} className="font-bold">
            + Add New
          </Link>
        </Button>
      </div>
      <UnitClient data={formattedUnits}></UnitClient>
    </Container>
  );
}
export default UnitsPage;
