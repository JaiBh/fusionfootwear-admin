import Container from "@/components/Container";
import prismadb from "@/lib/prismadb";
import OrderInfo from "./components/OrderInfo";

async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const order = await prismadb.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-[360px] p-8 border-[2px] border-black rounded text-center space-y-4">
          <h2 className="text-xl font-bold capitalize">No order found</h2>
          <p>
            The order Id provided does not match any of the orders in the
            database
          </p>
        </div>
      </div>
    );
  }

  return (
    <Container className="mb-8">
      <OrderInfo order={order}></OrderInfo>
    </Container>
  );
}
export default OrderPage;
