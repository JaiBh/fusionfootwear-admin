import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import SizeForm from "./components/SizeForm";

async function SizePage({ params }: { params: { sizeId: string } }) {
  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <Container>
      <SizeForm initialData={size}></SizeForm>
    </Container>
  );
}
export default SizePage;
