import { DataTable } from "@/components/DataTable";
import { sizeColumns } from "./Columns";

interface SizeClientProps {
  data: {
    id: string;
    name: string;
    value: string;
    department: string;
    createdAt: string;
  }[];
}

async function SizeClient({ data }: SizeClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={sizeColumns}
        api="sizes"
        data={data}
        dataName="Name..."
        searchKey="name"
      ></DataTable>
    </div>
  );
}
export default SizeClient;
