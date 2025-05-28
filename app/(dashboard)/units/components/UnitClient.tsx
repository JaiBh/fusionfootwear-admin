import { DataTable } from "@/components/DataTable";
import { UnitColumns } from "./Columns";

interface UnitClientProps {
  data: {
    id: string;
    productName: string;
    productId: string;
    color: string;
    size: string;
    isArchived: string;
    createdAt: string;
  }[];
}

async function UnitClient({ data }: UnitClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={UnitColumns}
        data={data}
        api="units"
        dataName="Product Names..."
        dataName2="Color..."
        dataName3="Sizes"
        dataName4="By Product ID"
        searchKey="productName"
        searchKey2="color"
        searchKey3="size"
        searchKey4="productId"
      ></DataTable>
    </div>
  );
}
export default UnitClient;
