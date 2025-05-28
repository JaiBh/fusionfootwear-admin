import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import ProductLineForm from "./components/ProductLineForm";

async function CategoryPage({ params }: { params: { productLineId: string } }) {
  const productLine = await prismadb.productLine.findUnique({
    where: {
      id: params.productLineId,
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
