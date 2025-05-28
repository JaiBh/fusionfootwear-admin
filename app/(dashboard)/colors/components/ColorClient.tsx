import { DataTable } from "@/components/DataTable";
import { ColorColumns } from "./Columns";

interface ColorClientProps {
  data: { id: string; name: string; value: string; createdAt: string }[];
}

async function ColorClient({ data }: ColorClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={ColorColumns}
        api="colors"
        data={data}
        dataName="Colors..."
        searchKey="name"
      ></DataTable>
    </div>
  );
}
export default ColorClient;
