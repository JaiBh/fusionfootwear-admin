import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/BillboardForm";

async function BillboardPage({
  params,
}: {
  params: Promise<{ billboardId: string }>;
}) {
  const { billboardId } = await params;
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });
  return (
    <Container>
      <BillboardForm initialData={billboard}></BillboardForm>
    </Container>
  );
}
export default BillboardPage;
