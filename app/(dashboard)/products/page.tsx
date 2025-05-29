import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import ProductClient from "./components/ProductClient";
import RouteLink from "@/components/RouteLink";

async function ProductsPage() {
  const products = await prismadb.product.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    include: {
      category: true,
      color: true,
      units: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts = products.map((item) => {
    return {
      id: item.id,
      name: item.name,
      price: item.price.toNumber(),
      units: item.units.length,
      department: item.department,
      isArchived: item.isArchived.toString(),
      isFeatured: item.isFeatured.toString(),
      color: item.color.name,
      colorValue: item.color.value,
      category: item.category.name,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <Container>
      <div className="md:lex md:items-center md:justify-between border-b pb-4">
        <PageTitle
          title={`Products (${products.length})`}
          desc="Manage products for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/products/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <ProductClient data={formattedProducts}></ProductClient>
    </Container>
  );
}
export default ProductsPage;
