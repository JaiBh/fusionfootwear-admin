import prismadb from "@/lib/prismadb";

async function DemoDataRefresher() {
  const shiftDate = await prismadb.shiftDate.findUnique({
    where: {
      id: "123",
    },
  });

  if (shiftDate) {
    const today = new Date();
    const shiftDay = new Date(shiftDate.createdAt);
    const diffMs = today.getTime() - shiftDay.getTime();
    const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (daysPassed > 0) {
      const orders = await prismadb.order.findMany({
        where: {
          storeId: process.env.STORE_ID,
        },
      });

      orders.forEach(async (order) => {
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
        await prismadb.order.update({
          where: {
            id: order.id,
          },
          data: {
            createdAt: date,
          },
        });
      });

      const shiftDate = await prismadb.shiftDate.update({
        where: {
          id: "123",
        },
        data: {
          createdAt: new Date(),
        },
      });
    }
  }

  return null;
}
export default DemoDataRefresher;
