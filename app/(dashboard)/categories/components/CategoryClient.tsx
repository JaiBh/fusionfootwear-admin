import { DataTable } from "@/components/DataTable";
import { CategoryColumns } from "./Columns";

interface CategoryClientProps {
  data: {
    id: string;
    name: string;
    department: string;
    isArchived: boolean;
    billboardMale: string;
    billboardFemale: string;
    createdAt: string;
  }[];
}

async function CategoryClient({ data }: CategoryClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={CategoryColumns}
        api="categories"
        data={data}
        dataName="Categories..."
        searchKey="name"
      ></DataTable>
    </div>
  );
}
export default CategoryClient;
