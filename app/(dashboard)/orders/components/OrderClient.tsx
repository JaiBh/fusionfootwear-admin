import { DataTable } from "@/components/DataTable";
import { CategoryColumns } from "./Columns";

interface OrderClientProps {
  data: {
    id: string;
    paid: boolean;
    totalPrice: number;
    createdAt: string;
  }[];
}

async function OrderClient({ data }: OrderClientProps) {
  return (
    <div className="mt-6">
      <DataTable
        columns={CategoryColumns}
        api="orders"
        data={data}
        dataName="Order Id..."
        searchKey="id"
        hideDeleteSelected={true}
      ></DataTable>
    </div>
  );
}
export default OrderClient;
