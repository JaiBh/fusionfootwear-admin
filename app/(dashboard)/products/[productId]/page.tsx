import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import ProductForm from "./components/ProductForm";

async function ProductPage({ params }: { params: { productId: string } }) {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      category: true,
    },
  });

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

  const categories = await prismadb.category.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
  });
  const colors = await prismadb.color.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
  });

  return (
    <Container>
      <ProductForm
        initialData={product}
        categories={categories}
        colors={colors}
        productLines={productLines}
      ></ProductForm>
    </Container>
  );
}
export default ProductPage;
