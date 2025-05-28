import prismadb from "@/lib/prismadb";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getRevenueGraphData = async () => {
  const now = new Date();
  const cutOff = new Date();
  cutOff.setMonth(now.getMonth() - 6);
  const rawOrders = await prismadb.order.findMany({
    where: {
      storeId: process.env.STORE_ID,
      isPaid: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const orders = rawOrders.filter((rawOrder) => {
    const date = new Date(rawOrder.createdAt);
    if (date >= cutOff) {
      return rawOrder;
    }
  });

  let graphData: { month: string; revenue: number; orders: number }[] = [];

  orders.forEach((order) => {
    const month = new Date(order.createdAt).getMonth();
    if (graphData.some((item) => item.month === months[month])) {
      graphData = graphData.map((item) => {
        if (item.month === months[month]) {
          return {
            month: item.month,
            revenue: Number((item.revenue + Number(order.price)).toFixed(2)),
            orders: item.orders + 1,
          };
        }
        return item;
      });
    } else {
      graphData.push({
        month: months[month],
        revenue: Number(order.price),
        orders: 1,
      });
    }
  });

  return graphData;
};
