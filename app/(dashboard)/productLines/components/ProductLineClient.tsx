import { DataTable } from "@/components/DataTable";
import { ProductLineColumns } from "./Columns";

interface ProductLineClientProps {
  data: {
    id: string;
    name: string;
    category: string;
    department: string;
    isArchived: boolean;
    createdAt: string;
  }[];
}

async function ProductLineClient({ data }: ProductLineClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={ProductLineColumns}
        api="productLines"
        data={data}
        dataName="Product Lines..."
        dataName2="Categories"
        searchKey="name"
        searchKey2="category"
      ></DataTable>
    </div>
  );
}
export default ProductLineClient;
