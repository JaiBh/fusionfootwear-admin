import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";

async function SizePage({ params }: { params: Promise<{ sizeId: string }> }) {
  const { sizeId } = await params;
  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });
  return (
    <Container>
      <SizeForm initialData={size}></SizeForm>
    </Container>
  );
}
export default SizePage;
