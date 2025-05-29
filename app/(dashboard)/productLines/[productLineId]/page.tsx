import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import ProductLineForm from "./components/ProductLineForm";

async function CategoryPage({
  params,
}: {
  params: Promise<{ productLineId: string }>;
}) {
  const { productLineId } = await params;
  const productLine = await prismadb.productLine.findUnique({
    where: {
      id: productLineId,
    },
    include: {
      category: true,
    },
  });
  const categories = await prismadb.category.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
  });
  return (
    <Container>
      <ProductLineForm
        initialData={productLine}
        categories={categories}
      ></ProductLineForm>
    </Container>
  );
}
export default CategoryPage;
