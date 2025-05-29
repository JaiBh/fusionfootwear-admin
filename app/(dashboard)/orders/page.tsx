import Container from "@/components/Container";
import PageTitle from "@/components/PageTitle";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import CategoryClient from "./components/OrderClient";

async function OrdersPage() {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: process.env.STORE_ID,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders = orders.map((item) => {
    return {
      id: item.id,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      totalPrice: item.price.toNumber(),
      paid: item.isPaid,
    };
  });
  return (
    <Container>
      <div className="border-b">
        <PageTitle
          title={`Orders (${orders.length})`}
          desc="Manage orders for your store"
        ></PageTitle>
      </div>
      <CategoryClient data={formattedOrders}></CategoryClient>
    </Container>
  );
}
export default OrdersPage;
