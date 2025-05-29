import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/CategoryForm";

async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
  });
  return (
    <Container>
      <CategoryForm
        initialData={category}
        billboards={billboards}
      ></CategoryForm>
    </Container>
  );
}
export default CategoryPage;
