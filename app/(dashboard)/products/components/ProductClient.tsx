import { DataTable } from "@/components/DataTable";
import { ProductColumns } from "./Columns";

interface ProductClientProps {
  data: {
    id: string;
    name: string;
    department: string;
    units: number;
    price: number;
    category: string;
    isArchived: string;
    isFeatured: string;
    color: string;
    colorValue: string;
    createdAt: string;
  }[];
}

async function ProductClient({ data }: ProductClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={ProductColumns}
        api="products"
        data={data}
        dataName="Products..."
        dataName2="Colors..."
        dataName3="Categories"
        dataName4="Department"
        searchKey="name"
        searchKey2="color"
        searchKey3="category"
        searchKey4="department"
      ></DataTable>
    </div>
  );
}
export default ProductClient;
