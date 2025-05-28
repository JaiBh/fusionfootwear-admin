import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import { format } from "date-fns";
import CategoryClient from "./components/ProductLineClient";

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
      <div className="flex items-center justify-between border-b">
        <PageTitle
          title={`Product Lines (${productLines.length})`}
          desc="Manage Product Lines for your store"
        ></PageTitle>
        <Button asChild>
          <Link href={`/productLines/new`} className="font-bold">
            + Add New
          </Link>
        </Button>
      </div>
      <CategoryClient data={formattedProductLines}></CategoryClient>
    </Container>
  );
}
export default ProductLinesPage;
