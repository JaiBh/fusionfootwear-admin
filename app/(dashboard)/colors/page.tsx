import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import { format } from "date-fns";
import ColorClient from "./components/ColorClient";

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
      <div className="flex items-center justify-between border-b">
        <PageTitle
          title={`Colors (${colors.length})`}
          desc="Manage colors for your store"
        ></PageTitle>
        <Button asChild>
          <Link href={`/colors/new`} className="font-bold">
            + Add New
          </Link>
        </Button>
      </div>
      <ColorClient data={formattedColors}></ColorClient>
    </Container>
  );
}
export default ColorsPage;
