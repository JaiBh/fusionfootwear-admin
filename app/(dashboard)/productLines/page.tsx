import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import CategoryClient from "./components/ProductLineClient";
import RouteLink from "@/components/RouteLink";

async function ProductLinesPage() {
  const productLines = await prismadb.productLine.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProductLines = productLines.map((item) => {
    return {
      id: item.id,
      name: item.name,
      category: item.category.name,
      department: item.department,
      isArchived: item.isArchived,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <Container>
      <div className="md:flex pb-4 md:items-center md:justify-between border-b">
        <PageTitle
          title={`Product Lines (${productLines.length})`}
          desc="Manage Product Lines for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/productLines/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <CategoryClient data={formattedProductLines}></CategoryClient>
    </Container>
  );
}
export default ProductLinesPage;
