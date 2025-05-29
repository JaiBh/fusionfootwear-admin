import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import ColorClient from "./components/ColorClient";
import RouteLink from "@/components/RouteLink";

async function ColorsPage() {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors = colors.map((item) => {
    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <Container>
      <div className="md:flex md:items-center md:justify-between border-b pb-4">
        <PageTitle
          title={`Colors (${colors.length})`}
          desc="Manage colors for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/colors/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <ColorClient data={formattedColors}></ColorClient>
    </Container>
  );
}
export default ColorsPage;
