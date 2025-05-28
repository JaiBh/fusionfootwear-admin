import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import UnitForm from "./components/UnitForm";

async function CategoryPage({ params }: { params: { unitId: string } }) {
  const unit = await prismadb.unit.findUnique({
    where: {
      id: params.unitId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
  });
  const products = await prismadb.product.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    include: {
      color: true,
    },
  });

  const formattedProducts = products.map((product) => {
    return { ...product, price: Number(product.price) };
  });
  return (
    <Container>
      <UnitForm
        initialData={unit}
        sizes={sizes}
        products={formattedProducts}
      ></UnitForm>
    </Container>
  );
}
export default CategoryPage;
