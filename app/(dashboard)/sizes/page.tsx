import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import SizeClient from "./components/SizeClient";
import RouteLink from "@/components/RouteLink";

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
      <div className="md:flex md:items-center md:justify-between border-b pb-4">
        <PageTitle
          title={`Sizes (${sizes.length})`}
          desc="Manage sizes for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/sizes/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <SizeClient data={formattedSizes}></SizeClient>
    </Container>
  );
}
export default SizesPage;
