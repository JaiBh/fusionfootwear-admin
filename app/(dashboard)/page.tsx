import { getProductsInStock } from "@/actions/getProductsInStock";
import { getProductsOutOfStock } from "@/actions/getProductsOutOfStock";
import { getRevenueGraphData } from "@/actions/getRevenueGraphData";
import Container from "@/components/Container";
import AdjustOrderDates from "@/components/overview/AdjustOrderDates";
import ProductsInStockCard from "@/components/overview/ProductsInStockCard";
import ProductsOutStockCard from "@/components/overview/ProductsOutOfStockCard";
import RevenueGraph from "@/components/overview/RevenueGraph";
import TotalRevenueCard from "@/components/overview/TotalRevenueCard";
import TotalUnitSalesCard from "@/components/overview/TotalUnitSalesCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prismadb from "@/lib/prismadb";

async function OverviewPage() {
  const ordersRaw = await prismadb.order.findMany({
    where: {
      storeId: process.env.STORE_ID,
      isPaid: true,
    },
    include: {
      orderItems: true,
    },
  });
  const orders = ordersRaw.map((item) => {
    return {
      ...item,
      price: Number(item.price),
      shippingPrice: Number(item.shippingPrice),
      orderItems: item.orderItems.map((orderItem) => {
        return { ...orderItem, price: Number(orderItem.price) };
      }),
    };
  });
  const shiftDate = await prismadb.shiftDate.findUnique({
    where: {
      id: "123",
    },
  });

  const productsInStock = await getProductsInStock();
  const productsOutOfStock = await getProductsOutOfStock();
  const graphData = await getRevenueGraphData();

  return (
    <>
      <AdjustOrderDates shiftDate={shiftDate}></AdjustOrderDates>
      <Container>
        <div className="max-md:text-center mt-8 mb-4 space-y-1">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Overview of your store
          </p>
        </div>
        <Separator></Separator>
        <ul className="my-6 grid md:grid-cols-2 gap-4">
          <TotalRevenueCard orders={orders}></TotalRevenueCard>
          <TotalUnitSalesCard orders={orders}></TotalUnitSalesCard>
          <ProductsInStockCard
            productsInStock={productsInStock}
          ></ProductsInStockCard>
          <ProductsOutStockCard
            productsOutOfStock={productsOutOfStock}
          ></ProductsOutStockCard>
        </ul>
        <Separator></Separator>
        <Card className="mt-6 mb-10">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueGraph data={graphData}></RevenueGraph>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
export default OverviewPage;
