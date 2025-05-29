import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import ColorForm from "./components/ColorForm";

async function ColorPage({ params }: { params: Promise<{ colorId: string }> }) {
  const { colorId } = await params;
  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });
  return (
    <Container>
      <ColorForm initialData={color}></ColorForm>
    </Container>
  );
}
export default ColorPage;
