import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import CategoryClient from "./components/CategoryClient";
import RouteLink from "@/components/RouteLink";

async function CategoriesPage() {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    include: {
      billboardMale: true,
      billboardFemale: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories = categories.map((item) => {
    return {
      id: item.id,
      name: item.name,
      billboardMale: item.billboardMale?.label || "N/A",
      billboardFemale: item.billboardFemale?.label || "N/A",
      department: item.department,
      isArchived: item.isArchived,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });
  return (
    <Container>
      <div className="md:flex md:items-center md:justify-between border-b pb-4">
        <PageTitle
          title={`Categories (${categories.length})`}
          desc="Manage Categories for your store"
        ></PageTitle>
        <Button asChild className="max-md:w-full">
          <RouteLink href={`/categories/new`} className="font-bold">
            + Add New
          </RouteLink>
        </Button>
      </div>
      <CategoryClient data={formattedCategories}></CategoryClient>
    </Container>
  );
}
export default CategoriesPage;
