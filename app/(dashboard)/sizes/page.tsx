import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import { format } from "date-fns";
import SizeClient from "./components/SizeClient";

async function SizesPage() {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
  });

  const formattedSizes = sizes
    .sort((a, b) => Number(a.value) - Number(b.value))
    .map((item) => {
      return {
        id: item.id,
        name: item.name,
        value: item.value,
        department: item.department,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      };
    });
  return (
    <Container>
      <div className="flex items-center justify-between border-b">
        <PageTitle
          title={`Sizes (${sizes.length})`}
          desc="Manage sizes for your store"
        ></PageTitle>
        <Button asChild>
          <Link href={`/sizes/new`} className="font-bold">
            + Add New
          </Link>
        </Button>
      </div>
      <SizeClient data={formattedSizes}></SizeClient>
    </Container>
  );
}
export default SizesPage;
