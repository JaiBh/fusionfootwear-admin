import { DataTable } from "@/components/DataTable";
import { BillboardColumns } from "./Columns";

interface BillboardClientProps {
  data: { id: string; label: string; createdAt: string }[];
}

async function BillboardClient({ data }: BillboardClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={BillboardColumns}
        data={data}
        api="billboards"
        dataName="Billboards..."
        searchKey="label"
      ></DataTable>
    </div>
  );
}
export default BillboardClient;
